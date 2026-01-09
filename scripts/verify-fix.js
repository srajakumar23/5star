
// Self-contained logic test
const ROLE_PERMISSIONS = {
    'Super Admin': {
        analytics: { access: true, scope: 'all' }
    }
};

function getDataScope(role, module) {
    const normalizedRole = role.replace(/_/g, ' ');
    const permissions = ROLE_PERMISSIONS[normalizedRole];
    if (!permissions) return 'none';
    return permissions[module]?.scope || 'none';
}

console.log('Role: "Super_Admin", Module: "analytics"');
console.log('Resulting Scope:', getDataScope('Super_Admin', 'analytics'));

if (getDataScope('Super_Admin', 'analytics') === 'all') {
    console.log('VERIFICATION SUCCESS: Role normalization works.');
} else {
    console.log('VERIFICATION FAILURE: Role normalization failed.');
}
