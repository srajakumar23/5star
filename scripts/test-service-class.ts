
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 1. Manually Load Env Vars (Critical for standalone script)
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local from:', envPath);
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.error('ERROR: .env.local not found!');
    process.exit(1);
}

// 2. Import the Service (Mocking default import if needed for Next.js compat)
// We might need to handle 'next/headers' issues if they cause import errors.
// But let's try direct import first.
async function runTest() {
    try {
        console.log('Importing smsService...');
        // Dynamic import to ensure env vars are loaded BEFORE module eval
        const { smsService } = await import('../src/lib/sms-service');

        console.log('SMS Provider Configured as:', process.env.SMS_PROVIDER);
        console.log('Auth Key Length:', process.env.MSG91_AUTH_KEY?.length);

        console.log('Attempting to send OTP via smsService.sendOTP...');
        const result = await smsService.sendOTP('9339330096', '987654', 'registration');

        console.log('Result:', JSON.stringify(result, null, 2));

    } catch (err) {
        console.error('Execution Error:', err);
    }
}

runTest();
