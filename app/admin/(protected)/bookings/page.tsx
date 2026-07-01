import { getRepository } from "@/lib/data";
import { AdminBookingEditor } from "@/components/admin/AdminBookingEditor";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const repo = getRepository();
  const [bookings, notes] = await Promise.all([
    repo.getBookings(),
    repo.getPrivateNotes(),
  ]);

  const privateNotes: Record<string, string> = {};
  for (const n of notes) {
    privateNotes[`${n.entity_type}:${n.entity_id}`] = n.note;
  }

  return <AdminBookingEditor bookings={bookings} privateNotes={privateNotes} />;
}
