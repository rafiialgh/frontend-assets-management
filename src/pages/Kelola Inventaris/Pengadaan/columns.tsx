import type { ColumnDef } from '@tanstack/react-table';
import ActionColumns from './ActionColumns';
import { Badge, badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';
import { formatDateTime } from '@/lib/utils';
import type { UserType } from '@/services/auth/auth.type';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const roleVariant: Record<string, BadgeVariant> = {
  admin: 'admin',
  superadmin: 'superadmin',
  maintenance: 'maintenance',
};

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: 'pengadaanId',
    header: 'Purchase ID',
  },
  {
    accessorKey: 'name',
    header: 'Purchase Date',
  },
  {
    accessorKey: 'lokasi',
    header: 'Lokasi',
  },
  {
    accessorKey: 'namaAset',
    header: 'Nama Aset',
  },
  {
    accessorKey: 'totalHarga',
    header: 'Cost',
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
  },
  
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const user = row.original;

      return <ActionColumns id={user.id} />;
    },
  },
];
