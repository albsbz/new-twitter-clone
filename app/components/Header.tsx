"use client";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserState } from "@/app/lib/store";
import useAuth from "../_hooks/useAuth";

function Header() {
  const { handleLogin } = useAuth();
  const { isAuthenticated } = useUserState();
  useEffect(() => {
    handleLogin({ notification: false });
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl font-bold flex-grow-2">
        <h1>Let's tweet</h1>
      </Link>
      <nav className="sm:flex content-end justify-between flex-grow-4 hidden">
        <Link href="/" className=" hover:underline">
          Home
        </Link>
        <Link href="/tweets" className="hover:underline">
          Explore tweets
        </Link>
        {isAuthenticated && (
          <Link href="/tweets/new" className="hover:underline">
            Post a tweet
          </Link>
        )}
        <Link href="/" className="hover:underline">
          Trending
        </Link>
        {isAuthenticated ? (
          <Link href="/profile" className="hover:underline">
            My profile
          </Link>
        ) : (
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        )}
      </nav>
      <Bars3Icon
        className="h-6 w-6 sm:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      {isMenuOpen && (
        <nav className="sm:hidden absolute top-16 right-4 bg-gray-800 p-4 rounded shadow-lg">
          <Link href="/" className="block hover:underline">
            Home
          </Link>
          <Link href="/tweets" className="block hover:underline">
            Explore tweets
          </Link>
          {isAuthenticated && (
            <Link href="/tweets/new" className="block hover:underline">
              Post a tweet
            </Link>
          )}
          <Link href="/" className="block hover:underline">
            Trending
          </Link>
          {isAuthenticated ? (
            <Link href="/profile" className="block hover:underline">
              My profile
            </Link>
          ) : (
            <Link href="/login" className="block hover:underline">
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;
