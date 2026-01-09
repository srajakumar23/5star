
const { ROLE_PERMISSIONS, getDataScope } = require('../src/lib/permissions')

console.log('--- PERMISSION MATCHING TEST ---')
const rolesToTest = ['Super Admin', 'Super_Admin', 'Staff', 'Parent']
const modules = ['analytics', 'userManagement']

rolesToTest.forEach(role => {
    console.log(`Role: "${role}"`)
    modules.forEach(mod => {
        const scope = getDataScope(role, mod)
        console.log(`  Module: ${mod} -> Scope: ${scope}`)
    })
})
