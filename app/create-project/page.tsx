"use client";

import { useState, useEffect } from 'react';
import { ethers, isAddress, parseEther } from 'ethers';
import contractabi from '../abi/contractabi.json';

export default function CreateProject() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [duration, setDuration] = useState('');

  // MetaMask connection logic
  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // Explicitly request the MetaMask connection
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const signer = await provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        setIsConnecting(false);
      } catch (error) {
        console.error("MetaMask connection error:", error);
        setIsConnecting(false);
      }
    } else {
      alert("MetaMask is not installed or not accessible.");
    }
  };

  useEffect(() => {
    connectMetaMask();  // Automatically prompt MetaMask connection on component mount
  }, []);

  // Function to launch a project
  const launchProject = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    // Log input values for debugging
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Goal Amount:", goalAmount);
    console.log("Duration:", duration);
    console.log("Image URL:", imageURL);

    try {
      setIsConnecting(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      // Validate the contract address
      if (!contractAddress || !isAddress(contractAddress)) {
        console.error("Invalid or missing contract address");
        return;
      }

      const contract = new ethers.Contract(contractAddress, contractabi, signer);

      const transaction = await contract.createProject(
        title,
        description,
        parseEther(goalAmount),  // Convert goal amount to wei
        duration,  // Duration in days
        imageURL  // NFT Image URL
      );

      await transaction.wait();  // Wait for the transaction to be mined
      alert('Project created successfully!');
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Create a New Project</h1>

      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <p>Please connect your wallet</p>
      )}

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
        className={`bg-black text-white border-white border-2 py-2 px-4 ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={launchProject}
        disabled={isConnecting}
      >
        {isConnecting ? 'Processing...' : 'Launch Project'}
      </button>
    </div>
  );
}
