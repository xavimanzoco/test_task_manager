import { fetchTasks } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data: tasks, total, page, limit } = await fetchTasks(params);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Link
          href="/tasks/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + New Task
        </Link>
      </div>

      <div className="mb-6">
        <FilterBar />
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No tasks found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <Pagination total={total} page={page} limit={limit} />
    </main>
  );
}
