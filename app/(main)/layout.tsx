import React from "react";
import Header from "../components/Header";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className=" p-4">{children}</main>
    </div>
  );
}

export default layout;
