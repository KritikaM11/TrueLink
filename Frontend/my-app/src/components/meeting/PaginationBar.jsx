import React from 'react';

export const PaginationBar = ({ currentPage, totalPages, setPage }) => (
    <div className="pagination-bar">
        <button
            className="pagination-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={currentPage === 0}
            title="Previous page"
        >
            ‹
        </button>
        <span className="pagination-label">
            Page {currentPage + 1} of {totalPages}
        </span>
        <button
            className="pagination-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={currentPage >= totalPages - 1}
            title="Next page"
        >
            ›
        </button>
    </div>
);