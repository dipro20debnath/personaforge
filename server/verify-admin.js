import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:eQawlhEcnygFZGGivgtejkvOuOUSpvtp@yamabiko.proxy.rlwy.net:33958/railway'
});

try {
  await client.connect();
  const user = await client.query('SELECT id, email, role, password FROM users WHERE email = $1', ['dipro@gmail.com']);
  
  if (user.rows.length > 0) {
    console.log('✅ Admin account found:');
    console.log('Email:', user.rows[0].email);
    console.log('Role:', user.rows[0].role);
    console.log('ID:', user.rows[0].id);
    console.log('Password hash exists:', !!user.rows[0].password);
  } else {
    console.log('❌ NO admin account found in database!');
    console.log('');
    console.log('All users in database:');
    const allUsers = await client.query('SELECT email, role FROM users');
    console.log(allUsers.rows);
  }
  
  await client.end();
} catch(e) {
  console.error('❌ Error:', e.message);
}
