import React, { useState } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import WalletConnect from '../../components/wallet/WalletConnect';
import WalletBalance from '../../components/wallet/WalletBalance';
import SendTransaction from '../../components/wallet/SendTransaction';
import './index.css';

const Wallet = () => {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConnect = (account) => {
    setConnectedAccount(account);
  };

  const handleDisconnect = () => {
    setConnectedAccount(null);
  };

  const handleTransactionComplete = () => {
    // Trigger balance refresh by updating key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Header />
      <div className="wallet-page">
        <div className="container">
          {/* Hero Section */}
          <div className="wallet-hero">
            <h1 className="wallet-hero-title">
              <i className="fas fa-wallet me-3"></i>
              ETH Wallet
            </h1>
            <p className="wallet-hero-subtitle">
              Connect your MetaMask wallet to send and receive ETH on Sepolia testnet
            </p>
          </div>

          {/* Wallet Connect Section */}
          <div className="wallet-section">
            <WalletConnect 
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>

          {/* Main Content - Only show when connected */}
          {connectedAccount && (
            <>
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <WalletBalance 
                    account={connectedAccount}
                    key={refreshKey}
                  />
                </div>
                <div className="col-lg-6 mb-4">
                  <SendTransaction 
                    account={connectedAccount}
                    onTransactionComplete={handleTransactionComplete}
                  />
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="wallet-info">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="info-card">
                      <i className="fas fa-shield-alt info-icon"></i>
                      <h4>Secure</h4>
                      <p>Your keys never leave your browser. All transactions are signed locally.</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="info-card">
                      <i className="fas fa-network-wired info-icon"></i>
                      <h4>Testnet</h4>
                      <p>Connected to Sepolia testnet. Get free test ETH from a faucet.</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="info-card">
                      <i className="fas fa-bolt info-icon"></i>
                      <h4>Fast</h4>
                      <p>Transactions are confirmed quickly on the Sepolia network.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources Section */}
              <div className="wallet-resources">
                <h3 className="resources-title">Helpful Resources</h3>
                <div className="resources-grid">
                  <a 
                    href="https://sepoliafaucet.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <i className="fas fa-faucet me-2"></i>
                    Get Test ETH
                  </a>
                  <a 
                    href="https://sepolia.etherscan.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <i className="fas fa-search me-2"></i>
                    Block Explorer
                  </a>
                  <a 
                    href="https://metamask.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <i className="fas fa-download me-2"></i>
                    Get MetaMask
                  </a>
                  <a 
                    href="https://ethereum.org/en/developers/docs/networks/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <i className="fas fa-book me-2"></i>
                    Learn More
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Not Connected Message */}
          {!connectedAccount && (
            <div className="not-connected">
              <div className="not-connected-card">
                <i className="fas fa-plug fa-3x mb-3"></i>
                <h3>Connect Your Wallet</h3>
                <p>Connect your MetaMask wallet to start sending and receiving ETH</p>
                <div className="features-list mt-4">
                  <div className="feature-item">
                    <i className="fas fa-check-circle me-2"></i>
                    View your ETH balance
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle me-2"></i>
                    Send ETH to any address
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle me-2"></i>
                    Track transaction history
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wallet;

