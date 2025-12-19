"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { startDraw } from "@/lib/draw/service";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function startDrawAction(groupId: string): Promise<ActionResult> {
  const user = await requireUser();

  try {
    await startDraw(user.id, groupId);
    revalidatePath(`/app/group/${groupId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al iniciar el sorteo" };
  }
}
