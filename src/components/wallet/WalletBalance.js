import React, { useState, useEffect } from 'react';
import { getBalance, formatEth, onChainChanged } from '../../utils/web3';
import './WalletBalance.css';

const WalletBalance = ({ account }) => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (account) {
      fetchBalance();
      
      // Refresh balance every 10 seconds
      const interval = setInterval(fetchBalance, 10000);

      // Listen for chain changes
      const handleChainChanged = () => {
        fetchBalance();
      };
      onChainChanged(handleChainChanged);

      return () => {
        clearInterval(interval);
        if (window.ethereum) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    } else {
      setBalance(null);
      setError(null);
    }
  }, [account]);

  const fetchBalance = async () => {
    if (!account) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const bal = await getBalance(account);
      setBalance(bal);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return null;
  }

  return (
    <div className="wallet-balance">
      <div className="balance-card">
        <div className="balance-header">
          <h3 className="balance-title">
            <i className="fas fa-coins me-2"></i>
            Your Balance
          </h3>
          <button
            className="btn btn-sm btn-outline-light refresh-btn"
            onClick={fetchBalance}
            disabled={isLoading}
            title="Refresh balance"
          >
            <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i>
          </button>
        </div>

        <div className="balance-content">
          {isLoading && !balance ? (
            <div className="balance-loading">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="balance-error">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          ) : balance !== null ? (
            <div className="balance-amount">
              <span className="amount">{formatEth(balance)}</span>
              <span className="currency">ETH</span>
            </div>
          ) : null}
        </div>

        <div className="balance-footer">
          <small className="text-light">
            <i className="fas fa-network-wired me-1"></i>
            Sepolia Testnet
          </small>
        </div>
      </div>

      <div className="balance-actions">
        <a
          href="https://sepoliafaucet.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary btn-sm"
        >
          <i className="fas fa-faucet me-2"></i>
          Get Test ETH
        </a>
        <a
          href={`https://sepolia.etherscan.io/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="fas fa-external-link-alt me-2"></i>
          View on Explorer
        </a>
      </div>
    </div>
  );
};

export default WalletBalance;

