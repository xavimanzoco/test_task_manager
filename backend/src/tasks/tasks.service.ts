import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

export interface AggregatedEffort {
  not_started: number;
  in_progress: number;
  done: number;
  total: number;
}

export function calculateAggregatedEffort(task: Task): AggregatedEffort {
  const result = { not_started: 0, in_progress: 0, done: 0, total: 0 };
  accumulateEffort(task, result);
  return result;
}

function accumulateEffort(task: Task, acc: AggregatedEffort): void {
  if (task.effort_estimate != null) {
    acc[task.status] += task.effort_estimate;
    acc.total += task.effort_estimate;
  }
  if (task.children) {
    for (const child of task.children) {
      accumulateEffort(child, acc);
    }
  }
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(query: QueryTasksDto) {
    const {
      status,
      priority,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = query;

    const qb = this.taskRepository
      .createQueryBuilder('task')
      .where('task.parent IS NULL')
      .loadRelationCountAndMap('task.childrenCount', 'task.children')
      .leftJoinAndSelect('task.children', 'children');

    if (status) qb.andWhere('task.status = :status', { status });
    if (priority) qb.andWhere('task.priority = :priority', { priority });
    if (search) {
      qb.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {
        search: `%${search}%`,
      });
    }

    const validSortFields = ['created_at', 'updated_at', 'title', 'status', 'priority'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    qb.orderBy(`task.${safeSortBy}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Task & { aggregatedEffort: AggregatedEffort }> {
    // Single query: fetch entire subtree using recursive CTE (no N+1)
    const rows: any[] = await this.taskRepository.query(
      `WITH RECURSIVE subtree AS (
        SELECT * FROM task WHERE id = ?
        UNION ALL
        SELECT t.* FROM task t INNER JOIN subtree s ON t.parent_id = s.id
      )
      SELECT * FROM subtree`,
      [id],
    );

    if (rows.length === 0) throw new NotFoundException(`Task ${id} not found`);

    // Assemble tree in memory
    const map = new Map<number, Task>();
    for (const row of rows) {
      const t = row as Task;
      t.children = [];
      map.set(t.id, t);
    }

    for (const row of rows) {
      if (row.parent_id != null && map.has(row.parent_id)) {
        map.get(row.parent_id)!.children.push(map.get(row.id)!);
      }
    }

    const root = map.get(id)!;
    return { ...root, aggregatedEffort: calculateAggregatedEffort(root) };
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      effort_estimate: dto.effort_estimate,
    });

    if (dto.parent_id) {
      const parent = await this.taskRepository.findOne({ where: { id: dto.parent_id } });
      if (!parent) throw new NotFoundException(`Parent task ${dto.parent_id} not found`);
      task.parent = parent;
    }

    return this.taskRepository.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);

    if (dto.parent_id !== undefined) {
      if (dto.parent_id === id) throw new BadRequestException('A task cannot be its own parent');
      const isCircular = await this.isDescendant(id, dto.parent_id);
      if (isCircular) throw new BadRequestException('Circular reference: the new parent is a descendant of this task');
      const parent = await this.taskRepository.findOne({ where: { id: dto.parent_id } });
      if (!parent) throw new NotFoundException(`Parent task ${dto.parent_id} not found`);
      task.parent = parent;
    }

    Object.assign(task, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.effort_estimate !== undefined && { effort_estimate: dto.effort_estimate }),
    });

    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    await this.taskRepository.remove(task);
  }

  // Checks if candidateId is a descendant of taskId using a recursive CTE
  private async isDescendant(taskId: number, candidateId: number): Promise<boolean> {
    const rows: any[] = await this.taskRepository.query(
      `WITH RECURSIVE subtree AS (
        SELECT id FROM task WHERE id = ?
        UNION ALL
        SELECT t.id FROM task t INNER JOIN subtree s ON t.parent_id = s.id
      )
      SELECT id FROM subtree WHERE id = ?`,
      [taskId, candidateId],
    );
    return rows.length > 0;
  }
}
