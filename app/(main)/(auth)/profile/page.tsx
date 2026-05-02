"use client";
import { useUserState } from "@/app/lib/store";
import RegistrationForm from "./RegistrationForm";

function ProfilePage() {
  const { isAuthenticated } = useUserState();
  if (!isAuthenticated) {
    return <RegistrationForm />;
  }
  return <div>Profile</div>;
}

export default ProfilePage;
