import type { User } from '@/services/auth/auth.type';
import type { ColumnDef } from '@tanstack/react-table';
import ActionColumns from './ActionColumns';
import { Badge } from '@/components/ui/badge';

const roleVariant: Record<string, string> = {
  admin: 'bg-[#277292] text-white hover:bg-[#277292]/90',
  superadmin: 'bg-[#163551] text-white hover:bg-[#163551]/90',
  maintenance: 'bg-[#D1A061] text-white hover:bg-[#D1A061]/90',
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: '_id',
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
      <Badge className={roleVariant[row.original.role]}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const user = row.original;

      return <ActionColumns id={user._id} />;
    },
  },
];
