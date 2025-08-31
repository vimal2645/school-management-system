import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

export async function getSchools() {
  try {
    const result = await client.execute("SELECT * FROM schools ORDER BY id DESC");
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    return [];
  }
}

export async function addSchool(schoolData) {
  try {
    const { name, address, city, state, contact, email_id, image } = schoolData;
    
    const result = await client.execute({
      sql: "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
      args: [name, address, city, state, contact, email_id, image || null]
    });
    
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  }
}

export async function createSchoolsTable() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact INTEGER NOT NULL,
        image TEXT,
        email_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    return { success: true };
  } catch (error) {
    console.error('Table creation error:', error);
    throw error;
  }
}
