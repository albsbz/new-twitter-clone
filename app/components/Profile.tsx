"use client";
import { useUserState } from "@/app/lib/store";
import { notFound } from "next/navigation";
import useAuth from "../_hooks/useAuth";

function Profile() {
  const { isAuthenticated } = useUserState();

  if (!isAuthenticated) {
    notFound();
  }
    const { handleLogout } = useAuth();
  const logOutHandler = () => {
    handleLogout();
  };
  return <div>Profile
          <button
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={logOutHandler}
      >
        Logout
      </button>
  </div>;
}

export default Profile;
