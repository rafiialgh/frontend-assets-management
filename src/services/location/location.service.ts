import { z } from 'zod'

export const locationSchema = z.object({
  lokasi: z.string().min(3, { message: 'Location must be at least 3 characters' }),
  kategori: z.array(z.string()).nonempty("Pilih minimal satu kategori"),
})

export type LocationValues = z.infer<typeof locationSchema>