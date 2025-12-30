
import { generateSmartReferralCode } from '../src/lib/referral-service';
import { ROLE_PERMISSIONS } from '../src/lib/permissions';

async function verify() {
    console.log("=== Verifying Referral Code Logic ===");
    const year = new Date().getFullYear().toString().slice(-2);

    const roles = ['Parent', 'Staff', 'Alumni'];
    for (const role of roles) {
        const code = await generateSmartReferralCode(role);
        console.log(`Role: ${role.padEnd(10)} -> Code: ${code}`);

        const expectedPrefix = `ACH${year}-`;
        if (!code.startsWith(expectedPrefix)) {
            console.error(`[FAIL] ${role} code does not start with ${expectedPrefix}`);
        } else {
            console.log(`[PASS] ${role} format correct.`);
        }
    }

    console.log("\n=== Verifying Permissions Matrix ===");
    const rolesToCheck = ['Super Admin', 'Campus Head', 'Admission Admin'];
    for (const role of rolesToCheck) {
        const perms = ROLE_PERMISSIONS[role];
        if (perms && perms.passwordReset) {
            console.log(`[PASS] ${role} has 'passwordReset' module configured.`);
            console.log(`       Access: ${perms.passwordReset.access}, Scope: ${perms.passwordReset.scope}`);
        } else {
            console.error(`[FAIL] ${role} missing 'passwordReset' configuration.`);
        }
    }
}

verify().catch(console.error);
