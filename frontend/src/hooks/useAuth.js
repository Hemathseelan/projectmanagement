import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction } from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  function logout() {
    dispatch(logoutAction());
    navigate('/login');
  }

  return { user, token, isAuthenticated, loading, error, logout };
}
