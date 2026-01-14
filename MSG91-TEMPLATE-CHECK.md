# MSG91 Template Variable Configuration

## Current Code Implementation

In `sms-service.ts`, we're sending:
```typescript
const url = "https://control.msg91.com/api/v5/otp?" + new URLSearchParams({
    template_id: templateId,
    mobile: '91' + sanitizedMobile,
    authkey: MSG91_CONFIG.authKey,
    OTP: otp  // ← Variable name
})
```

## Common MSG91 Template Variables

MSG91 templates typically use placeholders like:
- `##OTP##`
- `##otp##` 
- `##VAR1##`, `##VAR2##`, etc.

## What You Need to Check

**Please verify your MSG91 DLT template for REGISTRATION:**

Template ID: `69671ce2f0f84f0363446ec4`

**Questions:**
1. What is the **exact text** of your approved template?
2. What **variable placeholder** does it use for the OTP code?
   - Is it `##OTP##`?
   - Is it `##VAR1##`?
   - Something else?

**Example Template:**
```
Your Achariya OTP is ##OTP##. Valid for 3 minutes. Do not share this with anyone.
```

If your template uses `##VAR1##` instead of `##OTP##`, we need to change the API parameter name.

**Please share:**
- The exact MSG91 template text
- The variable placeholder name
