"use client";

import { useEffect, useState } from 'react';
import { BrowserProvider, Contract, formatEther } from 'ethers';  // Use BrowserProvider and Contract for ethers v6
import { contractABI } from './contractabi';

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, contractABI, provider);

        const projectList = [];
        let index = 0;

        while (true) {
          try {
            const project = await contract.projects(index);  // Assuming `projects` is a mapping
            console.log("Project fetched:", project);

            // Break the loop if no valid project is found (if title doesn't exist)
            if (!project || !project.title) {
              break;
            }

            projectList.push(project);
            index++;
          } catch (error) {
            console.error(`Error fetching project at index ${index}:`, error);
            break;  // Exit the loop if the project doesn't exist or there's an error
          }
        }

        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);  // Set empty array if fetching fails or no projects exist
      }
    };

    fetchProjects();
  }, [contractAddress]);  // Use contractAddress as a dependency

  // Function to contribute to a project
  const contributeToProject = async (projectId, amountInEth) => {
    if (!walletConnected) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const contract = new Contract(contractAddress, contractABI, signer);

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
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p>{project.description}</p>  {/* Display the project description */}
              <img src={project.imageURL} alt={project.title} className="w-full h-48 object-cover mb-4" />
              <p>Goal: {formatEther(project.goalAmount)} ETH</p>
              <p>Raised: {formatEther(project.fundsRaised)} ETH</p>
              <p>Time Left: {project.durationInDays} days</p>
              <button
                className="bg-black text-white border-white border-2 py-2 px-4 mt-4"
                onClick={() => contributeToProject(index, '0.1')}  // Example amount of 0.1 ETH
              >
                Contribute
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
