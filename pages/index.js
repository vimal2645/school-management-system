import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          School Management
          <span className={styles.highlight}> System</span>
        </h1>
        <p className={styles.description}>
          Manage and discover educational institutions with our comprehensive school directory platform
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📝</span>
            <span>Easy Registration</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔍</span>
            <span>School Directory</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📱</span>
            <span>Mobile Friendly</span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <Link href="/addSchool" className={styles.primaryButton}>
            <span className={styles.buttonIcon}>➕</span>
            Add New School
          </Link>
          <Link href="/showSchools" className={styles.secondaryButton}>
            <span className={styles.buttonIcon}>👁️</span>
            View All Schools
          </Link>
        </div>
      </div>
    </div>
  );
}
