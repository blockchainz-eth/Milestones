"use client";

import { ethers } from 'ethers';


import { useRouter } from 'next/navigation';
import { useEffect } from 'react';  // Import useEffect

export default function Home() {
  const router = useRouter();

  // Insert useEffect here to handle MetaMask connection when the component mounts
  useEffect(() => {
    const connectMetaMask = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log("Connected account:", accounts[0]);
        } catch (error) {
          console.error("User denied MetaMask connection", error);
        }
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    };
  
    connectMetaMask();  // Call the function inside useEffect
  }, []);
   // Empty dependency array ensures it runs only once when the component mounts

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Milestones Crowdfunding Platform</h1>
      
      {/* Logo */}
      <img 
        src="https://i.imgur.com/SrBEbAv.jpeg"  // Replace with your image URL
        alt="Platform Logo" 
        className="mb-8 w-96 h-auto" 
        style={{ maxWidth: '100%', height: 'auto' }}  // Ensures proper scaling of the image
      />

      {/* Buttons */}
      <div className="flex space-x-4">
        <button 
          className="bg-black text-white border-white border-2 py-2 px-4" 
          onClick={() => router.push('/create-project')}
        >
          Create Project
        </button>
        <button 
          className="bg-black text-white border-white border-2 py-2 px-4" 
          onClick={() => router.push('/see-projects')}
        >
          See Projects
        </button>
      </div>
    </div>
  );
}
