import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getEthereum,
  getWeb3,
  getChainId,
  requestAccounts,
  getAccounts,
  getBalance,
  sendEth,
  switchChain,
  formatAddress,
  formatEth,
} from '../lib/web3';

const DEFAULT_CHAIN_ID = Number(process.env.REACT_APP_DEFAULT_CHAIN_ID || 11155111);

const Wallet = () => {
  // State
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [lastBalance, setLastBalance] = useState('0');

  // Memoized values
  const isConnected = useMemo(() => !!account, [account]);
  
  const isWrongChain = useMemo(() => {
    return isConnected && chainId !== null && chainId !== DEFAULT_CHAIN_ID;
  }, [isConnected, chainId]);

  const web3Available = useMemo(() => {
    return getEthereum() !== null;
  }, []);

  // Debounced amount input
  const [debouncedAmount, setDebouncedAmount] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 300);
    return () => clearTimeout(timer);
  }, [amount]);

  // Connect wallet
  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await requestAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const currentChainId = await getChainId();
        setChainId(currentChainId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    if (!account) return;

    try {
      const bal = await getBalance(account);
      
      // Detect balance change (receive detection)
      if (lastBalance !== '0' && parseFloat(bal) > parseFloat(lastBalance)) {
        setSuccess(`Received ${formatEth(parseFloat(bal) - parseFloat(lastBalance))} ETH`);
        setTimeout(() => setSuccess(null), 5000);
      }
      
      setLastBalance(bal);
      setBalance(bal);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  }, [account, lastBalance]);

  // Poll balance every 25s when connected
  useEffect(() => {
    if (!isConnected) return;

    fetchBalance(); // Initial fetch

    const interval = setInterval(() => {
      fetchBalance();
    }, 25000); // 25 seconds

    return () => clearInterval(interval);
  }, [isConnected, fetchBalance]);

  // Listen for account changes
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setBalance('0');
        setLastBalance('0');
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = async () => {
      const newChainId = await getChainId();
      setChainId(newChainId);
      // Refresh balance on chain change
      if (account) {
        fetchBalance();
      }
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, fetchBalance]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const accounts = await getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const currentChainId = await getChainId();
        setChainId(currentChainId);
      }
    };

    checkConnection();
  }, []);

  // Handle send transaction
  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSending(true);

    try {
      // Validation
      const web3 = getWeb3();
      if (!web3) throw new Error('Web3 not available');
      
      if (!recipient || !web3.utils.isAddress(recipient)) {
        throw new Error('Invalid recipient address');
      }

      const amountNum = parseFloat(debouncedAmount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const txHash = await sendEth(account, recipient, debouncedAmount);
      setSuccess(`Transaction sent! Hash: ${txHash.slice(0, 10)}...`);
      
      // Reset form
      setRecipient('');
      setAmount('');
      
      // Refresh balance after a delay
      setTimeout(() => fetchBalance(), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  }, [account, recipient, debouncedAmount, fetchBalance]);

  // Handle switch chain
  const handleSwitchChain = useCallback(async () => {
    try {
      await switchChain(DEFAULT_CHAIN_ID);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Styles
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    banner: {
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '8px',
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      color: '#92400e',
    },
    card: {
      padding: '1.5rem',
      marginBottom: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    button: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: '#3b82f6',
      color: '#fff',
      width: '100%',
      transition: 'background-color 0.2s',
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      marginBottom: '0.75rem',
      boxSizing: 'border-box',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#374151',
    },
    balanceText: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem',
    },
    accountText: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontFamily: 'monospace',
    },
    alert: {
      padding: '0.75rem',
      borderRadius: '6px',
      marginBottom: '1rem',
    },
    alertError: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fca5a5',
    },
    alertSuccess: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #6ee7b7',
    },
    grid: {
      display: 'grid',
      gap: '0.75rem',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ETH Wallet</h1>

      {/* No provider warning */}
      {!web3Available && (
        <div style={{ ...styles.alert, ...styles.alertError }}>
          ⚠️ MetaMask not detected. Please install MetaMask to use this wallet.
        </div>
      )}

      {/* Chain mismatch banner */}
      {isWrongChain && (
        <div style={styles.banner}>
          <strong>⚠️ Wrong Network</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            Please switch to Sepolia Testnet (Chain ID: {DEFAULT_CHAIN_ID})
          </p>
          <button
            onClick={handleSwitchChain}
            style={{ ...styles.button, marginTop: '0.5rem', backgroundColor: '#f59e0b' }}
          >
            Switch to Sepolia
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{ ...styles.alert, ...styles.alertError }}>
          ❌ {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div style={{ ...styles.alert, ...styles.alertSuccess }}>
          ✅ {success}
        </div>
      )}

      {/* Connect section */}
      {!isConnected ? (
        <div style={styles.card}>
          <button
            onClick={handleConnect}
            disabled={isConnecting || !web3Available}
            style={{
              ...styles.button,
              ...(isConnecting || !web3Available ? styles.buttonDisabled : {}),
            }}
          >
            {isConnecting ? 'Connecting...' : '🔐 Connect Wallet'}
          </button>
        </div>
      ) : (
        <>
          {/* Account & Balance */}
          <div style={styles.card}>
            <div style={styles.balanceText}>{formatEth(balance)} ETH</div>
            <div style={styles.accountText}>
              Account: {formatAddress(account)}
            </div>
            <div style={{ ...styles.accountText, marginTop: '0.25rem' }}>
              Chain ID: {chainId || 'Unknown'}
            </div>
          </div>

          {/* Send ETH form */}
          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>Send ETH</h3>
            <form onSubmit={handleSend}>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Recipient Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    style={styles.input}
                    disabled={isSending || isWrongChain}
                  />
                </div>
                <div>
                  <label style={styles.label}>Amount (ETH)</label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={styles.input}
                    disabled={isSending || isWrongChain}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending || !recipient || !amount || isWrongChain}
                  style={{
                    ...styles.button,
                    backgroundColor: '#10b981',
                    ...(isSending || !recipient || !amount || isWrongChain
                      ? styles.buttonDisabled
                      : {}),
                  }}
                >
                  {isSending ? 'Sending...' : '📤 Send Transaction'}
                </button>
              </div>
            </form>
          </div>

          {/* Receive info */}
          <div style={{ ...styles.card, textAlign: 'center' }}>
            <h3 style={{ marginTop: 0 }}>Receive ETH</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Send ETH to your address:
            </p>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                wordBreak: 'break-all',
              }}
            >
              {account}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              Balance updates every 25 seconds
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;

