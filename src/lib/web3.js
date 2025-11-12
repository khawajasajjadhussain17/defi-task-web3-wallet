import { Web3 } from 'web3';

/**
 * Get ethereum provider from window
 * Safe check for MetaMask/provider availability
 */
export const getEthereum = () => {
  if (typeof window === 'undefined') return null;
  return window.ethereum || null;
};

/**
 * Get Web3 instance
 * Returns null if no provider available
 */
export const getWeb3 = () => {
  const ethereum = getEthereum();
  if (!ethereum) return null;
  
  try {
    return new Web3(ethereum);
  } catch (error) {
    console.error('Failed to create Web3 instance:', error);
    return null;
  }
};

/**
 * Get current chain ID
 * Returns null if unable to fetch
 */
export const getChainId = async () => {
  const ethereum = getEthereum();
  if (!ethereum) return null;
  
  try {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16); // Convert hex to decimal
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    return null;
  }
};

/**
 * Request account access (connect wallet)
 */
export const requestAccounts = async () => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('No Ethereum provider found. Please install MetaMask.');
  }
  
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  } catch (error) {
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

/**
 * Get current connected accounts
 */
export const getAccounts = async () => {
  const ethereum = getEthereum();
  if (!ethereum) return [];
  
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    return accounts;
  } catch (error) {
    console.error('Failed to get accounts:', error);
    return [];
  }
};

/**
 * Get ETH balance for address
 */
export const getBalance = async (address) => {
  const web3 = getWeb3();
  if (!web3) throw new Error('Web3 not available');
  
  try {
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  } catch (error) {
    throw new Error('Failed to fetch balance');
  }
};

/**
 * Send ETH transaction
 */
export const sendEth = async (from, to, amountEth) => {
  const web3 = getWeb3();
  if (!web3) throw new Error('Web3 not available');
  
  // Validate address
  if (!web3.utils.isAddress(to)) {
    throw new Error('Invalid recipient address');
  }
  
  // Validate amount
  const amount = parseFloat(amountEth);
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  
  const ethereum = getEthereum();
  try {
    const amountWei = web3.utils.toWei(amountEth, 'ether');
    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from,
        to,
        value: web3.utils.toHex(amountWei),
      }],
    });
    return txHash;
  } catch (error) {
    throw new Error(error.message || 'Transaction failed');
  }
};

/**
 * Switch to specific chain
 */
export const switchChain = async (chainId) => {
  const ethereum = getEthereum();
  if (!ethereum) throw new Error('No Ethereum provider found');
  
  const chainIdHex = '0x' + chainId.toString(16);
  
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    // Chain not added
    if (error.code === 4902) {
      throw new Error('Network not found in MetaMask. Please add it manually.');
    }
    throw error;
  }
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format ETH amount
 */
export const formatEth = (eth) => {
  const num = parseFloat(eth);
  if (isNaN(num)) return '0.0000';
  return num.toFixed(4);
};

