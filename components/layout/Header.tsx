// components/layout/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { NavigationBar } from "./NavigationBar";
import { AuthButtons } from "./AuthButtons";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">hotefinder</Link>
        <NavigationBar />
        <AuthButtons />
      </div>
    </header>
  );
};