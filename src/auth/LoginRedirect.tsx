import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const checkAuthentication = async () => {
  try {
    const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false; 
  }
};

const CheckAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const isAuthenticated = await checkAuthentication();
      if (isAuthenticated) {
        navigate("/search");
      } else {
        navigate("/login");
      }
    };

    authenticate();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default CheckAuth;
