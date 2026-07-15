import { prisma } from "@/server/db/client";
import { requireSession } from "@/server/auth/session";
import VisitsWorkflow from "./visits-workflow";

export default async function VisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const { studentId } = await searchParams;
  const session = await requireSession();
  const permissions: string[] = (session.session as any).permissions || [];

  // Fetch active students for the student selection dropdown / combobox
  const students = await prisma.student.findMany({
    where: { deletedAt: null },
    orderBy: { studentId: "asc" },
    select: {
      id: true,
      studentId: true,
      studentName: true,
      classLevel: true,
      room: true,
    },
  });

  return (
    <VisitsWorkflow
      students={students}
      currentUserPermissions={permissions}
      initialStudentId={studentId}
    />
  );
}
