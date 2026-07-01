import { PageHeader } from "@/components/page-header";
import { listRoles } from "@/lib/data";
import { UserForm } from "../user-form";
import { createUserAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
  const roles = await listRoles();

  return (
    <div>
      <PageHeader
        title="Nuevo usuario"
        subtitle="Crea una cuenta de administrador o cliente"
      />
      <UserForm roles={roles} action={createUserAction} />
    </div>
  );
}
