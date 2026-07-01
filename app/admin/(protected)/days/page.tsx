import { getRepository } from "@/lib/data";
import { AdminDayEditor } from "@/components/admin/AdminDayEditor";

export const dynamic = "force-dynamic";

export default async function AdminDaysPage() {
  const repo = getRepository();
  const [days, hotels, notes] = await Promise.all([
    repo.getTripDays(),
    repo.getHotels(),
    repo.getPrivateNotes(),
  ]);

  const privateNotes: Record<string, string> = {};
  for (const n of notes) {
    privateNotes[`${n.entity_type}:${n.entity_id}`] = n.note;
  }

  return (
    <AdminDayEditor days={days} hotels={hotels} privateNotes={privateNotes} />
  );
}
