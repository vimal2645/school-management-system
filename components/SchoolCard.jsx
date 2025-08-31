import styles from '../styles/SchoolCard.module.css';

export default function SchoolCard({ school }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={school.image || '/placeholder-school.jpg'} 
          alt={school.name}
          className={styles.image}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{school.name}</h3>
        <p className={styles.address}>{school.address}</p>
        <p className={styles.city}>{school.city}</p>
      </div>
    </div>
  );
}
