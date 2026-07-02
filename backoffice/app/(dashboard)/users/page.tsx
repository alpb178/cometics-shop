import { listUsers, listRoles } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { UsersManager } from "./users-manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, roles, me] = await Promise.all([
    listUsers().catch(() => []),
    listRoles().catch(() => []),
    getCurrentUser()
  ]);

  return (
    <UsersManager users={users} roles={roles} currentUserId={me?.id ?? -1} />
  );
}
