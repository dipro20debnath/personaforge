import pkg from 'pg';
import bcrypt from 'bcryptjs';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:eQawlhEcnygFZGGivgtejkvOuOUSpvtp@yamabiko.proxy.rlwy.net:33958/railway'
});

try {
  await client.connect();
  
  const user = await client.query('SELECT password FROM users WHERE email = $1', ['dipro@gmail.com']);
  
  if (user.rows.length === 0) {
    console.log('❌ User not found');
    process.exit(1);
  }
  
  const storedHash = user.rows[0].password;
  const testPassword = 'Ak472002#@';
  
  console.log('Testing password match...');
  console.log('Password to test:', testPassword);
  console.log('Stored hash:', storedHash.substring(0, 20) + '...');
  
  const isMatch = bcrypt.compareSync(testPassword, storedHash);
  
  if (isMatch) {
    console.log('✅ PASSWORD MATCHES!');
  } else {
    console.log('❌ PASSWORD DOES NOT MATCH!');
    console.log('');
    console.log('Hash stored in DB appears to be corrupted or using wrong password.');
  }
  
  await client.end();
} catch(e) {
  console.error('❌ Error:', e.message);
}
