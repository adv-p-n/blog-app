import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children, authRequirement = true }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authRequirement && authStatus !== authRequirement) {
      navigate("/login");
    } else if (authRequirement !== authStatus) {
      navigate("/");
    }
    setLoader(false);
  }, [authRequirement, navigate, authStatus]);
  return loader ? null : <div>{children}</div>;
};

export default AuthLayout;
