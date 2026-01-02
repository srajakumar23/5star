
import prisma from '../src/lib/prisma';

async function main() {
    const user = await prisma.user.findFirst();
    if (user) {
        console.log(`Found User: ${user.fullName} | Mobile: ${user.mobileNumber}`);
    } else {
        console.log("No users found.");
    }
}

main().catch(console.error);
