import { Client } from 'pg';

export async function connectDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  await client.connect();
  return client;
}

export async function getSchools() {
  try {
    const client = await connectDB();
    const result = await client.query('SELECT * FROM schools ORDER BY id DESC');
    await client.end();
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    return [];
  }
}

export async function addSchool(schoolData) {
  try {
    const { name, address, city, state, contact, email_id, image } = schoolData;
    
    const client = await connectDB();
    const result = await client.query(
      'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, address, city, state, contact, email_id, image || null]
    );
    await client.end();
    
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  }
}

export async function createSchoolsTable() {
  try {
    const client = await connectDB();
    await client.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact BIGINT NOT NULL,
        image TEXT,
        email_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.end();
    console.log('Schools table created/verified successfully');
  } catch (error) {
    console.error('Table creation error:', error);
  }
}
