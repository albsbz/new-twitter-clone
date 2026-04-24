import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold flex-grow-2">Let's tweet</h1>
        <nav className="flex content-end justify-between flex-grow-4">
          <a href="/" className=" hover:underline">
            Home
          </a>
          <a href="/" className="hover:underline">
            Explore tweets
          </a>
          <a href="/" className="hover:underline">
            Post a tweet
          </a>
          <a href="/" className="hover:underline">
            Trending
          </a>
          <a href="/" className="hover:underline">
            My profile
          </a>
        </nav>
      </header>
      <main className=" p-4">{children}</main>
    </div>
  );
}

export default layout;
