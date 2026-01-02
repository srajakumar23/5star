
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: { role: { in: ['Parent', 'Staff'] } },
        orderBy: { confirmedReferralCount: 'asc' }
    });

    console.log('--- CONSISTENCY CHECK ---');
    console.log('User | Dashboard Count | Referral List Count | Status');
    console.log('--- | --- | --- | ---');

    let allMatch = true;

    for (const u of users) {
        // Count actual leads in DB
        const actualLeadCount = await prisma.referralLead.count({
            where: {
                userId: u.userId,
                leadStatus: 'Confirmed'
            }
        });

        const dashboardCount = u.confirmedReferralCount;
        const isMatch = actualLeadCount === dashboardCount;

        if (!isMatch) allMatch = false;

        const status = isMatch ? '✅ MATCH' : `❌ MISMATCH (Diff: ${dashboardCount - actualLeadCount})`;

        console.log(`${u.fullName.padEnd(20)} | ${String(dashboardCount).padEnd(15)} | ${String(actualLeadCount).padEnd(19)} | ${status}`);
    }
    console.log('-------------------------');
    if (allMatch) {
        console.log('RESULT: ALL COUNTS MATCH PERFECTLY.');
    } else {
        console.log('RESULT: FOUND DATA INCONSISTENCIES.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
