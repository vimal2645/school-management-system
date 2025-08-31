import { connectDB } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, address, city, state, contact, email_id, image } = req.body;
      
      // Validate required fields
      if (!name || !address || !city || !state || !contact || !email_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const connection = await connectDB();
      const [result] = await connection.execute(
        'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, parseInt(contact), image || null, email_id]
      );
      
      await connection.end();
      res.status(201).json({ 
        success: true, 
        id: result.insertId,
        message: 'School added successfully!'
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to add school: ' + error.message });
    }
  } 
  else if (req.method === 'GET') {
    try {
      const connection = await connectDB();
      const [rows] = await connection.execute('SELECT * FROM schools ORDER BY id DESC');
      await connection.end();
      
      res.status(200).json(rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch schools: ' + error.message });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
