import type { ColumnDef } from '@tanstack/react-table';
import { Badge, badgeVariants } from '@/components/ui/badge';
import type { Location } from '@/services/location/location.type';
import type { Asset } from '@/services/asset/asset.type';
import type { VariantProps } from 'class-variance-authority';
import ActionColumns from './ActionColumns';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const statusVariant: Record<string, BadgeVariant> = {
  aktif: 'active',
  nonaktif: 'nonactive',
  maintenance: 'maintenanceOutline',
};

export const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: 'asetId',
    header: 'Asset ID',
    cell: ({ row }) => <p className='text-gray-400'>{row.original.asetId}</p>,
  },
  {
    accessorKey: 'kategoriAset',
    header: 'Kategori Aset',
    cell: ({ row }) => (
      <Badge className='capitalize' variant={'outline'}>
        {row.original.kategoriAset}
      </Badge>
    ),
  },
  {
    accessorFn: (row) => row.lokasi?.lokasi ?? '-',
    id: 'lokasi',
    header: 'Lokasi',
  },
  {
    accessorKey: 'merkDanTipe',
    header: 'Merk & Tipe',
  },
  {
    accessorKey: 'tahun',
    header: 'Thn. Pembuatan',
    cell: ({ row }) => <p className='text-gray-400'>{row.original.tahun ?? '-'}</p>,
  },
  {
    accessorKey: 'kondisiAset',
    header: 'Kondisi',
    cell: ({ row }) => {
      const kondisi = row.original.kondisiAset?.toLowerCase();

      const color =
        kondisi === 'baik'
          ? 'text-green-500'
          : kondisi === 'buruk'
          ? 'text-red-500'
          : 'text-gray-500';

      return (
        <p className={`${color} capitalize`}>{row.original.kondisiAset ?? '-'}</p>
      );
    },
  },
  {
    accessorKey: 'statusAset',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={statusVariant[row.original.statusAset]}
        className='capitalize'
      >
        {row.original.statusAset ?? '-'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const asset = row.original;

      return <ActionColumns id={String(asset.asetId)} asset={asset.kategoriAset} />;
    },
  },
];
