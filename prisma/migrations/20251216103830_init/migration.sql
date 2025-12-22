-- CreateTable
CREATE TABLE "User" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ReferralLead" (
    "leadId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentMobile" TEXT NOT NULL,
    "campus" TEXT,
    "gradeInterested" TEXT,
    "leadStatus" TEXT NOT NULL DEFAULT 'New',
    "confirmedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralLead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BenefitSlab" (
    "slabId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "referralCount" INTEGER NOT NULL,
    "yearFeeBenefitPercent" REAL NOT NULL,
    "longTermExtraPercent" REAL NOT NULL,
    "baseLongTermPercent" REAL NOT NULL DEFAULT 15
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "adminName" TEXT NOT NULL,
    "adminMobile" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNumber_key" ON "User"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "BenefitSlab_referralCount_key" ON "BenefitSlab"("referralCount");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_adminMobile_key" ON "Admin"("adminMobile");
