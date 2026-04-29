import React, { useState } from 'react';
import { useAdminCategoryList } from './useAdminCategoryList';
import styles from './AdminCategoryManagementPage.module.scss';
import { CategoryFormModal } from './CategoryFormModal';
import type { AdminCategoryResponse } from '../../types';

export const AdminCategoryManagementPage: React.FC = () => {
  const { data, loading, errorMsg, refreshCategories } = useAdminCategoryList();
  const [editingCategory, setEditingCategory] = useState<AdminCategoryResponse | null>(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Category Management</h2>
      </header>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

      <div className={styles.tableContainer}>
        {loading && data.length === 0 ? (
          <div>Loading Categories...</div>
        ) : (
          <table className={styles.categoryTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Icon</th>
                <th>Name</th>
                <th>Sort Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(category => (
                <tr key={category.id}>
                  <td>#{category.id}</td>
                  <td>
                    {category.icon ? (
                      <img className={styles.catIcon} src={category.icon} alt={category.name} />
                    ) : (
                      <span className={styles.noIcon}>No Icon</span>
                    )}
                  </td>
                  <td><strong>{category.name}</strong></td>
                  <td>{category.sort}</td>
                  <td className={styles.actionsCell}>
                    <button 
                      className={styles.editBtn} 
                      onClick={() => setEditingCategory(category)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editingCategory && (
        <CategoryFormModal 
          initialData={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={refreshCategories}
        />
      )}
    </div>
  );
};
