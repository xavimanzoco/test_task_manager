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
    <div className="flex items-center gap-2 justify-center mt-6">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1} // deshabilitado en la primera página
        className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages} // deshabilitado en la última página
        className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
}
