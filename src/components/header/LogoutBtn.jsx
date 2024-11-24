import React from 'react'
import { useDispatch } from 'react-redux'
import authService from "../../appwrite/authService.js"
import { logout } from '../../Store/authSlice.js';
import { useNavigate } from 'react-router-dom';

const LogoutBtn = () => {
    const dispatch= useDispatch();
    const navigate=useNavigate();

    const LogoutHandler=()=>{
        authService.logOut().then(()=>{dispatch(logout())})
        navigate("/login");
    }
  return (
    <button className= "inline-block px-6 py-2 hover:bg-blue-200 duration-200 rounded-full" onClick={LogoutHandler}>Logout</button>
  )
}

export default LogoutBtn