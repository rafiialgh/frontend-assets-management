import type { ColumnDef } from '@tanstack/react-table';
import ActionColumns from './ActionColumns';
import { formatDateTime } from '@/lib/utils';
import type { Procurement } from '@/services/pengadaan.type';

export const columns: ColumnDef<Procurement>[] = [
  {
    accessorKey: 'pengadaanId',
    header: 'Purchase ID',
  },
  {
    accessorKey: 'tanggalBeli',
    header: 'Purchase Date',
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: 'lokasiId',
    header: 'Lokasi',
     cell: ({ row }) => row.original.lokasi?.lokasi ?? '-',
  },
  {
    accessorKey: 'namaAset',
    header: 'Nama Aset',
  },
  {
    accessorKey: 'jumlahAset',
    header: 'Jumlah',
  },
  
  {
    accessorKey: 'totalHarga',
    header: 'Total Harga',
    cell: ({ getValue }) => `Rp ${(getValue() as number).toLocaleString()}`,
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const procurement = row.original;
      return <ActionColumns id={procurement.pengadaanId} />; // pakai idPengadaan
    },
  },
];
