-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "adminId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "adminName" TEXT NOT NULL,
    "adminMobile" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assignedCampus" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Admin" ("adminId", "adminMobile", "adminName", "assignedCampus", "createdAt", "role") SELECT "adminId", "adminMobile", "adminName", "assignedCampus", "createdAt", "role" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_adminMobile_key" ON "Admin"("adminMobile");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
