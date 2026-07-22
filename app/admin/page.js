import { redirect } from "next/navigation";
import { isAdminSession } from "../../lib/admin-session";
import AdminDashboard from "../../components/AdminDashboard";

export default function AdminPage() {
  if (!isAdminSession()) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
