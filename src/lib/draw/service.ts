import { prisma } from "@/lib/prisma";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateSecretSantaAssignments(userIds: string[]): { giverId: string; receiverId: string }[] {
  if (userIds.length < 2) {
    throw new Error("Se necesitan al menos 2 miembros");
  }

  const shuffled = shuffleArray(userIds);
  const assignments: { giverId: string; receiverId: string }[] = [];

  for (let i = 0; i < shuffled.length; i++) {
    const giverId = shuffled[i];
    const receiverId = shuffled[(i + 1) % shuffled.length];
    
    if (giverId === receiverId) {
      return generateSecretSantaAssignments(userIds);
    }
    
    assignments.push({ giverId, receiverId });
  }

  return assignments;
}

export async function startDraw(ownerId: string, groupId: string) {
  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: ownerId,
      },
    },
  });

  if (!membership || membership.role !== "OWNER") {
    throw new Error("Solo el dueño del grupo puede iniciar el sorteo");
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: { select: { userId: true } },
      assignments: { select: { id: true } },
    },
  });

  if (!group) {
    throw new Error("Grupo no encontrado");
  }

  if (group.isDrawStarted || group.assignments.length > 0) {
    throw new Error("El sorteo ya fue iniciado");
  }

  if (group.members.length < 2) {
    throw new Error("Se necesitan al menos 2 miembros para el sorteo");
  }

  const userIds = group.members.map((m) => m.userId);
  const assignments = generateSecretSantaAssignments(userIds);

  await prisma.$transaction(async (tx) => {
    const currentGroup = await tx.group.findUnique({
      where: { id: groupId },
      select: { isDrawStarted: true },
    });

    if (currentGroup?.isDrawStarted) {
      throw new Error("El sorteo ya fue iniciado");
    }

    await tx.group.update({
      where: { id: groupId },
      data: {
        isDrawStarted: true,
        drawStartedAt: new Date(),
      },
    });

    await tx.assignment.createMany({
      data: assignments.map((a) => ({
        groupId,
        giverUserId: a.giverId,
        receiverUserId: a.receiverId,
      })),
    });
  });

  return { success: true };
}
