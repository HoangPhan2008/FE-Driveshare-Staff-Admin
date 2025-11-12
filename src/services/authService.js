import api from '../configs/api';

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function extractRoleFromPayload(payload) {
  if (!payload) return null;
  // Try common claim names
  return (
    payload.role ||
    payload.Role ||
    payload.roles ||
    payload.Roles ||
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    null
  );
}

const authService = {
  login: async (email, password) => {
    try {
      const res = await api.post('/Auth/login', { Email: email, Password: password });
      if (res && res.data) {
        const payload = res.data;

        // Determine success flag from various possible fields
        const isSuccess =
          payload.isSuccess ?? payload.success ?? (typeof payload.statusCode === 'number' ? (payload.statusCode >= 200 && payload.statusCode < 300) : undefined);

        // Extract token container (result/data/Data/result)
        const data = payload.result || payload.data || payload.Data || payload;
        const access = data?.accessToken || data?.AccessToken || data?.access_token || data?.Access_Token || null;
        const refresh = data?.refreshToken || data?.RefreshToken || data?.refresh_token || null;

        if (access) localStorage.setItem('accessToken', JSON.stringify(access));
        if (refresh) localStorage.setItem('refreshToken', JSON.stringify(refresh));

        // decode role from access token if available
        const decoded = parseJwt(access);
        const role = extractRoleFromPayload(decoded) || payload?.role || payload?.Role || null;

        return { ...payload, role, isSuccess };
      }
      return { message: 'No response', statusCode: 500, success: false };
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Network error';
      const statusCode = err?.response?.status || 500;
      return { message, statusCode, success: false };
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  getRoleFromStoredToken: () => {
    try {
      const raw = localStorage.getItem('accessToken');
      const token = raw ? JSON.parse(raw) : null;
      const decoded = parseJwt(token);
      return extractRoleFromPayload(decoded);
    } catch (e) {
      return null;
    }
  }
};

export default authService;
