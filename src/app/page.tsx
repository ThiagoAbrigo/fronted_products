'use client'

import React, { useEffect } from 'react';

import Cookies from 'js-cookie';
import Login from "./components/sessions/Login";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);
  return (
    <Login />
  );
}
