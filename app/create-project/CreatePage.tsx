"use client";
import { useState } from 'react';
import { BrowserProvider, parseEther, Contract } from 'ethers';  // Ensure BrowserProvider is imported
import { contractABI } from './contractabi';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [duration, setDuration] = useState('');

  // Retrieve the contract address from environment variables
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Ensure the contract address is defined
  if (!contractAddress) {
    throw new Error("Contract address is not defined in environment variables.");
  }

  const launchProject = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);  // Use BrowserProvider for ethers v6
        const signer = await provider.getSigner();

        // Initialize contract with the retrieved contract address
        const contract = new Contract(contractAddress, contractABI, signer); 

        // Call the contract's createProject function with user inputs
        const transaction = await contract.createProject(
          title,
          description,
          parseEther(goalAmount),
          duration,
          imageURL
        );

        // Wait for the transaction to be confirmed
        await transaction.wait();
        alert('Project created successfully!');
      } catch (error) {
        console.error("Error creating project:", error);
        alert("Failed to create the project. Please check the console for details.");
      }
    } else {
      alert("MetaMask is not installed or detected.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Create a New Project</h1>

      <input
        type="text"
        placeholder="Project Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border-white border-2 bg-black text-white mb-4 p-2"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border-white border-2 bg-black text-white mb-4 p-2"
      />
      <input
        type="text"
        placeholder="NFT Image URL"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
        className="border-white border-2 bg-black text-white mb-4 p-2"
      />
      <input
        type="text"
        placeholder="Goal Amount (ETH)"
        value={goalAmount}
        onChange={(e) => setGoalAmount(e.target.value)}
        className="border-white border-2 bg-black text-white mb-4 p-2"
      />
      <input
        type="number"
        placeholder="Duration (Days)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="border-white border-2 bg-black text-white mb-6 p-2"
      />

      <button
        className="bg-black text-white border-white border-2 py-2 px-4"
        onClick={launchProject}
      >
        Launch Project
      </button>
    </div>
  );
}
