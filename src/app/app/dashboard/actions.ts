"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { createGroup, joinGroup } from "@/lib/groups/service";
import { createGroupSchema, joinGroupSchema } from "@/lib/validations/group";

type ActionResult = {
  success: boolean;
  error?: string;
  groupId?: string;
};

export async function createGroupAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  
  const rawData = {
    name: formData.get("name") as string,
  };

  const parsed = createGroupSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Datos inválidos" };
  }

  try {
    const group = await createGroup(user.id, parsed.data.name);
    revalidatePath("/app/dashboard");
    return { success: true, groupId: group.id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al crear el grupo" };
  }
}

export async function joinGroupAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  
  const rawData = {
    inviteCode: formData.get("inviteCode") as string,
  };

  const parsed = joinGroupSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Código inválido" };
  }

  try {
    const group = await joinGroup(user.id, parsed.data.inviteCode);
    revalidatePath("/app/dashboard");
    return { success: true, groupId: group.id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al unirse al grupo" };
  }
}
