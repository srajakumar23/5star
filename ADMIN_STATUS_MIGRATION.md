# Admin Status Field Migration

The Admin model now has a `status` field in the schema, but we need to restart the dev server to apply the changes.

## Steps to Complete:

1. **Stop the dev server** (Ctrl+C on the terminal running `npm run dev`)

2. **Push the database changes**:
   ```bash
   npx prisma db push
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Restart the dev server**:
   ```bash
   npm run dev
   ```

## What Changed:

- ✅ Added `status` field to Admin model (Active/Inactive)
- ✅ Created `updateAdminStatus` server action
- ✅ Added `handleToggleAdminStatus` handler in client
- ✅ Replaced delete button with status toggle (disabled for Super Admin)
- ✅ Added Status column to Admin table

All existing admins will default to "Active" status.
