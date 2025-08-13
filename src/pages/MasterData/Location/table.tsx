'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { Input } from '@/components/ui/input';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (pageCount <= 2) {
      // Kalau sedikit halaman, tampilkan semua
      for (let i = 0; i < pageCount; i++) pages.push(i);
    } else {
      // Selalu tampilkan halaman pertama
      pages.push(0);

      if (pageIndex > 3) pages.push('ellipsis-prev');

      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(pageCount - 2, pageIndex + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (pageIndex < pageCount - 4) pages.push('ellipsis-next');

      // Selalu tampilkan halaman terakhir
      pages.push(pageCount - 1);
    }

    return pages;
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-end'>
        <div className='relative w-full max-w-sm'>
          <Search className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Search something'
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className='pl-8'
          />
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <span className='flex items-center gap-1 text-sm'>
          <div>Showing</div>
          <p>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </p>
        </span>

        <div className='flex items-center justify-end space-x-2 py-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href=''
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                  className={
                    !table.getCanPreviousPage()
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
              {getPageNumbers().map((p, idx) =>
                typeof p === 'number' ? (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href='#'
                      isActive={pageIndex === p}
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(p);
                      }}
                    >
                      {p + 1}
                    </PaginationLink>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={idx}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href=''
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                  className={
                    !table.getCanNextPage()
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
