"use client";


import { useEffect, useState } from 'react';
import { ethers, Contract, formatEther } from 'ethers';  // Import ethers.js modules
import contractabi from '../abi/contractabi.json'; // Import your contract ABI

export default function SeeProjects() {
  const [projects, setProjects] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [signer, setSigner] = useState(null);

  // Function to fetch projects
  const fetchProjects = async (contract) => {
    const projectList = [];
    const projectCount = await contract.projectCount();
    for (let index = 0; index < projectCount; index++) {
      try {
        const project = await contract.projects(index);
        projectList.push({
          title: project.title,
          description: project.description,
          goalAmount: project.goalAmount.toString(),
          fundsRaised: project.fundsRaised.toString(),
          deadline: project.deadline,
          imageURL: project.imageURL,
          isGoalReached: project.isGoalReached,
        });
      } catch (error) {
        console.error(`Error fetching project at index ${index}:`, error);
        break;
      }
    }
    setProjects(projectList);
  };

  // Define the connectAndInitializeContract function
  const connectAndInitializeContract = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);  // Correct usage in ethers v5/v6
        const signer = await provider.getSigner();
        setSigner(signer);
        setWalletConnected(true);

        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contractABI = contractabi;

        if (contractAddress && contractABI) {
          const contract = new Contract(contractAddress, contractABI, signer);
          console.log('Contract initialized:', contract);
          fetchProjects(contract);  // Fetch projects after contract initialization
        } else {
          console.error("Contract address or ABI is missing");
        }
      } catch (error) {
        console.error("Error connecting to MetaMask or initializing contract", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }
  };

  // Automatically connect and fetch projects when component mounts
  useEffect(() => {
    connectAndInitializeContract();
  }, []);  // This will run when the component mounts

  const contributeToProject = async (projectId, amountInEth) => {
    if (!walletConnected) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const contract = new Contract(contractAddress, contractabi, signer);

      const tx = await contract.contribute(projectId, {
        value: ethers.parseEther(amountInEth),
      });
      await tx.wait();
      alert('Contribution successful, NFT minted!');
    } catch (error) {
      console.error("Error contributing to project:", error);
      alert('There was an issue with your contribution.');
    }
  };

  const calculateDaysLeft = (deadline) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = deadline - currentTime;
    return Math.max(0, Math.floor(timeLeft / (60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Ongoing Projects</h1>

      {!walletConnected ? (
        <button
          className="bg-white text-black border-black border-2 py-2 px-4 mb-4"
          onClick={connectAndInitializeContract}  // Now the function is defined
        >
          Connect Wallet
        </button>
      ) : (
        <p>Wallet connected</p>
      )}

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
              {!project.isGoalReached && (
                <button
                  className="bg-black text-white border-white border-2 py-2 px-4 mt-4"
                  onClick={() => contributeToProject(index, '0.1')}
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

