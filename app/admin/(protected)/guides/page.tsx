import { getRepository } from "@/lib/data";
import { AdminGuideEditor } from "@/components/admin/AdminGuideEditor";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  const guides = await getRepository().getGuides();
  return <AdminGuideEditor guides={guides} />;
}
