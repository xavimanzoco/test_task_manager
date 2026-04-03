import { fetchTask } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import SubtaskList from '@/components/SubtaskList';
import TaskActions from '@/components/TaskActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  const task = await fetchTask(Number(id)).catch(() => null);

  if (!task) return notFound();

  const effort = task.aggregatedEffort;
  const totalEffort = effort?.total ?? 0;
  const donePercent = totalEffort > 0 ? Math.round(((effort?.done ?? 0) / totalEffort) * 100) : 0;

  return (
    <main className="max-w-6xl mx-auto px-8 py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/" className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium">
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Back to dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Hero card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <div className="flex gap-2 mb-5">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
              {task.title}
            </h1>
            <p className="text-slate-500 leading-relaxed text-base">
              {task.description ?? <span className="italic text-slate-300">No description provided.</span>}
            </p>
          </div>

          {/* Workload */}
          {effort && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workload Distribution</h3>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {donePercent}% complete
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${donePercent}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: effort.total, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100' },
                  { label: 'In Progress', value: effort.in_progress, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                  { label: 'Done', value: effort.done, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { label: 'Not Started', value: effort.not_started, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100' },
                ].map(({ label, value, color, bg, border }) => (
                  <div key={label} className={`${bg} border ${border} p-4 rounded-xl`}>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className={`text-[11px] font-semibold uppercase tracking-wide mt-1 ${color} opacity-70`}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Subtasks</h2>
            <SubtaskList tasks={task.children ?? []} parentId={task.id} />
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="lg:col-span-1 space-y-4">

          {/* Actions */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Actions</p>
            <TaskActions task={task} />
          </div>

          {/* Metadata */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Metadata</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Estimation</span>
                <span className="text-sm font-semibold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                  {task.effort_estimate ?? 0} pts
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Subtasks</span>
                <span className="text-sm font-semibold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                  {task.children?.length ?? 0}
                </span>
              </div>
              {totalEffort > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {donePercent}%
                  </span>
                </div>
              )}
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
}
