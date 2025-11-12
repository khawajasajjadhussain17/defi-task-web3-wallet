import { Web3 } from 'web3';

// Initialize Web3 instance
let web3;

// Default to Sepolia testnet
const CHAIN_ID = '0xaa36a7'; // 11155111 in hex
const NETWORK_NAME = 'Sepolia';
const RPC_URL = 'https://rpc.sepolia.org';
const BLOCK_EXPLORER = 'https://sepolia.etherscan.io';

/**
 * Get Web3 instance
 */
export const getWeb3 = () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else {
    // Fallback to public RPC
    web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
  }
  return web3;
};

/**
 * Connect to MetaMask wallet
 */
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to use this feature.');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    // Check if on correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (chainId !== CHAIN_ID) {
      await switchToSepolia();
    }

    return {
      success: true,
      account: accounts[0],
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Switch to Sepolia network
 */
export const switchToSepolia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_ID }],
    });
  } catch (switchError) {
    // Network not added, try to add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CHAIN_ID,
              chainName: NETWORK_NAME,
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [RPC_URL],
              blockExplorerUrls: [BLOCK_EXPLORER],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Sepolia network');
      }
    } else {
      throw switchError;
    }
  }
};

/**
 * Get ETH balance for an address
 */
export const getBalance = async (address) => {
  try {
    const web3Instance = getWeb3();
    const balance = await web3Instance.eth.getBalance(address);
    return web3Instance.utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

/**
 * Send ETH transaction
 */
export const sendTransaction = async (from, to, amount) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const web3Instance = getWeb3();
    const amountWei = web3Instance.utils.toWei(amount, 'ether');

    // Validate address
    if (!web3Instance.utils.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    // Send transaction
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: from,
          to: to,
          value: web3Instance.utils.toHex(amountWei),
        },
      ],
    });

    return {
      success: true,
      txHash: txHash,
      explorerUrl: `${BLOCK_EXPLORER}/tx/${txHash}`,
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Wait for transaction receipt
 */
export const waitForTransaction = async (txHash) => {
  try {
    const web3Instance = getWeb3();
    let receipt = null;
    
    while (receipt === null) {
      receipt = await web3Instance.eth.getTransactionReceipt(txHash);
      if (receipt === null) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    
    return receipt;
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    throw error;
  }
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format ETH amount
 */
export const formatEth = (amount) => {
  return parseFloat(amount).toFixed(4);
};

/**
 * Listen to account changes
 */
export const onAccountsChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
};

/**
 * Listen to network changes
 */
export const onChainChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
};

/**
 * Get current account
 */
export const getCurrentAccount = async () => {
  try {
    if (!window.ethereum) return null;
    
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

