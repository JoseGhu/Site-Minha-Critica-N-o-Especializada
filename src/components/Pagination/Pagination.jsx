import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, darkMode }) => {
  const pages = [];
  
  if (totalPages <= 1) return null;

  // Lógica para mostrar páginas (máximo 5 páginas visíveis)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={`pagination ${darkMode ? 'dark' : ''}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button prev"
      >
        <ChevronLeft size={16} />
        <span>Anterior</span>
      </button>

      <div className="pagination-pages">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="pagination-page"
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="pagination-page"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button next"
      >
        <span>Próxima</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;