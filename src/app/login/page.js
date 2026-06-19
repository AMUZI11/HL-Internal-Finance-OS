"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/views/Login';
import { api } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = api.getCurrentSession();
    if (session) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
