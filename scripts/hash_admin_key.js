const bcrypt = require('bcrypt');

async function run() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/hash_admin_key.js <plain-admin-passkey>');
    process.exit(2);
  }

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(arg, saltRounds);
    console.log('BCRYPT_HASH=' + hash);
    console.log('\nCopy the hash value and set it to ADMIN_KEY in your production .env');
  } catch (e) {
    console.error('Error hashing passkey:', e.message || e);
    process.exit(1);
  }
}

run();
