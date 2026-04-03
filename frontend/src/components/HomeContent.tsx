'use client';

import { useState, useEffect, Suspense } from 'react';
import { fetchTasks } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import TaskForm from '@/components/TaskForm';
import SkeletonCard from '@/components/SkeletonCard';
import Toast from '@/components/Toast';
import { TasksResponse, TaskStatus } from '@/types/task';
import { useSearchParams } from 'next/navigation';

export default function HomeContent() {
  const searchParams = useSearchParams();
  const [response, setResponse] = useState<TasksResponse>({ data: [], total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFetchError(false);

    async function load() {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const data = await fetchTasks(params, controller.signal);
        setResponse(data);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setFetchError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [searchParams]);

  const { data: tasks, total, page, limit } = response;
  const activeTasks = tasks.filter(t => t.status !== TaskStatus.DONE).length;

  return (
    <main className="max-w-6xl mx-auto px-8 py-6">
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            You have <span className="text-indigo-600">{activeTasks} active tasks</span> for this period.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 active:scale-95"
        >
          + Create Task
        </button>
      </div>

      <div className="mb-10">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      {fetchError ? (
        <div className="text-center py-32 bg-white/50 border-2 border-dashed border-red-100 rounded-3xl">
          <p className="text-slate-600 text-sm font-semibold mb-1">Could not connect to the server</p>
          <p className="text-slate-400 text-xs mb-4">Make sure the backend is running on port 3001.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 underline"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-32 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-2xl mb-2">🗂</p>
          <p className="text-slate-600 text-sm font-semibold">No tasks found</p>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or create a new task.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <div className="mt-12">
        <Suspense>
          <Pagination total={total} page={page} limit={limit} />
        </Suspense>
      </div>

      {showModal && (
        <Modal title="New Task" onClose={() => setShowModal(false)}>
          <TaskForm
            onCancel={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              setToast('Task created successfully');
            }}
          />
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </main>
  );
}
