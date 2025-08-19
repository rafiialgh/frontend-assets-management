'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, 
  PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis
 } from '@/components/ui/pagination';

import { Search, ArrowDownUp } from 'lucide-react';
import { useState, useMemo } from 'react';


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lokasiData?: { idLokasi: string; lokasi: string }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  lokasiData = [],
}: DataTableProps<TData, TValue>) {
  const [recentOrder, setRecentOrder] = useState<'Recent' | 'Oldest'>('Recent');
  const [costOrder, setCostOrder] = useState<'Cost' | 'highest' | 'lowest'>('Cost');
  const [lokasiFilter, setLokasiFilter] = useState<string | undefined>(undefined);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Apply filters + sorting
  const filteredData = useMemo(() => {
    let temp = [...data];

    // filter lokasi
    if (lokasiFilter) {
      temp = temp.filter(item => item.lokasi?.lokasi === lokasiFilter);
    }

    // filter search
    if (searchFilter) {
      temp = temp.filter(
        item =>
          item.namaAset.toLowerCase().includes(searchFilter.toLowerCase()) ||
          item.vendor.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // cost order
    if (costOrder !== 'Cost') {
      temp.sort((a, b) => {
        const costA = a.totalHarga ?? 0;
        const costB = b.totalHarga ?? 0;
        return costOrder === 'highest' ? costB - costA : costA - costB;
      });
    }

    // Recent / Oldest toggle
    if (recentOrder === 'Oldest') {
      temp.reverse(); // backend already sends Recent first
    }

    return temp;
  }, [data, lokasiFilter, searchFilter, costOrder, recentOrder]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setRecentOrder(recentOrder === 'Recent' ? 'Oldest' : 'Recent')}
            className="flex items-center gap-2 bg-transparent font-normal"
          >
            {recentOrder}
            <ArrowDownUp className="size-3" />
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              if (costOrder === 'Cost') setCostOrder('highest');
              else if (costOrder === 'highest') setCostOrder('lowest');
              else setCostOrder('Cost');
            }}
            className="flex items-center gap-2 bg-transparent font-normal"
          >
            {costOrder === 'Cost' ? 'Cost' : costOrder === 'highest' ? 'Highest' : 'Lowest'}
            <ArrowDownUp className="size-3" />
          </Button>

          <Select
            value={lokasiFilter ?? 'all'}
            onValueChange={value => setLokasiFilter(value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Lokasi</SelectItem>
              {lokasiData.map(lok => (
                <SelectItem key={lok.idLokasi} value={lok.lokasi}>
                  {lok.lokasi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by asset or vendor name"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody >
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
      </div>
    
    </div>
  );
}
