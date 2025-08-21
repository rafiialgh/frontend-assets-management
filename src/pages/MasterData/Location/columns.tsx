import type { ColumnDef } from '@tanstack/react-table';
import ActionColumns from './ActionColumns';
import { Badge } from '@/components/ui/badge';
import type { Location } from '@/services/location/location.type';

export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: 'lokasi',
    header: 'Lokasi',
  },
  {
    accessorKey: 'totalAset',
    header: 'Total Aset',
    cell: ({ row }) => {
      const asset = row.original;

      return <>{`${asset.totalAset} Aset`}</>;
    },
  },
  {
    accessorKey: 'subKategoriAset',
    header: 'Sub Kategori Aset',
    cell: ({ row }) => {
      const subCategory = row.original.subKategoriAset;

      return (
        <div className='flex gap-1 flex-wrap'>
          {subCategory.map((cat, idx) => (
            <Badge key={idx} variant='outline' className='capitalize'>
              {cat.nameSubAset}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const user = row.original;

      return <ActionColumns id={String(user.idLokasi)} />;
    },
  },
];
