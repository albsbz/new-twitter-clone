import React from "react";
import Header from "../components/Header";
import Notifications from "../components/Notifications";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <Notifications />
      <main className=" p-4">{children}</main>
    </div>
  );
}

export default layout;
