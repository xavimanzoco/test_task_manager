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
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-400 mt-1">{total} task{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/tasks/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          + New Task
        </Link>
      </div>

      <div className="mb-6">
        <FilterBar />
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">No tasks found.</p>
          <Link href="/tasks/new" className="text-sm text-gray-900 underline mt-2 inline-block">
            Create your first task
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <Pagination total={total} page={page} limit={limit} />
    </main>
  );
}
