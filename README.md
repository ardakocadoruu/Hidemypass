<div align="center">

# 🔐 https://hidemypass.xyz/

### **Zero-Knowledge Password Manager on Solana**

*Your passwords. Your keys. Your control. No trust required.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solana](https://img.shields.io/badge/Solana-Devnet-14F195?logo=solana&logoColor=white)](https://solana.com)
[![Light Protocol](https://img.shields.io/badge/Light_Protocol-ZK_Compression-9945FF)](https://www.zkcompression.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[**Try Demo**](#-quick-start) • [**Documentation**](#-how-it-works) • [**Architecture**](#-architecture)

</div>

---

## 💡 The Problem

In 2022, LastPass was breached. **30 million encrypted vaults** were stolen. While the passwords were encrypted, users with weak master passwords were at risk. The fundamental issue? **Centralized servers are single points of failure.**

Traditional password managers require you to **trust** a company with your encrypted data. What if you didn't have to?

---

## ✨ The Solution

**HideMyPass** is the first truly **decentralized** password manager. Your encrypted vault lives on **IPFS**, your vault reference lives on **Solana blockchain**, and only you hold the keys.

```
🔑 Zero-Knowledge         → We can't see your passwords. Ever.
🌐 Decentralized          → No servers. No company. Just blockchain.
⚡ 99% Cheaper            → Light Protocol ZK Compression
🛡️  Military-Grade        → AES-256-GCM + 600k PBKDF2
```

---

## 🚀 Features

### **True Zero-Knowledge**
Your wallet signature derives encryption keys. Keys never leave your browser. We couldn't access your passwords even if we wanted to.

### **Decentralized Storage**
- Encrypted vault → **IPFS** (Pinata)
- Vault reference → **Solana** (Light Protocol ZK Compression)
- No servers, no databases, no company to trust

### **Triple Encryption**
1. **Vault Encryption:** AES-256-GCM (300k PBKDF2)
2. **CID Encryption:** On-chain privacy (300k PBKDF2)
3. **Per-Password Encryption:** Unique key per password

### **Insanely Cheap**
```
Traditional Solana:  $0.20 per vault
Light Protocol:      $0.002 per vault
Your annual cost:    ~$0.02 🤯
```

---

## 🎬 Quick Start

### Prerequisites
- Node.js 18+
- Phantom/Solflare wallet (Devnet)
- Free API keys: [Helius](https://helius.dev) + [Pinata](https://pinata.cloud)

### Installation

```bash
# Clone
git clone https://github.com/yourusername/hidemypass
cd hidemypass

# Install
npm install

# Configure
cp .env.example .env.local
# Add your API keys to .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### First Time Setup
1. **Connect Wallet** (Phantom/Solflare on Devnet)
2. **Sign Message** to derive encryption key
3. **Add Password** → Encrypted locally
4. **Save** → Upload to IPFS + Create on-chain reference
5. **Done!** Your vault is now on the blockchain

---

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │  Your passwords encrypted here
│   AES-256   │  Keys derived from wallet signature
└──────┬──────┘
       │
       │ Encrypted Data
       ▼
┌─────────────┐
│    IPFS     │  Encrypted vault stored
│   (Pinata)  │  CID: QmX5TtZ...
└──────┬──────┘
       │
       │ CID (encrypted)
       ▼
┌─────────────┐
│   Solana    │  Vault reference on-chain
│Light Protocol│ ZK Compressed (99% cheaper)
└─────────────┘
```

**Flow:**
1. Sign with wallet → Derive encryption key
2. Encrypt passwords → AES-256-GCM
3. Upload to IPFS → Get CID
4. Encrypt CID → Privacy protection
5. Store on Solana → Light Protocol compression
6. Transaction done → $0.002 total cost

---

## 🔐 Security

### **Encryption Layers**

#### Layer 1: Vault Encryption
```typescript
AES-256-GCM + PBKDF2 (300,000 iterations)
Key derived from: wallet.signMessage()
```

#### Layer 2: On-Chain Privacy
```typescript
CID encrypted before storing on Solana
Observers see: gibberish, not your IPFS location
```

#### Layer 3: Per-Password Encryption
```typescript
Each password: unique encryption key
Even if vault decrypted: passwords still encrypted
```

### **Attack Resistance**

| Attack Vector | Defense |
|---------------|---------|
| **Brute Force** | 600k PBKDF2 iterations = years to crack single password |
| **Server Hack** | No servers to hack 🎯 |
| **Database Leak** | No database exists 🎯 |
| **Company Breach** | Decentralized, no company holds data 🎯 |
| **Quantum Computer** | AES-256 remains secure (NIST approved) |

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Solana Wallet Adapter** - Wallet integration

### **Blockchain**
- **Solana** - Fast, cheap blockchain
- **Light Protocol** - ZK Compression (99% cost reduction)
- **Helius RPC** - ZK proof generation
- **Web3.js** - Solana interaction

### **Storage & Encryption**
- **IPFS (Pinata)** - Decentralized storage
- **Web Crypto API** - AES-256-GCM encryption
- **PBKDF2** - Key derivation (600k iterations)

---

## 📊 Comparison

|  | HideMyPass | LastPass | 1Password | Bitwarden |
|---|---|---|---|---|
| **Decentralized** | ✅ | ❌ | ❌ | ⚠️ Self-host |
| **Zero-Knowledge** | ✅ Wallet-based | ⚠️ Master password | ⚠️ Master password | ⚠️ Master password |
| **Annual Cost** | **$0.02** | $36 | $36-120 | $10-40 |
| **Server Breach Risk** | **0%** (no servers) | High (2022) | Medium | Medium |
| **Open Source** | ✅ Fully | ⚠️ Partial | ❌ | ✅ |
| **Blockchain** | ✅ Solana | ❌ | ❌ | ❌ |

---

## 🎯 Use Cases

### **For Crypto Users**
Your wallet is already your master key. Why use a separate master password? Use what you already have.

### **For Privacy Advocates**
No company. No servers. No trust required. Just math and blockchain.

### **For Developers**
Open source. Reusable patterns. Learn how to build zero-knowledge apps on Solana.

### **For Everyone**
Tired of $36/year subscriptions? Pay $0.02/year instead. That's **1800x cheaper**.

---

## 🚧 Roadmap

### **v1.0** (Current)
- ✅ Zero-knowledge encryption
- ✅ Light Protocol integration
- ✅ IPFS storage
- ✅ Solana Devnet

### **v1.1** (Next)
- [ ] Mainnet deployment
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Password generator

### **v2.0** (Future)
- [ ] Secure password sharing
- [ ] Team vaults
- [ ] Hardware wallet support (Ledger)
- [ ] Multi-device sync

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repo
2. **Create** a feature branch (`git checkout -b feature/amazing`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing`)
5. **Open** a Pull Request

### Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Lint code
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

Built with:
- [Light Protocol](https://www.zkcompression.com) - ZK Compression on Solana
- [Helius](https://helius.dev) - Solana RPC & ZK proof generation
- [Pinata](https://pinata.cloud) - IPFS pinning service
- [Solana](https://solana.com) - Fast, cheap blockchain

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/hidemypass/issues)
- **Docs:** See [LIGHT_PROTOCOL_INTEGRATION.md](LIGHT_PROTOCOL_INTEGRATION.md)
- **Demo:** [Live Demo](http://localhost:3000) (after `npm run dev`)

---

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Always keep backups of your seed phrase. We are not responsible for lost funds or data.

**Alpha software:** Test thoroughly before using with real passwords.

---

<div align="center">

**Made with ❤️ for Solana Privacy Hack**

[⭐ Star us on GitHub](https://github.com/yourusername/hidemypass) • [🐦 Follow on Twitter](https://twitter.com/yourusername)

</div>
