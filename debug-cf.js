const { Cashfree } = require("cashfree-pg");
console.log('Cashfree:', Cashfree);
console.log('Cashfree.Environment:', Cashfree.Environment);
console.log('Cashfree.SANDBOX:', Cashfree.SANDBOX);
console.log('Cashfree.XEnvironment:', Cashfree.XEnvironment);

try {
    const cf = new Cashfree(Cashfree.SANDBOX, "id", "secret");
    console.log('Instance succcess:', !!cf);
} catch (e) {
    console.log('Instance failed:', e.message);
}
