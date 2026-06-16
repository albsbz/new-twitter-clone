"use client";
import { useUserState } from "@/app/lib/store";

import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { useState } from "react";
import useAuth from "../_hooks/useAuth";

function Login() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { isAuthenticated } = useUserState();
  const { handleLogout } = useAuth();
  if (!isAuthenticated) {
    return (
      <>
        {!showRegistrationForm && <LoginForm />}
        {showRegistrationForm && (
          <RegistrationForm handleBack={() => setShowRegistrationForm(false)} />
        )}
        <span
          className="flex justify-center my-4 cursor-pointer text-blue-500"
          onClick={() => setShowRegistrationForm(!showRegistrationForm)}
        >
          {showRegistrationForm ? "Back to Login" : "Register"}
        </span>
      </>
    );
  }

  const logOutHandler = () => {
    handleLogout();
  };

  return (
    <div>
      Login
      <button
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={logOutHandler}
      >
        Logout
      </button>
    </div>
  );
}

export default Login;
