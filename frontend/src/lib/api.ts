const API_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL_CLIENT || 'http://localhost:3001')
    : (process.env.API_URL_SERVER || 'http://localhost:3001');

import { Task, TasksResponse } from '@/types/task';

export async function fetchTasks(params: Record<string, string> = {}, signal?: AbortSignal): Promise<TasksResponse> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/tasks${query ? `?${query}` : ''}`, { signal });
  if (!res.ok) throw new Error('Error fetching tasks');
  return res.json();
}

export async function fetchTask(id: number): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching task');
  return res.json();
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error creating task');
  return res.json();
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error updating task');
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error deleting task');
}
