import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/AddSchool.module.css';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    
    try {
      let imagePath = null;

     
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append('image', data.image[0]);
        
        console.log('Uploading image...');
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadResult = await uploadResponse.json();
        imagePath = uploadResult.imagePath;
        console.log('Image uploaded successfully:', imagePath);
      }

      //school data
      const schoolData = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        contact: parseInt(data.contact),
        email_id: data.email_id,
        image: imagePath
      };

      console.log('Submitting school data:', schoolData);

      // Submit school data
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ School added successfully with image!');
        reset();
        setImagePreview('');
      } else {
        setMessage('❌ Failed to add school: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add New School</h1>
        <p className={styles.subtitle}>Fill out the form below to register a new school in our directory</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <span className={styles.labelText}>School Name</span>
            <span className={styles.required}>*</span>
          </label>
          <input 
            {...register('name', { required: 'School name is required' })}
            type="text" 
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="Enter school name"
          />
          {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <span className={styles.labelText}>Address</span>
            <span className={styles.required}>*</span>
          </label>
          <textarea 
            {...register('address', { required: 'Address is required' })}
            className={`${styles.textarea} ${errors.address ? styles.inputError : ''}`}
            placeholder="Enter complete address"
            rows="3"
          />
          {errors.address && <span className={styles.errorText}>{errors.address.message}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.labelText}>City</span>
              <span className={styles.required}>*</span>
            </label>
            <input 
              {...register('city', { required: 'City is required' })}
              type="text" 
              className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
              placeholder="City"
            />
            {errors.city && <span className={styles.errorText}>{errors.city.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.labelText}>State</span>
              <span className={styles.required}>*</span>
            </label>
            <input 
              {...register('state', { required: 'State is required' })}
              type="text" 
              className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
              placeholder="State"
            />
            {errors.state && <span className={styles.errorText}>{errors.state.message}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.labelText}>Contact Number</span>
              <span className={styles.required}>*</span>
            </label>
            <input 
              {...register('contact', { 
                required: 'Contact is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Contact must be 10 digits'
                }
              })}
              type="tel" 
              className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
              placeholder="1234567890"
            />
            {errors.contact && <span className={styles.errorText}>{errors.contact.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.labelText}>Email</span>
              <span className={styles.required}>*</span>
            </label>
            <input 
              {...register('email_id', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email" 
              className={`${styles.input} ${errors.email_id ? styles.inputError : ''}`}
              placeholder="school@example.com"
            />
            {errors.email_id && <span className={styles.errorText}>{errors.email_id.message}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <span className={styles.labelText}>School Image</span>
          </label>
          <div className={styles.imageUploadContainer}>
            <div className={styles.fileInputWrapper}>
              <input 
                {...register('image')}
                type="file" 
                accept="image/*"
                className={styles.fileInput}
                id="image-upload"
                onChange={(e) => {
                  register('image').onChange(e);
                  handleImageChange(e);
                }}
              />
              <label htmlFor="image-upload" className={styles.fileLabel}>
                <span className={styles.fileIcon}>📷</span>
                <span>Choose School Image</span>
              </label>
            </div>
            
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                <button 
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    document.getElementById('image-upload').value = '';
                  }}
                  className={styles.removeImage}
                >
                  ❌ Remove
                </button>
              </div>
            )}
          </div>
          <small className={styles.helpText}>Upload a clear image of the school (JPG, PNG supported, max 5MB)</small>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Adding School...
            </>
          ) : (
            <>
              <span className={styles.buttonIcon}>➕</span>
              Add School
            </>
          )}
        </button>
      </form>

      {message && (
        <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}
    </div>
  );
}
