// contractABI.js
export const contractABI = [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "_title",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "_description",
              "type": "string"
          },
          {
              "internalType": "uint256",
              "name": "_goalAmount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "_durationInDays",
              "type": "uint256"
          },
          {
              "internalType": "string",
              "name": "_imageURL",
              "type": "string"
          }
      ],
      "name": "createProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "_projectId",
              "type": "uint256"
          }
      ],
      "name": "contribute",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "projects",
      "outputs": [
          {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "string",
              "name": "title",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "description",
              "type": "string"
          },
          {
              "internalType": "uint256",
              "name": "goalAmount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "fundsRaised",
              "type": "uint256"
          },
          {
              "internalType": "string",
              "name": "imageURL",
              "type": "string"
          },
          {
              "internalType": "bool",
              "name": "isGoalReached",
              "type": "bool"
          },
          {
              "internalType": "bool",
              "name": "isFundWithdrawn",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "_imageURL",
              "type": "string"
          }
      ],
      "name": "isValidJPG",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "title",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "imageURL",
              "type": "string"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "contribution",
              "type": "uint256"
          }
      ],
      "name": "generateTokenURI",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "toString",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "projectId",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "title",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "goalAmount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "imageURL",
              "type": "string"
          }
      ],
      "name": "ProjectCreated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "projectId",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "contributor",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "ContributionMade",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "projectId",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "FundsWithdrawn",
      "type": "event"
  }
];
