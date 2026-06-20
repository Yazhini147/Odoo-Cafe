import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Redirects to Login ("/") if no valid current_user is found in localStorage.
 * Restricts access to routes based on allowedRole ('Admin' or 'Employee').
 * If user attempts to access an unauthorized route, redirects to their role's home page.
 */
export default function useAuthGuard(allowedRole) {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('current_user');
    if (!stored) {
      navigate('/');
      return;
    }

    try {
      const userObj = JSON.parse(stored);
      if (!userObj || typeof userObj !== 'object' || !userObj.username) {
        navigate('/');
        return;
      }

      // Check role authorization if allowedRole is specified
      if (allowedRole && userObj.role !== allowedRole) {
        if (userObj.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/tables');
        }
      }
    } catch {
      navigate('/');
    }
  }, [navigate, allowedRole]);
}
