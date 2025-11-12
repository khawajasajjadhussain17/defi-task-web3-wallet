# Prioritized Improvements for ETH Wallet

This document outlines potential enhancements to the DeFi wallet application, prioritized by impact and feasibility.

## High Priority (Must-Have)

### 1. **Transaction History & Status Tracking**
- **Impact:** High | **Effort:** Medium
- Display list of sent/received transactions
- Show transaction status (pending/confirmed/failed)
- Link to block explorer for each transaction
- Cache history in localStorage for faster loading

### 2. **Gas Fee Estimation & Customization**
- **Impact:** High | **Effort:** Medium  
- Display estimated gas fees before sending
- Allow users to set gas price (slow/normal/fast)
- Show total cost (amount + gas) in real-time
- Warn if balance insufficient for amount + gas

### 3. **ENS Name Resolution**
- **Impact:** High | **Effort:** Low
- Support .eth domain names as recipients
- Resolve ENS to address automatically
- Display ENS name for connected wallet if available
- Reverse lookup for received transactions

### 4. **Multiple Network Support**
- **Impact:** High | **Effort:** Medium
- Support mainnet, Sepolia, Goerli, and other testnets
- Network switcher in UI
- Persist selected network preference
- Auto-detect and suggest correct network

## Medium Priority (Should-Have)

### 5. **QR Code Scanner for Addresses**
- **Impact:** Medium | **Effort:** Low
- Scan QR codes to populate recipient address
- Generate QR code for receiving address
- Mobile-friendly camera integration
- Improves UX for mobile users significantly

### 6. **Address Book / Contacts**
- **Impact:** Medium | **Effort:** Medium
- Save frequently used addresses with labels
- Quick select from saved contacts
- Import/export address book
- Validate and prevent duplicate entries

### 7. **ERC-20 Token Support**
- **Impact:** High | **Effort:** High
- Display token balances (USDC, DAI, USDT, etc.)
- Send ERC-20 tokens
- Token approval flow
- Custom token import by contract address

### 8. **Balance Charts & Analytics**
- **Impact:** Medium | **Effort:** Medium
- Historical balance chart (7d/30d/1y)
- Transaction volume over time
- ETH/USD price conversion
- Portfolio value tracking

## Lower Priority (Nice-to-Have)

### 9. **Multi-Language Support (i18n)**
- **Impact:** Medium | **Effort:** Medium
- Support English, Spanish, Chinese, etc.
- Dynamically switch language in UI
- Localize error messages and labels
- Expand user base internationally

### 10. **Dark Mode / Theme Customization**
- **Impact:** Low | **Effort:** Low
- Toggle between light/dark themes
- Persist theme preference
- System preference detection
- Improves accessibility and user comfort

### 11. **Batch Transactions**
- **Impact:** Low | **Effort:** High
- Send to multiple addresses in one flow
- CSV import for bulk sends
- Useful for airdrops or payroll
- Requires advanced validation

### 12. **Hardware Wallet Support**
- **Impact:** Medium | **Effort:** High
- Support Ledger and Trezor devices
- Secure signing flow
- Better security for larger amounts
- Appeals to security-conscious users

---

## Security Enhancements

### 13. **Transaction Simulation Preview**
- Show what will happen before signing
- Detect malicious contracts
- Integration with services like Tenderly

### 14. **Phishing Protection**
- Warn about suspicious addresses
- Verify contract interactions
- Address checksum validation

### 15. **Session Timeout**
- Auto-disconnect after inactivity
- Protect user funds on shared devices
- Configurable timeout duration

---

## Performance Optimizations

### 16. **Progressive Web App (PWA)**
- Install as mobile/desktop app
- Offline-ready basics
- Push notifications for transactions

### 17. **GraphQL/Indexer for Transaction History**
- Use The Graph or similar
- Faster than polling RPC directly
- Better scalability

### 18. **Web Worker for Heavy Computations**
- Move balance calculations off main thread
- Better responsiveness
- Smoother animations

---

## Quick Wins (Low Effort, High Value)

- ✅ Copy address to clipboard with one click
- ✅ Show USD value alongside ETH balance (use price API)
- ✅ Add "Clear" button to reset send form
- ✅ Show recent recipient addresses (last 5)
- ✅ Add loading skeleton instead of blank states
- ✅ Keyboard shortcuts (Ctrl+V to paste address)
- ✅ Sound notification on transaction confirmation
- ✅ Success confetti animation on completed send

---

## Implementation Priority

**Phase 1 (MVP+):** Items 1-4  
**Phase 2 (Growth):** Items 5-8  
**Phase 3 (Scale):** Items 9-12  
**Ongoing:** Security & Performance items as needed

---

**Note:** This list should be revisited quarterly and reprioritized based on user feedback, analytics, and business goals.

