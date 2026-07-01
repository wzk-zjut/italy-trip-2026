import { getRepository } from "@/lib/data";
import { AdminHotelEditor } from "@/components/admin/AdminHotelEditor";

export const dynamic = "force-dynamic";

export default async function AdminHotelsPage() {
  const repo = getRepository();
  const [hotels, notes] = await Promise.all([
    repo.getHotels(),
    repo.getPrivateNotes(),
  ]);

  const privateNotes: Record<string, string> = {};
  for (const n of notes) {
    privateNotes[`${n.entity_type}:${n.entity_id}`] = n.note;
  }

  return <AdminHotelEditor hotels={hotels} privateNotes={privateNotes} />;
}
