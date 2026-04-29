import React, { useState } from 'react';
import styles from './CategoryFormModal.module.scss';
import { updateCategory } from '../../api/updateCategory';
import type { AdminCategoryResponse, SpotCategoryUpdateDTO } from '../../types';

interface CategoryFormModalProps {
  initialData: AdminCategoryResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ initialData, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SpotCategoryUpdateDTO>({
    name: initialData.name,
    icon: initialData.icon || '',
    sort: initialData.sort
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'sort') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await updateCategory(initialData.id, formData);
      onSuccess(); // Triggers reload
      onClose();   // Closes modal
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to save category');
      } else {
        setErrorMsg('Failed to save category');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Edit Category</h3>
        {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input name="name" type="text" value={formData.name || ''} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Icon URL</label>
            <input name="icon" type="text" value={formData.icon || ''} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>Sort Priority (lower is higher)</label>
            <input name="sort" type="number" value={formData.sort ?? 0} onChange={handleChange} required />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
