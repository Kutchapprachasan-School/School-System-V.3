import { prisma } from "../src/server/db/client";
import { hashPassword } from "better-auth/crypto";

async function main() {
  console.log("🌱 Starting Database Seed...");

  // 1. Validate SUPER_ADMIN_PASSWORD
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
  if (!superAdminPassword || superAdminPassword.length < 6) {
    console.error("❌ ERROR: SUPER_ADMIN_PASSWORD environment variable is missing or less than 6 characters.");
    process.exit(1);
  }

  // 2. Seed Roles
  const rolesData = [
    { name: "ADMIN", description: "Super Administrator with full control" },
    { name: "TEACHER", description: "Teacher with academic and student management rights" },
    { name: "STUDENT", description: "Student with portal access" },
  ];

  const roles: Record<string, any> = {};
  for (const r of rolesData) {
    roles[r.name] = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
  }
  console.log("✅ Seeded Roles.");

  // 3. Seed Permissions
  const permissionsData = [
    { action: "student:create", description: "Create student profiles" },
    { action: "student:read", description: "Read student profiles" },
    { action: "student:update", description: "Update student profiles" },
    { action: "student:delete", description: "Soft delete student profiles" },
    { action: "document:create", description: "Create Saraban documents" },
    { action: "document:read", description: "Read Saraban documents" },
    { action: "document:update", description: "Update Saraban documents" },
    { action: "document:delete", description: "Delete Saraban documents" },
    { action: "academic:create", description: "Create academic documents" },
    { action: "academic:read", description: "Read academic documents" },
    { action: "academic:update", description: "Update academic documents" },
    { action: "academic:delete", description: "Delete academic documents" },
    { action: "auth:manage", description: "Manage roles and permissions" },
  ];

  const permissions: Record<string, any> = {};
  for (const p of permissionsData) {
    permissions[p.action] = await prisma.permission.upsert({
      where: { action: p.action },
      update: { description: p.description },
      create: { action: p.action, description: p.description },
    });
  }
  console.log("✅ Seeded Permissions.");

  // 4. RolePermission Links (ADMIN = all, TEACHER = academic/student/document, STUDENT = student:read)
  const rolePermissionsMap: Record<string, string[]> = {
    ADMIN: Object.keys(permissions),
    TEACHER: [
      "student:read",
      "student:update",
      "document:read",
      "academic:create",
      "academic:read",
      "academic:update",
    ],
    STUDENT: ["student:read"],
  };

  for (const roleName of Object.keys(rolePermissionsMap)) {
    const roleObj = roles[roleName];
    const actions = rolePermissionsMap[roleName];

    for (const action of actions) {
      const permObj = permissions[action];
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleObj.id,
            permissionId: permObj.id,
          },
        },
        update: {},
        create: {
          roleId: roleObj.id,
          permissionId: permObj.id,
        },
      });
    }
  }
  console.log("✅ Seeded Role-Permission links.");

  // 5. Provision SUPER_ADMIN User (create-only-if-missing, no overwrite)
  const superAdminUsername = "admin";
  const superAdminEmail = "admin@school.local";

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: superAdminUsername },
        { email: superAdminEmail },
      ],
    },
  });

  if (!existingUser) {
    const hashedPassword = await hashPassword(superAdminPassword);

    const newUser = await prisma.user.create({
      data: {
        username: superAdminUsername,
        email: superAdminEmail,
        name: "Super Admin",
        emailVerified: true,
      },
    });

    // Create Better Auth credentials account record
    await prisma.account.create({
      data: {
        userId: newUser.id,
        accountId: superAdminEmail,
        providerId: "credential",
        password: hashedPassword,
      },
    });

    // Link user to ADMIN role
    await prisma.userRole.create({
      data: {
        userId: newUser.id,
        roleId: roles.ADMIN.id,
      },
    });

    console.log(`✅ Provisioned SUPER_ADMIN user: "${superAdminUsername}"`);
  } else {
    console.log(`ℹ️ SUPER_ADMIN user already exists (ID: ${existingUser.id}). Skipping provisioning.`);
  }

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
