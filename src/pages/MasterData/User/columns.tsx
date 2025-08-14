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
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant={roleVariant[row.original.role]}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => formatDateTime(row.original.lastLogin),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <span
          className={
            status == 'Online'
              ? 'text-green-500 font-medium'
              : 'text-gray-500 font-medium'
          }
        >
          {status}
        </span>
      );
    },
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
