-- CreateTable
CREATE TABLE "RolePermissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "analyticsAccess" BOOLEAN NOT NULL DEFAULT true,
    "analyticsScope" TEXT NOT NULL DEFAULT 'all',
    "userMgmtAccess" BOOLEAN NOT NULL DEFAULT true,
    "userMgmtScope" TEXT NOT NULL DEFAULT 'all',
    "userMgmtCreate" BOOLEAN NOT NULL DEFAULT false,
    "userMgmtEdit" BOOLEAN NOT NULL DEFAULT false,
    "userMgmtDelete" BOOLEAN NOT NULL DEFAULT false,
    "adminMgmtAccess" BOOLEAN NOT NULL DEFAULT false,
    "adminMgmtScope" TEXT NOT NULL DEFAULT 'none',
    "adminMgmtCreate" BOOLEAN NOT NULL DEFAULT false,
    "adminMgmtEdit" BOOLEAN NOT NULL DEFAULT false,
    "adminMgmtDelete" BOOLEAN NOT NULL DEFAULT false,
    "campusPerfAccess" BOOLEAN NOT NULL DEFAULT true,
    "campusPerfScope" TEXT NOT NULL DEFAULT 'all',
    "reportsAccess" BOOLEAN NOT NULL DEFAULT true,
    "reportsScope" TEXT NOT NULL DEFAULT 'all',
    "settingsAccess" BOOLEAN NOT NULL DEFAULT false,
    "settingsScope" TEXT NOT NULL DEFAULT 'none',
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "RolePermissions_role_key" ON "RolePermissions"("role");
