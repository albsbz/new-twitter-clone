"use client";
import { useUserState } from "@/app/lib/store";
import useAuth from "../_hooks/useAuth";
import ProfileSettings from "./ProfileSettings";

function Profile() {
  const {  name } = useUserState();
  const { handleLogout } = useAuth();
  const logOutHandler = () => {
    handleLogout();
  };
  return (
    <div>
      <div className="text-2xl font-bold mb-4">User Profile</div>
      <div className="mb-2 text-gray-700">
        Welcome to your profile page{`${name ? `, ${name}` : ""}`}!
      </div>
      <div className="mb-4 text-gray-600">
        Here you can view and update your profile information.
      </div>
      {name ? (
        <div className="mb-4 text-gray-600">
          <span className="font-bold">Name: </span>
          <span className="ml-1">{name}</span>
        </div>
      ) : (
        <ProfileSettings />
      )}
      <button
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={logOutHandler}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
