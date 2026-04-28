import React, { useState, useEffect } from 'react';
import styles from './SpotFormModal.module.scss';
import { createSpot } from '../../api/createSpot';
import { updateSpot } from '../../api/updateSpot';
import { getCategoryList } from '../../api/getCategoryList';
import type { SpotCreateDTO, AdminCategoryResponse } from '../../types';
import type { SpotResponse } from '../../../spots/types';

interface SpotFormModalProps {
  initialData?: SpotResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const SpotFormModal: React.FC<SpotFormModalProps> = ({ initialData, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<AdminCategoryResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SpotCreateDTO>({
    name: initialData?.name || '',
    categoryId: initialData?.categoryId || 0,
    address: initialData?.address || '',
    description: initialData?.description || '',
    images: initialData?.images || '',
    x: initialData?.x || 0,
    y: initialData?.y || 0
  });

  useEffect(() => {
    // Fetch categories on mount
    getCategoryList().then(res => {
      if(res.data) {
        setCategories(res.data);
        if(res.data.length > 0 && !initialData) {
          setFormData(prev => ({ ...prev, categoryId: res.data[0].id }));
        }
      }
    }).catch(err => console.error("Could not fetch categories", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.categoryId || isNaN(formData.x) || isNaN(formData.y)) {
       setErrorMsg("Please fill out all required fields correctly.");
       return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (initialData) {
        await updateSpot(initialData.id, formData);
      } else {
        await createSpot(formData);
      }
      onSuccess(); // Triggers reload
      onClose();   // Closes modal
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to save spot');
      } else {
        setErrorMsg('Failed to save spot');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{initialData ? 'Edit Spot' : 'Create New Spot'}</h3>
        {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name *</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Category *</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleNumberChange} required>
              <option value={0} disabled>Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Address *</label>
            <input name="address" type="text" value={formData.address} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Coordinates (X, Y) *</label>
            <div className={styles.coordGroup}>
              <input name="x" type="number" step="any" placeholder="Longitude (X)" value={formData.x || ''} onChange={handleNumberChange} required />
              <input name="y" type="number" step="any" placeholder="Latitude (Y)" value={formData.y || ''} onChange={handleNumberChange} required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3}></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Images (Comma-separated URLs)</label>
            <input name="images" type="text" value={formData.images || ''} onChange={handleChange} />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Spot')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
