import { useState, useMemo } from 'react';

interface UsePaginationProps {
  initialItemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  goToFirstPage: () => void;
  goToLastPage: (totalPages: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: (totalPages: number) => void;
  getTotalPages: (totalItems: number) => number;
  getPaginatedData: <T>(data: T[]) => T[];
  getPageInfo: (totalItems: number) => {
    startIndex: number;
    endIndex: number;
    totalPages: number;
    startItem: number;
    endItem: number;
  };
}

export const usePagination = ({
  initialItemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = (totalPages: number) => {
    setCurrentPage(totalPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = (totalPages: number) => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getPaginatedData = <T>(data: T[]): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getPageInfo = (totalItems: number) => {
    const totalPages = getTotalPages(totalItems);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const startItem = totalItems > 0 ? startIndex + 1 : 0;
    const endItem = endIndex;

    return {
      startIndex,
      endIndex,
      totalPages,
      startItem,
      endItem,
    };
  };

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage: handleItemsPerPageChange,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    getTotalPages,
    getPaginatedData,
    getPageInfo,
  };
}; 