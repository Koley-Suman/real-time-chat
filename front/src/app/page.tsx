"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser!=null) {
      router.push("/chat");
    }
  }, []);
  return (
    <React.Fragment>
      <div className="min-h-screen h-screen flex flex-col bg-gray-800 text-gray-300">
        {/* Header */}
        <header className="bg-gray-900 shadow-md md:py-4 md:px-8 p-2  flex justify-between items-center">
          <h1 className="md:text-2xl font-bold text-violet-600 flex items-center gap-2 text-lg">
            <MessageCircle /> ChatConnect
          </h1>
          <div className="space-x-4 flex ">
            <Button
              onClick={() => router.push("/login")}
              className="px-4 py-2 border border-violet-600 text-violet-600 rounded hover:bg-violet-50"
              variant="outline"
              type="button"
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/signUp")}
              className="px-4 py-2 bg-violet-600 text-white rounded border-none hover:bg-violet-700 hidden lg:block"
              type="button"
            >
              Sign Up
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Connect. Chat. Collaborate.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              Start real-time conversations with anyone, anywhere — instantly.
            </p>
            <Button
              onClick={() => router.push("/signUp")}
              className="px-6 py-4 bg-violet-600 text-white rounded-lg text-lg hover:bg-violet-700"
              type="button"
            >
              Get Started
            </Button>
          </div>
        </main>

        {/* Footer */}
      </div>
      <footer className="bg-gray-900 text-center py-4 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} ChatConnect. All rights reserved. SUMAN
        KOLEY
      </footer>
    </React.Fragment>
  );
}
