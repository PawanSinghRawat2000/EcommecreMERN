import React from "react";
import { useSelector } from "react-redux";
import {  Navigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";


const ProtectedRoute = ({isAdmin, children,redirectTo }) => {
  const { isAuthenticated,user } = useSelector((state) => state.user);

  if(isAuthenticated===null){
    return(<Loader/>)
  }
  if( isAuthenticated===false)return <Navigate to={redirectTo} />
  if(isAdmin===true && user.role!=='admin')return <Navigate to={redirectTo} />
  return children;


};

export default ProtectedRoute;