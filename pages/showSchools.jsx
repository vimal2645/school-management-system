import { useState, useEffect } from 'react';
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
      console.log('Fetching schools...');
      
      const response = await fetch('/api/schools', {
        method: 'GET',
        cache: 'no-store'
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      setSchools(data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch schools:', error);
      setError('Failed to load schools: ' + error.message);
    }
    setLoading(false);
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>Loading Schools...</h2>
          <p className={styles.loadingSubtext}>Please wait while we fetch the latest school data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorIcon}>❌</div>
          <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            onClick={() => { setLoading(true); fetchSchools(); }}
            className={styles.retryButton}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Schools Directory</h1>
        <p className={styles.subtitle}>
          Discover amazing educational institutions in our network
        </p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{schools.length}</span>
            <span className={styles.statLabel}>Schools Listed</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {schools.filter(school => school.image).length}
            </span>
            <span className={styles.statLabel}>With Images</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={styles.headerActions}>
          <button 
            onClick={fetchSchools}
            className={styles.refreshButton}
            disabled={loading}
          >
            🔄 Refresh
          </button>
          <a href="/addSchool" className={styles.addNewButton}>
            ➕ Add School
          </a>
        </div>
      </div>

      {/* Content Section */}
      {schools.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏫</div>
          <h2 className={styles.emptyTitle}>No schools found</h2>
          <p className={styles.emptyMessage}>
            Be the first to add a school to our directory!
          </p>
          <a href="/addSchool" className={styles.addButton}>
            ➕ Add First School
          </a>
        </div>
      ) : (
        <div className={styles.grid}>
          {schools.map((school) => (
            <div key={school.id} className={styles.card}>
              {/* Card Header with Image */}
              <div className={styles.cardHeader}>
                <div className={styles.imageContainer}>
                  {/* Display uploaded image or placeholder */}
                  {school.image ? (
                    <>
                      <img 
                        src={school.image} 
                        alt={`${school.name} - School Building`}
                        className={styles.schoolImage}
                        onError={handleImageError}
                        loading="lazy"
                      />
                      <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
                        <span className={styles.placeholderIcon}>🏫</span>
                        <span className={styles.placeholderText}>Image Unavailable</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span className={styles.placeholderIcon}>🏫</span>
                      <span className={styles.placeholderText}>No Image Available</span>
                    </div>
                  )}
                </div>
                
                {/* Badge */}
                <div className={styles.badge}>
                  <span className={styles.badgeText}>
                    {school.image ? 'Verified' : 'Listed'}
                  </span>
                </div>

                {/* Image overlay on hover */}
                {school.image && (
                  <div className={styles.imageOverlay}>
                    <span className={styles.overlayText}>View Image</span>
                  </div>
                )}
              </div>
              
              {/* Card Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.schoolName} title={school.name}>
                  {school.name}
                </h3>
                
                <div className={styles.schoolInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span className={styles.infoText} title={school.address}>
                      {school.address}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🌆</span>
                    <span className={styles.infoText}>
                      {school.city}, {school.state}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📞</span>
                    <span className={styles.infoText}>
                      <a href={`tel:${school.contact}`} className={styles.contactLink}>
                        {school.contact}
                      </a>
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>✉️</span>
                    <span className={styles.infoText}>
                      <a href={`mailto:${school.email_id}`} className={styles.emailLink}>
                        {school.email_id}
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>
                <button className={styles.viewButton} title="View school details">
                  👁️ View Details
                </button>
                <button 
                  className={styles.contactButton}
                  onClick={() => window.open(`mailto:${school.email_id}`, '_blank')}
                  title="Send email to school"
                >
                  📧 Contact
                </button>
              </div>

              {/* School ID for reference */}
              <div className={styles.schoolId}>
                ID: {school.id}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      {schools.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Showing {schools.length} school{schools.length !== 1 ? 's' : ''} in our directory
          </p>
          <p className={styles.footerSubtext}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
