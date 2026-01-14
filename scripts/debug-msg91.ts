
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local...');
    dotenv.config({ path: envPath });
} else {
    console.log('No .env.local found!');
}

async function testMSG91() {
    // Load env vars
    const authKey = process.env.MSG91_AUTH_KEY;
    const senderId = process.env.MSG91_SENDER_ID;
    const templates = {
        registration: process.env.MSG91_TEMPLATE_ID_REGISTRATION,
    };

    // Test Number (User's number)
    const rawMobile = '933 933 0096'; // Simulate spaces
    const sanitizedMobile = rawMobile.replace(/\D/g, '');

    console.log('--- MSG91 Deep Debug ---');
    console.log('Sender ID:', senderId);
    console.log('Auth Key:', authKey ? 'Present' : 'MISSING');

    if (!authKey) {
        console.error('CRITICAL: MSG91_AUTH_KEY is missing from process.env');
        return;
    }

    // 1. Check Balance Strategy
    console.log('\n--- Checking Account Balance ---');
    try {
        const balanceUrl = `https://control.msg91.com/api/balance.php?authkey=${authKey}&type=4`;
        const balRes = await fetch(balanceUrl);
        const balData = await balRes.text();
        console.log('Account Balance (Transactional):', balData);
    } catch (e) {
        console.error('Failed to check balance:', e);
    }

    // 2. Test OTP
    const templateId = templates.registration;
    console.log('\nTesting Registration Template:', templateId);

    if (!templateId) {
        console.error('Missing Registration Template ID');
        return;
    }

    const url = "https://control.msg91.com/api/v5/otp?" + new URLSearchParams({
        template_id: templateId,
        mobile: '91' + sanitizedMobile,
        authkey: authKey,
        OTP: '123456'
    });

    console.log('Request URL:', url.replace(authKey, 'HIDDEN_KEY'));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.type === 'success') {
            const requestId = data.message;
            console.log('\n✅ MSG91 API Success');
            console.log(`REQUEST ID: ${requestId}`);
            console.log('Please search for this REQUEST ID in your MSG91 Logs to see the specific failure reason (e.g., Template Mismatch).');
        } else {
            console.log('❌ MSG91 API Failed:', data.message);
        }

    } catch (error) {
        console.error('Network Error:', error);
    }
}

testMSG91();
