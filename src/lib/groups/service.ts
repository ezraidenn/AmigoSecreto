import { prisma } from "@/lib/prisma";
import { customAlphabet } from "nanoid";

const INVITE_CODE_LENGTH = parseInt(process.env.INVITE_CODE_LENGTH || "8", 10);
const generateInviteCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", INVITE_CODE_LENGTH);

interface CreateGroupData {
  name: string;
  description?: string | null;
  location?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  eventDate?: Date | null;
}

export async function createGroup(ownerId: string, data: CreateGroupData) {
  let inviteCode: string;
  let attempts = 0;
  
  do {
    inviteCode = generateInviteCode();
    const existing = await prisma.group.findUnique({ where: { inviteCode } });
    if (!existing) break;
    attempts++;
  } while (attempts < 10);

  if (attempts >= 10) {
    throw new Error("No se pudo generar un código único");
  }

  const group = await prisma.group.create({
    data: {
      name: data.name,
      description: data.description,
      location: data.location,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      eventDate: data.eventDate,
      inviteCode,
      ownerId,
      members: {
        create: {
          userId: ownerId,
          role: "OWNER",
        },
      },
    },
  });

  return group;
}

export async function joinGroup(userId: string, inviteCode: string) {
  const normalizedCode = inviteCode.trim().toUpperCase();
  
  const group = await prisma.group.findUnique({
    where: { inviteCode: normalizedCode },
  });

  if (!group) {
    throw new Error("Código de invitación inválido");
  }

  const existingMember = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId: group.id,
        userId,
      },
    },
  });

  if (existingMember) {
    return group;
  }

  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      userId,
      role: "MEMBER",
    },
  });

  return group;
}

export async function listUserGroups(userId: string) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    include: {
      group: {
        include: {
          _count: {
            select: { members: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return memberships.map((m) => ({
    id: m.group.id,
    name: m.group.name,
    description: m.group.description,
    location: m.group.location,
    budgetMin: m.group.budgetMin,
    budgetMax: m.group.budgetMax,
    eventDate: m.group.eventDate,
    inviteCode: m.group.inviteCode,
    role: m.role,
    isDrawStarted: m.group.isDrawStarted,
    memberCount: m.group._count.members,
    createdAt: m.group.createdAt,
  }));
}

export async function getGroupOverview(userId: string, groupId: string) {
  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new Error("No tienes acceso a este grupo");
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, username: true, name: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!group) {
    throw new Error("Grupo no encontrado");
  }

  return {
    id: group.id,
    name: group.name,
    description: group.description,
    location: group.location,
    budgetMin: group.budgetMin,
    budgetMax: group.budgetMax,
    eventDate: group.eventDate,
    inviteCode: group.inviteCode,
    isDrawStarted: group.isDrawStarted,
    drawStartedAt: group.drawStartedAt,
    currentUserRole: membership.role,
    members: group.members.map((m) => ({
      id: m.user.id,
      username: m.user.username,
      name: m.user.name,
      role: m.role,
    })),
  };
}
