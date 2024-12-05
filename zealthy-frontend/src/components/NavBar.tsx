'use client'

import Link from "next/link";

const NavBar = () => (
  <nav className="bg-blue-500 text-white py-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold">Zealthy App</h1>
      <div className="space-x-4">
        <Link href="/" className="hover:underline">
          Onboarding
        </Link>
        <Link href="/admin" className="hover:underline">
          Admin
        </Link>
        <Link href="/data" className="hover:underline">
          Data Table
        </Link>
      </div>
    </div>
  </nav>
);

export default NavBar;
