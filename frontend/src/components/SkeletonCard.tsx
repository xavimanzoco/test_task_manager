export default function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 h-40 flex flex-col justify-between animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-slate-100 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 rounded-full w-1/2" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
          <div className="h-5 w-14 bg-slate-100 rounded-full" />
        </div>
        <div className="h-4 w-10 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}
