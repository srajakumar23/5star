-- CreateTable
CREATE TABLE "Campus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "campusName" TEXT NOT NULL,
    "campusCode" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "grades" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL DEFAULT 500,
    "currentEnrollment" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "campusHeadId" INTEGER,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Campus_campusName_key" ON "Campus"("campusName");

-- CreateIndex
CREATE UNIQUE INDEX "Campus_campusCode_key" ON "Campus"("campusCode");
