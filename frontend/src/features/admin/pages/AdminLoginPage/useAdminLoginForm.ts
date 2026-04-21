import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/adminLogin';
import { useAdminAuthStore } from '../../stores/useAdminAuthStore';
import type { AdminLoginRequest } from '../../types';

export const useAdminLoginForm = () => {
  const [formData, setFormData] = useState<AdminLoginRequest>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAdminAuth = useAdminAuthStore((state) => state.login);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrorMsg('Please enter username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await adminLogin(formData);
      
      const { token, id, username, role } = result.data;
      
      // Store in Zustand
      setAdminAuth(
        { id, username, role },
        token
      );

      // Redirect to some admin dashboard placeholder
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Login failed.');
      } else {
        setErrorMsg('Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    errorMsg,
    handleChange,
    handleSubmit,
  };
};
