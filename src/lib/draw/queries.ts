import { prisma } from "@/lib/prisma";

export async function getMyAssignment(userId: string, groupId: string) {
  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  if (!membership) {
    return null;
  }

  const assignment = await prisma.assignment.findUnique({
    where: {
      groupId_giverUserId: {
        groupId,
        giverUserId: userId,
      },
    },
    include: {
      receiver: {
        select: { username: true, name: true },
      },
    },
  });

  if (!assignment) {
    return null;
  }

  return {
    receiverName: assignment.receiver.name,
    receiverUsername: assignment.receiver.username,
  };
}
