'use client';
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold flex-grow-2">Let's tweet</h1>
      <nav className="sm:flex content-end justify-between flex-grow-4 hidden">
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
      <Bars3Icon
        className="h-6 w-6 sm:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      {isMenuOpen && (
        <nav className="sm:hidden absolute top-16 right-4 bg-gray-800 p-4 rounded shadow-lg">
          <a href="/" className="block hover:underline">
            Home
          </a>
          <a href="/" className="block hover:underline">
            Explore tweets
          </a>
          <a href="/" className="block hover:underline">
            Post a tweet
          </a>
          <a href="/" className="block hover:underline">
            Trending
          </a>
          <a href="/" className="block hover:underline">
            My profile
          </a>
        </nav>
      )}
    </header>
  );
}

export default Header;
