-- AlterTable
ALTER TABLE "Admin" ADD COLUMN "assignedCampus" TEXT;

-- AlterTable
ALTER TABLE "ReferralLead" ADD COLUMN "admittedYear" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "childInAchariya" BOOLEAN NOT NULL,
    "childName" TEXT,
    "bankAccountDetails" TEXT,
    "referralCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "confirmedReferralCount" INTEGER NOT NULL DEFAULT 0,
    "yearFeeBenefitPercent" REAL NOT NULL DEFAULT 0,
    "longTermBenefitPercent" REAL NOT NULL DEFAULT 0,
    "lastActiveYear" INTEGER,
    "benefitStatus" TEXT NOT NULL DEFAULT 'Active',
    "isFiveStarMember" BOOLEAN NOT NULL DEFAULT false,
    "assignedCampus" TEXT,
    "studentFee" INTEGER NOT NULL DEFAULT 60000,
    "academicYear" TEXT NOT NULL DEFAULT '2025-2026',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("bankAccountDetails", "benefitStatus", "childInAchariya", "childName", "confirmedReferralCount", "createdAt", "fullName", "lastActiveYear", "longTermBenefitPercent", "mobileNumber", "referralCode", "role", "status", "userId", "yearFeeBenefitPercent") SELECT "bankAccountDetails", "benefitStatus", "childInAchariya", "childName", "confirmedReferralCount", "createdAt", "fullName", "lastActiveYear", "longTermBenefitPercent", "mobileNumber", "referralCode", "role", "status", "userId", "yearFeeBenefitPercent" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_mobileNumber_key" ON "User"("mobileNumber");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
