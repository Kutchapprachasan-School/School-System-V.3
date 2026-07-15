import { prisma } from "@/server/db/client";
import { requireSession } from "@/server/auth/session";
import StudentRegistryConsole from "./registry-console";

export default async function StudentsPage() {
  // 1. Fetch active session and inject user permissions
  const session = await requireSession();
  const permissions: string[] = (session.session as any).permissions || [];

  const students = await prisma.student.findMany({
    where: { deletedAt: null },
    orderBy: { studentId: "asc" },
    select: {
      id: true,
      studentId: true,
      studentName: true,
      classLevel: true,
      room: true,
      status: true,
      profileImage: true,
    },
  });

  return (
    <StudentRegistryConsole
      initialStudents={students}
      currentUserPermissions={permissions}
    />
  );
}
