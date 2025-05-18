import { ReactNode } from 'react';

import { TPaginationProps } from './types';

import style from './Pagination.module.scss';

function Pagination(props: TPaginationProps) {
  const { currentPage, totalPages, onPageChange } = props;

  if (totalPages === 1) {
    return null;
  }

  const renderPagination = () => {
    const paginationItems: ReactNode[] = [];

    // Добавляем стрелку "назад"
    paginationItems.push(
      <button
        key="prev"
        className={`${style.pageButton} ${
          currentPage === 1 ? style.disabled : ''
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    );

    // Логика отображения страниц
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) {
        paginationItems.push(
          <button
            type="button"
            key={i}
            className={`${style.pageButton} ${
              currentPage === i ? style.active : ''
            }`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // Отображаем первую страницу
      paginationItems.push(
        <button
          type="button"
          key={1}
          className={`${style.pageButton} ${
            currentPage === 1 ? style.active : ''
          }`}
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );

      // Добавляем многоточие, если текущая страница больше 3
      if (currentPage > 3) {
        paginationItems.push(<span key="dots1">...</span>);
      }

      // Определяем диапазон страниц для отображения
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i += 1) {
        paginationItems.push(
          <button
            type="button"
            key={i}
            className={`${style.pageButton} ${
              currentPage === i ? style.active : ''
            }`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }

      // Добавляем многоточие, если текущая страница меньше, чем предпоследняя
      if (currentPage < totalPages - 2) {
        paginationItems.push(<span key="dots2">...</span>);
      }

      // Отображаем последнюю страницу
      if (totalPages > 1) {
        paginationItems.push(
          <button
            type="button"
            key={totalPages}
            className={`${style.pageButton} ${
              currentPage === totalPages ? style.active : ''
            }`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    // Добавляем стрелку "вперед"
    paginationItems.push(
      <button
        key="next"
        className={`${style.pageButton} ${
          currentPage === totalPages ? style.disabled : ''
        }`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    );

    return paginationItems;
  };

  return <nav className={style.pagination}>{renderPagination()}</nav>;
}

export default Pagination;
