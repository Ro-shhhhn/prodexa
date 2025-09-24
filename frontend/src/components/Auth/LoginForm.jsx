// C:\prodexa\frontend\src\components\Auth\LoginForm.jsx
import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Input from "../common/UI/Input";
import Button from '../common/UI/Button';
import authService from '../../services/authService';

const LoginForm = ({ onSuccess, setError }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError && setError(''); // Clear parent error
    
    try {
      const response = await authService.login(formData);
      
      if (response.success) {
        onSuccess?.(response.user, response.token);
      } else {
        setErrors({ submit: response.message || 'Login failed' });
        setError && setError(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setErrors({ submit: errorMessage });
      setError && setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        icon={Mail}
        error={errors.email}
        required
      />

      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        icon={Lock}
        error={errors.password}
        required
      />

      {errors.submit && (
        <div className="text-red-500 text-sm text-center">
          {errors.submit}
        </div>
      )}

      <Button type="submit" loading={loading} disabled={loading}>
        SIGN IN
      </Button>
    </form>
  );
};

export default LoginForm;