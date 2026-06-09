"use client";
import { useRouter, usePathname } from "next/navigation";

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`${pathname}?page=${newPage}`);
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2 px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="mx-2">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2 px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
