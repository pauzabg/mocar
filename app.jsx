import { useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import "@solana/wallet-adapter-react-ui/styles.css";

// 🔁 Настройки
const network = "https://api.devnet.solana.com"; // или mainnet
const connection = new Connection(network);

// 🔁 Сложи тук ТВОЯ SPL TOKEN
const TOKEN_MINT = new PublicKey("AVAAGbfn8KQ7tZH8MzdkcknevTcmPZ7PaX462gH88spL");

// 🔁 Сложи тук ТВОЯ SOL АДРЕС
const DESTINATION_WALLET = new PublicKey("6bwPmLCcNS3WiEUPsaMQQ7Bc9p8YYLGGKiTdpLVg2wgD");

// ❗ Ако ползваш backend, сложи тук ключа на притежателя на токените
const SENDER_KEYPAIR = null;

function App() {
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [solAmount, setSolAmount] = useState(0);

  useEffect(() => {
    if (publicKey) {
      getTokenBalance();
    }
  }, [publicKey]);

  const getTokenBalance = async () => {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: TOKEN_MINT,
    });

    if (tokenAccounts.value.length > 0) {
      const userBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      setBalance(userBalance);
    } else {
      setBalance(0);
    }
  };

  const sendTokenToBuyer = async (buyerPublicKey, tokenAmount) => {
    if (!SENDER_KEYPAIR) return;

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      SENDER_KEYPAIR,
      TOKEN_MINT,
      SENDER_KEYPAIR.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      SENDER_KEYPAIR,
      TOKEN_MINT,
      buyerPublicKey
    );

    await transfer(
      connection,
      SENDER_KEYPAIR,
      fromTokenAccount.address,
      toTokenAccount.address,
      SENDER_KEYPAIR.publicKey,
      tokenAmount * 10 ** 6 // настрой за твоите десетични
    );
  };

  const buyTokens = async () => {
    if (!
