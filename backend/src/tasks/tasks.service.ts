import { Injectable, NotFoundException } from '@nestjs/common';
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
      .loadRelationCountAndMap('task.childrenCount', 'task.children');

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
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!task) throw new NotFoundException(`Task ${id} not found`);

    await this.loadChildrenRecursive(task);

    return { ...task, aggregatedEffort: calculateAggregatedEffort(task) };
  }

  private async loadChildrenRecursive(task: Task, depth = 0): Promise<void> {
    if (depth >= 10 || !task.children?.length) return;
    for (const child of task.children) {
      const loaded = await this.taskRepository.findOne({
        where: { id: child.id },
        relations: ['children'],
      });
      child.children = loaded?.children ?? [];
      await this.loadChildrenRecursive(child, depth + 1);
    }
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
}
