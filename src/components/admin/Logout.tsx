import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../interface/hooks';
import { adminLogoutThunk } from '../../redux/thunk/admin';
import { resetSuccess } from '../../redux/slice/adminSlice';

function Logout() {

  const naviage = useNavigate();
  const dispatch = useAppDispatch();

   dispatch(adminLogoutThunk())
   useEffect(() => {
       dispatch(adminLogoutThunk());
       dispatch(resetSuccess())
       naviage('/admin/login');
      
   },[dispatch, naviage])
  
  return null
}

export default Logout
