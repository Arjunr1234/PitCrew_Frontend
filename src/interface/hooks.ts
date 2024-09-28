import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';

// Use this hook instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();
