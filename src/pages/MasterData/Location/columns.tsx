import type { ColumnDef } from '@tanstack/react-table';
import ActionColumns from './ActionColumns';
import { Badge, badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';
import { formatDateTime } from '@/lib/utils';
import type { Location } from '@/services/location/location.type';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const roleVariant: Record<string, BadgeVariant> = {
  admin: 'admin',
  superadmin: 'superadmin',
  maintenance: 'maintenance',
};

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
    accessorKey: 'kategoriAset',
    header: 'Kategori Aset',
    cell: ({ row }) => {
      const category = row.original.kategoriAset;

      return (
        <div className='flex gap-1 flex-wrap'>
          {category.map((cat, idx) => (
            <Badge key={idx} variant='outline' className='capitalize'>
              {cat}
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
