"use client";

import { useEffect } from 'react';
import Image from 'next/image';  // Import at the top
import { useRouter } from 'next/router';  // Import useRouter for navigation

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const connectMetaMask = async () => {
      if (window.ethereum) {
        try {
          // Request account access from MetaMask
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log("Connected account:", accounts[0]);

          // Initialize the Ethereum provider (MetaMask)
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
          if (!contractAddress) {
            throw new Error("Contract address is not defined in environment variables.");
          }

          const contract = new ethers.Contract(contractAddress, contractABI, signer);

          console.log('Provider:', provider);
          console.log('Signer:', signer);
          console.log('Contract:', contract);

        } catch (error) {
          console.error("User denied MetaMask connection or another error occurred", error);
        }
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    };

    connectMetaMask();  // Call the function inside useEffect
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Milestones Crowdfunding Platform</h1>
      
      {/* Logo */}
      <Image 
        src="https://i.imgur.com/SrBEbAv.jpeg"
        alt="Platform Logo"
        width={400}  // Specify width (change as needed)
        height={300}  // Specify height (change as needed)
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
