import { getSchools, addSchool, createSchoolsTable } from '../../lib/postgres-db';

export default async function handler(req, res) {
  // Create table if it doesn't exist
  await createSchoolsTable();

  if (req.method === 'GET') {
    try {
      const schools = await getSchools();
      res.status(200).json(schools);
    } catch (error) {
      console.error('GET error:', error);
      res.status(500).json({ error: 'Failed to fetch schools' });
    }
  } 
  else if (req.method === 'POST') {
    try {
      const { name, address, city, state, contact, email_id, image } = req.body;
      
      // Validate required fields
      if (!name || !address || !city || !state || !contact || !email_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await addSchool({ 
        name, 
        address, 
        city, 
        state, 
        contact: parseInt(contact), 
        email_id, 
        image 
      });

      res.status(201).json({
        success: true,
        id: result.id,
        message: 'School added successfully!'
      });
    } catch (error) {
      console.error('POST error:', error);
      res.status(500).json({ error: 'Failed to add school: ' + error.message });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
