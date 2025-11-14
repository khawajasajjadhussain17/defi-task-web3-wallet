import React, { useState, useEffect } from 'react';
import { connectWallet, getCurrentAccount, formatAddress, onAccountsChanged } from '../../utils/web3';
import './WalletConnect.css';

const WalletConnect = ({ onConnect, onDisconnect }) => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        if (onConnect) onConnect(accounts[0]);
      }
    };

    onAccountsChanged(handleAccountsChanged);

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    const currentAccount = await getCurrentAccount();
    if (currentAccount) {
      setAccount(currentAccount);
      if (onConnect) onConnect(currentAccount);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    const result = await connectWallet();

    if (result.success) {
      setAccount(result.account);
      if (onConnect) onConnect(result.account);
    } else {
      setError(result.error);
    }

    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    setAccount(null);
    if (onDisconnect) onDisconnect();
  };

  return (
    <div className="wallet-connect">
      {!account ? (
        <div className="connect-section">
          <button
            className="btn btn-primary btn-connect"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Connecting...
              </>
            ) : (
              <>
                <i className="fas fa-wallet me-2"></i>
                Connect MetaMask
              </>
            )}
          </button>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          {!window.ethereum && !error && (
            <div className="alert alert-warning mt-3" role="alert">
              <i className="fas fa-info-circle me-2"></i>
              MetaMask not detected. Please install{' '}
              <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
                MetaMask
              </a>{' '}
              to continue.
            </div>
          )}
        </div>
      ) : (
        <div className="connected-section">
          <div className="account-info">
            <div className="account-badge">
              <span className="status-dot"></span>
              <span className="account-address">{formatAddress(account)}</span>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleDisconnect}
              title="Disconnect"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;

