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
import { ArrowDownUp, Search } from 'lucide-react';
import type { Dropdown } from '@/services/global/global.type';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  dropdown: Dropdown | undefined;
  isLoading?: boolean;
  page: number;
  setPage: (page: number) => void;
  searchFilter: string;
  setSearchFilter: (value: string) => void;
  recentFilter: string | undefined;
  setRecentFilter: (value: string | undefined) => void;
  locationFilter: string | undefined;
  setLocationFilter: (value: string | undefined) => void;
  categoryFilter: string | undefined;
  setCategoryFilter: (value: string | undefined) => void;
  conditionFilter: string | undefined;
  setConditionFilter: (value: string | undefined) => void;
  statusFilter: string | undefined;
  setStatusFilter: (value: string | undefined) => void;
}

export function AssetTable<TData, TValue>({
  columns,
  data,
  pagination,
  searchFilter,
  setSearchFilter,
  recentFilter,
  setRecentFilter,
  locationFilter,
  setLocationFilter,
  categoryFilter,
  setCategoryFilter,
  conditionFilter,
  setConditionFilter,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  isLoading,
  dropdown,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    pageCount: pagination?.totalPages ?? -1,
    rowCount: pagination?.totalItems ?? -1,
    state: {
      pagination: {
        pageIndex: page - 1, // API biasanya 1-based, tanstack-table 0-based
        pageSize: pagination?.pageSize ?? 10,
      },
    },
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

  console.log(dropdown?.kategoriAset);

  return (
    <div className='space-y-4'>
      <div className='flex flex-col 2xl:flex-row items-center justify-between gap-3'>
        <div className='grid grid-cols-3 xl:grid-cols-5 gap-3 w-full'>
          {/* Recent */}
          <Select
            value={recentFilter ?? 'recent'}
            onValueChange={(value) =>
              setRecentFilter(value === 'recent' ? undefined : value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Recent' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='recent'>Recent <ArrowDownUp /></SelectItem>
              <SelectItem value='asc'>Asc</SelectItem>
              <SelectItem value='desc'>Desc</SelectItem>
            </SelectContent>
          </Select>

          {/* Lokasi */}
          <Select
            value={locationFilter ?? 'lokasi'}
            onValueChange={(value) =>
              setLocationFilter(value === 'lokasi' ? undefined : value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Lokasi' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='lokasi'>Lokasi</SelectItem>
              {dropdown?.lokasi?.map((loc, index) => (
                <SelectItem key={index} value={loc.idLokasi}>
                  {loc.lokasi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Kategori */}
          <Select
            value={categoryFilter ?? 'kategori'}
            onValueChange={(value) =>
              setCategoryFilter(value === 'kategori' ? undefined : value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Kategori' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='kategori'>Kategori</SelectItem>
              {dropdown?.kategoriAset?.map((kat, index) => (
                <SelectItem key={index} value={kat} className='capitalize'>
                  {kat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Kondisi Aset */}
          <Select
            value={conditionFilter ?? 'kondisi'}
            onValueChange={(value) =>
              setConditionFilter(value === 'kondisi' ? undefined : value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Kondisi' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='kondisi'>Kondisi</SelectItem>
              {dropdown?.kondisiAset?.map((kon, index) => (
                <SelectItem key={index} value={kon} className='capitalize'>
                  {kon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={statusFilter ?? 'status'}
            onValueChange={(value) =>
              setStatusFilter(value === 'status' ? undefined : value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='status'>All Status</SelectItem>
              {dropdown?.statusAset?.map((stat, index) => (
                <SelectItem key={index} value={stat} className='capitalize'>
                  {stat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='relative w-full'>
          <Search className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Search something'
            value={searchFilter ?? ''}
            onChange={(event) => setSearchFilter(event.target.value)}
            className='pl-8'
          />
        </div>
      </div>

      <div className='rounded-md border overflow-x-auto'>
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
                  {isLoading ? 'Loading data..' : 'No results.'}
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
                    if (page > 1) setPage(page - 1);
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
                        setPage(p + 1);
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
                    if (page < (pagination?.totalPages ?? 1)) setPage(page + 1);
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
