'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
}

export default function Pagination({ total, page, limit }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / limit); // cuántas páginas hay en total

  if (totalPages <= 1) return null; // si hay una sola página no muestra nada

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString()); // copia los params actuales
    params.set('page', String(newPage)); // actualiza solo el page
    router.push(`/?${params.toString()}`); // navega manteniendo los filtros
  }

  return (
    <div className="flex items-center gap-3 justify-center mt-6">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Previous
      </button>

      <span className="text-sm text-slate-400 font-medium px-2">
        {page} / {totalPages}
      </span>

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  );
}
