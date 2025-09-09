'use client';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex gap-1">
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-md border ${
            page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
