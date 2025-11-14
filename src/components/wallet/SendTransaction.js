import React, { useState } from 'react';
import { sendTransaction, formatEth } from '../../utils/web3';
import './SendTransaction.css';

const SendTransaction = ({ account, onTransactionComplete }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txStatus, setTxStatus] = useState(null); // null, 'success', 'error'
  const [txHash, setTxHash] = useState(null);
  const [txUrl, setTxUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setTxStatus(null);
    setTxHash(null);
    setTxUrl(null);

    // Validation
    if (!recipient || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setIsSending(true);

    try {
      const result = await sendTransaction(account, recipient, amount);

      if (result.success) {
        setTxStatus('success');
        setTxHash(result.txHash);
        setTxUrl(result.explorerUrl);
        
        // Reset form
        setRecipient('');
        setAmount('');

        // Notify parent component
        if (onTransactionComplete) {
          onTransactionComplete(result);
        }
      } else {
        setTxStatus('error');
        setError(result.error);
      }
    } catch (err) {
      setTxStatus('error');
      setError(err.message || 'Transaction failed');
    } finally {
      setIsSending(false);
    }
  };

  const handleMaxAmount = () => {
    // This is simplified - in production, you'd fetch balance and subtract gas
    setAmount('0.01');
  };

  if (!account) {
    return null;
  }

  return (
    <div className="send-transaction">
      <div className="send-card">
        <h3 className="send-title">
          <i className="fas fa-paper-plane me-2"></i>
          Send ETH
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="recipient" className="form-label">
              Recipient Address
            </label>
            <input
              type="text"
              className="form-control"
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isSending}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount (ETH)
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id="amount"
                placeholder="0.0"
                step="0.000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSending}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleMaxAmount}
                disabled={isSending}
              >
                MAX
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 btn-send"
            disabled={isSending || !recipient || !amount}
          >
            {isSending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Send Transaction
              </>
            )}
          </button>
        </form>

        {/* Status Messages */}
        {txStatus === 'success' && txHash && (
          <div className="alert alert-success mt-3" role="alert">
            <h5 className="alert-heading">
              <i className="fas fa-check-circle me-2"></i>
              Transaction Sent!
            </h5>
            <p className="mb-2">
              <small className="text-muted">Transaction Hash:</small>
              <br />
              <code className="tx-hash">{txHash.substring(0, 20)}...{txHash.substring(txHash.length - 10)}</code>
            </p>
            {txUrl && (
              <a
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-success"
              >
                <i className="fas fa-external-link-alt me-2"></i>
                View on Explorer
              </a>
            )}
          </div>
        )}

        {txStatus === 'error' && error && (
          <div className="alert alert-danger mt-3" role="alert">
            <h5 className="alert-heading">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Transaction Failed
            </h5>
            <p className="mb-0">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="info-box mt-3">
          <small className="text-muted">
            <i className="fas fa-info-circle me-2"></i>
            You'll be prompted to confirm this transaction in MetaMask. Gas fees will be calculated automatically.
          </small>
        </div>
      </div>
    </div>
  );
};

export default SendTransaction;

