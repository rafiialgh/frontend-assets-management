import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface ActionColumnProps {
  id: string;
}

export default function ActionColumns({ id }: ActionColumnProps) {
  return (
    <div className='inline-flex items-center gap-4 p-5'>
      <Button size='sm' variant='secondary' asChild>
        <Link to={`/admin/genres/edit/${id}`}>
          <Edit className='w-4 h-4' />
          {/* Edit */}
        </Link>
      </Button>
      <Button
        // isLoading={isPending}
        // onClick={handleDelete}
        size='sm'
        variant={'secondary'}
      >
        <Trash className='w-4 h-4' />
        {/* Delete */}
      </Button>
    </div>
  )
}
