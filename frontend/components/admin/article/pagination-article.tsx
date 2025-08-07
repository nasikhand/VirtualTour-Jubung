"use client";

import React from "react";

interface PaginationArticlesProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationArticles = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationArticlesProps) => {
  const siblings = 1;
  const totalNumbers = siblings * 2 + 5;
  const totalBlocks = totalNumbers;

  const renderPageNumbers = () => {
    const pages = [];

    const renderPage = (page: number) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-8 h-8 rounded-full text-sm font-semibold border ${
          page === currentPage
            ? "bg-green-700 text-white"
            : "border-green-600 text-green-700 hover:bg-green-100"
        }`}
      >
        {page}
      </button>
    );

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblings);
      const endPage = Math.min(totalPages - 1, currentPage + siblings);

      pages.push(renderPage(1));

      if (startPage > 2) pages.push(<span key="start-ellipsis" className="px-2">...</span>);

      for (let page = startPage; page <= endPage; page++) {
        pages.push(renderPage(page));
      }

      if (endPage < totalPages - 1) pages.push(<span key="end-ellipsis" className="px-2">...</span>);

      pages.push(renderPage(totalPages));
    } else {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(renderPage(page));
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-10 gap-2 items-center flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-full border text-sm font-semibold ${
          currentPage === 1
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-green-700 border-green-600 hover:bg-green-100"
        }`}
      >
        Prev
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-full border text-sm font-semibold ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-green-700 border-green-600 hover:bg-green-100"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationArticles;
