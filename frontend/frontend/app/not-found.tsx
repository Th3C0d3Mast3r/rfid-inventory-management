// app/not-found.tsx
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div
        className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
        aspect-square w-8 flex justify-center items-center text-yellow-700"
      ></div>
      <a href="/dashboard" className="mt-4 text-gray-700">404 - Page not found</a>
      
    </div>
    
  );
}
