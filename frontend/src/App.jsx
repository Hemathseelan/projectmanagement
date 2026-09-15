import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppRoutes from './routes/AppRoutes.jsx';
import { fetchProfile } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return <AppRoutes />;
}