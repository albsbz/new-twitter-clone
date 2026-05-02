"use client";
import { useUserState } from "@/app/lib/store";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";

function ProfilePage() {
  const { isAuthenticated } = useUserState();
  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <RegistrationForm />
      </>
    );
  }
  return <div>Profile</div>;
}

export default ProfilePage;
