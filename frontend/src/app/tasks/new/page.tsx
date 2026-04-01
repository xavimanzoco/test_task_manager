import TaskForm from '@/components/TaskForm';

export default function NewTaskPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Task</h1>
      <TaskForm />
    </main>
  );
}
