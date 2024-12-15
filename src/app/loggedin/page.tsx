'use client'
import React from 'react'
import { logout } from '../actions/login';
import { useRouter } from 'next/navigation';

type Props = {}

function LoggedIn({}: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // Call the logout function to clear the JWT
    router.push('/'); // Redirect back to the homepage
  };

  return (
    <div onClick={handleLogout} className="bg-black p-2 text-white rounded-xl w-fit">Log out</div>
  )
}

export default LoggedIn