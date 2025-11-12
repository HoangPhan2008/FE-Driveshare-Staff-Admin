import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function RequireRole({ allowedRoles = [], children }) {
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = authService.getRoleFromStoredToken();
    if (!role) {
      authService.logout();
      navigate('/', { replace: true });
      return;
    }
    const roleStr = role.toString().toLowerCase();
    const ok = allowedRoles.some(r => roleStr.includes(r.toString().toLowerCase()));
    if (!ok) {
      authService.logout();
      navigate('/', { replace: true });
      return;
    }
    setAllowed(true);
  }, [allowedRoles, navigate]);

  if (!allowed) return null;
  return <>{children}</>;
}
