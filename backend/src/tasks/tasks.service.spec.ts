import { calculateAggregatedEffort } from './tasks.service';
import { Task } from './task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { TaskPriority } from './enums/task-priority.enum';
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 1,
    title: 'Test task',
    description: null,
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.MEDIUM,
    effort_estimate: null,
    parent: null,
    children: [],
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  } as Task;
}

describe('calculateAggregatedEffort', () => {
  it('tarea sin effort devuelve todo en cero', () => {
    const task = makeTask({ effort_estimate: null });
    expect(calculateAggregatedEffort(task)).toEqual({
      not_started: 0,
      in_progress: 0,
      done: 0,
      total: 0,
    });
  });

  it('tarea con effort se agrupa por su status', () => {
    const task = makeTask({ effort_estimate: 5, status: TaskStatus.DONE });
    expect(calculateAggregatedEffort(task)).toEqual({
      not_started: 0,
      in_progress: 0,
      done: 5,
      total: 5,
    });
  });

  it('agrega effort de hijos directos', () => {
    const task = makeTask({
      effort_estimate: 2,
      status: TaskStatus.NOT_STARTED,
      children: [
        makeTask({ id: 2, effort_estimate: 3, status: TaskStatus.IN_PROGRESS }),
        makeTask({ id: 3, effort_estimate: 4, status: TaskStatus.DONE }),
      ],
    });
    expect(calculateAggregatedEffort(task)).toEqual({
      not_started: 2,
      in_progress: 3,
      done: 4,
      total: 9,
    });
  });

  it('agrega effort de árbol profundo (3 niveles)', () => {
    const task = makeTask({
      effort_estimate: 1,
      status: TaskStatus.NOT_STARTED,
      children: [
        makeTask({
          id: 2,
          effort_estimate: 2,
          status: TaskStatus.IN_PROGRESS,
          children: [
            makeTask({ id: 3, effort_estimate: 3, status: TaskStatus.DONE }),
          ],
        }),
      ],
    });
    expect(calculateAggregatedEffort(task)).toEqual({
      not_started: 1,
      in_progress: 2,
      done: 3,
      total: 6,
    });
  });

  it('ignora nodos sin effort_estimate', () => {
    const task = makeTask({
      effort_estimate: null,
      children: [
        makeTask({ id: 2, effort_estimate: 5, status: TaskStatus.DONE }),
        makeTask({ id: 3, effort_estimate: null }),
      ],
    });
    expect(calculateAggregatedEffort(task)).toEqual({
      not_started: 0,
      in_progress: 0,
      done: 5,
      total: 5,
    });
  });
});

describe('TasksService.create', () => {
  let service: TasksService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((task) => Promise.resolve({ id: 1, ...task })),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('crea una tarea sin padre', async () => {
    const result = await service.create({ title: 'Nueva tarea' });
    expect(result.title).toBe('Nueva tarea');
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('falla si el parent_id no existe', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(
      service.create({ title: 'Subtarea', parent_id: 999 }),
    ).rejects.toThrow(NotFoundException);
  });
});
