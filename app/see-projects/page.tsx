"use client";

import { useEffect, useState } from 'react';
import { ethers, BrowserProvider, Contract, formatEther } from 'ethers';  // Import ethers and necessary modules
import { contractabi } from '../abi/contractabi';

export default function SeeProjects() {
  const [projects, setProjects] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [signer, setSigner] = useState(null);

  // Retrieve the contract address from environment variables
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // Ensure the contract address is defined
  if (!contractAddress) {
    throw new Error("Contract address is not defined in environment variables.");
  }

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
        setWalletConnected(true);
        console.log("Wallet connected:", signer);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  // Fetch all projects from the contract
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, contractabi, provider);

        // Fetch the number of projects in the contract
        const projectCount = await contract.projects.length;
        console.log("Number of projects:", projectCount);

        const projectList = [];

        for (let i = 0; i < projectCount; i++) {
          try {
            const project = await contract.projects(i);  // Fetch the project at index i
            console.log("Fetched project:", project);

            if (project && project.title) {
              const projectDetails = {
                title: project.title,
                description: project.description,
                goalAmount: project.goalAmount.toString(),
                fundsRaised: project.fundsRaised.toString(),
                deadline: project.deadline,
                imageURL: project.imageURL,
                isGoalReached: project.isGoalReached,
              };

              projectList.push(projectDetails);
            }
          } catch (error) {
            console.error("Error fetching project at index", i, ":", error);
            break;  // Exit the loop on error
          }
        }

        setProjects(projectList);  // Store all fetched projects in the state
        console.log("Updated project list:", projectList);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);  // Set empty array if fetching fails or no projects exist
      }
    };

    // Function to handle new project creation
    const handleProjectCreated = (projectId, title, goalAmount, deadline, imageURL) => {
      console.log("New project created:", { projectId, title, goalAmount, deadline, imageURL });
      fetchProjects();  // Fetch updated project list when a new project is created
    };

    // Set up the event listener for ProjectCreated
    const setupEventListener = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, contractabi, provider);

        contract.on("ProjectCreated", handleProjectCreated);  // Listen for project creation events
        console.log("Listening for ProjectCreated events...");
      } catch (error) {
        console.error("Error setting up event listener:", error);
      }
    };

    setupEventListener();  // Set up the event listener
    fetchProjects();       // Initial fetch of the projects
  }, [contractAddress]);

  // Function to contribute to a project
  const contributeToProject = async (projectId, amountInEth) => {
    if (!walletConnected) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const contract = new Contract(contractAddress, contractabi, signer);

      const tx = await contract.contribute(projectId, {
        value: ethers.parseEther(amountInEth),  // Contribution amount in ETH
      });
      await tx.wait();
      alert('Contribution successful, NFT minted!');
    } catch (error) {
      console.error("Error contributing to project:", error);
      alert('There was an issue with your contribution.');
    }
  };

  // Calculate remaining days until the deadline
  const calculateDaysLeft = (deadline) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = deadline - currentTime;
    return Math.max(0, Math.floor(timeLeft / (60 * 60 * 24)));  // Convert seconds to days
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Ongoing Projects</h1>

      {/* Button to connect the wallet */}
      {!walletConnected ? (
        <button
          className="bg-white text-black border-black border-2 py-2 px-4 mb-4"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <p>Wallet connected</p>
      )}

      {/* Display message if no projects are available */}
      {projects.length === 0 ? (
        <p>No projects available at the moment. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="border-white border-2 p-4">
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="mb-2">{project.description}</p>
              <img src={project.imageURL} alt={project.title} className="w-full h-48 object-cover mb-4" />
              
              <p>Goal: {formatEther(project.goalAmount)} ETH</p>
              <p>Raised: {formatEther(project.fundsRaised)} ETH</p>
              <p>Days Left: {calculateDaysLeft(project.deadline)} days</p>

              {/* Display Contribute button only if goal is not reached */}
              {!project.isGoalReached && (
                <button
                  className="bg-black text-white border-white border-2 py-2 px-4 mt-4"
                  onClick={() => contributeToProject(index, '0.1')}  // Example amount of 0.1 ETH
                >
                  Contribute
                </button>
              )}

              {project.isGoalReached && <p className="text-green-500 mt-4">Goal Reached!</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
