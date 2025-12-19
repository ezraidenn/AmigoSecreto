"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { updateGroupSchema } from "@/lib/validations/group";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function updateGroupAction(
  groupId: string,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser();

  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    location: formData.get("location") as string,
    budgetMin: formData.get("budgetMin") as string,
    budgetMax: formData.get("budgetMax") as string,
    eventDate: formData.get("eventDate") as string,
  };

  const parsed = updateGroupSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Datos inválidos" };
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: user.id },
    },
  });

  if (!membership || membership.role !== "OWNER") {
    return { success: false, error: "Solo el dueño puede editar el grupo" };
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    return { success: false, error: "Grupo no encontrado" };
  }

  await prisma.group.update({
    where: { id: groupId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      location: parsed.data.location,
      budgetMin: parsed.data.budgetMin,
      budgetMax: parsed.data.budgetMax,
      eventDate: parsed.data.eventDate,
    },
  });

  revalidatePath(`/app/group/${groupId}`);
  return { success: true };
}

export async function deleteGroupAction(groupId: string): Promise<ActionResult> {
  const user = await requireUser();

  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: user.id },
    },
  });

  if (!membership || membership.role !== "OWNER") {
    return { success: false, error: "Solo el dueño puede eliminar el grupo" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.assignment.deleteMany({ where: { groupId } });
    await tx.groupMember.deleteMany({ where: { groupId } });
    await tx.group.delete({ where: { id: groupId } });
  });

  redirect("/app/dashboard");
}

export async function removeMemberAction(
  groupId: string,
  memberId: string
): Promise<ActionResult> {
  const user = await requireUser();

  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: user.id },
    },
  });

  if (!membership || membership.role !== "OWNER") {
    return { success: false, error: "Solo el dueño puede remover miembros" };
  }

  if (memberId === user.id) {
    return { success: false, error: "No puedes removerte a ti mismo" };
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (group?.isDrawStarted) {
    return { success: false, error: "No puedes remover miembros después del sorteo" };
  }

  const targetMember = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: memberId },
    },
  });

  if (!targetMember) {
    return { success: false, error: "Miembro no encontrado" };
  }

  await prisma.groupMember.delete({
    where: {
      groupId_userId: { groupId, userId: memberId },
    },
  });

  revalidatePath(`/app/group/${groupId}`);
  return { success: true };
}

export async function leaveGroupAction(groupId: string): Promise<ActionResult> {
  const user = await requireUser();

  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: user.id },
    },
  });

  if (!membership) {
    return { success: false, error: "No eres miembro de este grupo" };
  }

  if (membership.role === "OWNER") {
    return { success: false, error: "El dueño no puede abandonar el grupo. Elimínalo en su lugar." };
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (group?.isDrawStarted) {
    return { success: false, error: "No puedes abandonar un grupo con sorteo iniciado" };
  }

  await prisma.groupMember.delete({
    where: {
      groupId_userId: { groupId, userId: user.id },
    },
  });

  redirect("/app/dashboard");
}

export async function regenerateInviteCodeAction(groupId: string): Promise<ActionResult> {
  const user = await requireUser();
  const { customAlphabet } = await import("nanoid");

  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: { groupId, userId: user.id },
    },
  });

  if (!membership || membership.role !== "OWNER") {
    return { success: false, error: "Solo el dueño puede regenerar el código" };
  }

  const INVITE_CODE_LENGTH = parseInt(process.env.INVITE_CODE_LENGTH || "8", 10);
  const generateInviteCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", INVITE_CODE_LENGTH);

  let newCode: string;
  let attempts = 0;

  do {
    newCode = generateInviteCode();
    const existing = await prisma.group.findUnique({ where: { inviteCode: newCode } });
    if (!existing) break;
    attempts++;
  } while (attempts < 10);

  if (attempts >= 10) {
    return { success: false, error: "No se pudo generar un código único" };
  }

  await prisma.group.update({
    where: { id: groupId },
    data: { inviteCode: newCode },
  });

  revalidatePath(`/app/group/${groupId}`);
  return { success: true };
}
