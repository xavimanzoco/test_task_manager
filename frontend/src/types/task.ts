export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  effort_estimate: number | null;
  parent_id?: number | null;
  children?: Task[];
  childrenCount?: number;
  aggregatedEffort?: {
    not_started: number;
    in_progress: number;
    done: number;
    total: number;
  };
  created_at: string;
  updated_at: string;
}

export interface TasksResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}
