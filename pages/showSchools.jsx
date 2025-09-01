import { useState, useEffect } from 'react';
import SchoolCard from '../components/SchoolCard';
import styles from '../styles/ShowSchools.module.css';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schools');
      const data = await response.json();
      
      if (response.ok) {
        // Convert image filenames to full API paths
        const schoolsWithImagePaths = data.map(school => ({
          ...school,
          image: school.image ? `/api/image-serve?filename=${school.image}` : null
        }));
        setSchools(schoolsWithImagePaths);
      } else {
        setError('Failed to load schools');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>❌ {error}</p>
          <button onClick={fetchSchools} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🏫 Schools Directory</h1>
        <p className={styles.subtitle}>
          Discover amazing schools in your area
        </p>
        <p className={styles.count}>
          {schools.length} {schools.length === 1 ? 'school' : 'schools'} found
        </p>
      </div>

      {schools.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏫</div>
          <h2>No schools found</h2>
          <p>Be the first to add a school to our directory!</p>
          <a href="/addSchool" className={styles.addButton}>
            ➕ Add School
          </a>
        </div>
      ) : (
        <div className={styles.schoolsGrid}>
          {schools.map((school) => (
            <div key={school.id} className={styles.schoolCard}>
              <div className={styles.imageContainer}>
                {school.image ? (
                  <img 
                    src={school.image}
                    alt={`${school.name} - School Building`}
                    className={styles.schoolImage}
                    onError={(e) => {
                      console.log('Image failed to load:', school.image);
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                    loading="lazy"
                  />
                ) : null}
                <div className={styles.imagePlaceholder} style={{ display: school.image ? 'none' : 'flex' }}>
                  <span className={styles.placeholderIcon}>🏫</span>
                  <span className={styles.placeholderText}>No Image</span>
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.schoolName}>{school.name}</h3>
                <div className={styles.schoolInfo}>
                  <p className={styles.address}>
                    <span className={styles.icon}>📍</span>
                    {school.address}
                  </p>
                  <p className={styles.location}>
                    <span className={styles.icon}>🌆</span>
                    {school.city}, {school.state}
                  </p>
                  <p className={styles.contact}>
                    <span className={styles.icon}>📞</span>
                    {school.contact}
                  </p>
                  <p className={styles.email}>
                    <span className={styles.icon}>✉️</span>
                    {school.email_id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
