const connectButton = document.getElementById("connect-wallet-btn");
const buyButton = document.getElementById("buy-btn");
const solAmountInput = document.getElementById("sol-amount");
const statusText = document.getElementById("status");

let walletPublicKey = null;

connectButton.addEventListener("click", async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            await window.solana.connect();
            walletPublicKey = window.solana.publicKey.toString();
            statusText.innerText = `Портфейл свързан: ${walletPublicKey}`;
            connectButton.innerText = "Портфейл свързан";
        } catch (err) {
            console.error(err);
            statusText.innerText = "Грешка при свързване на портфейл.";
        }
    } else {
        alert("Инсталирайте Phantom портфейл.");
    }
});

buyButton.addEventListener("click", async () => {
    const solAmount = solAmountInput.value;
    if (!walletPublicKey) {
        statusText.innerText = "Моля, свържете портфейла си първо.";
        return;
    }
    if (!solAmount) {
        statusText.innerText = "Моля, въведете количество SOL.";
        return;
    }

    // Изпращане на SOL към твоя адрес (тук ще трябва да добавиш своя адрес)
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: walletPublicKey,
            toPubkey: "ТВОЯТ_АДРЕС_ЗА_ПРИЕМАНЕ_НА_SOL",
            lamports: solAmount * solanaWeb3.LAMPORTS_PER_SOL,
        })
    );

    try {
        const signature = await window.solana.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signature, "processed");
        statusText.innerText = `Транзакцията е успешна: ${signature}`;
    } catch (err) {
        console.error(err);
        statusText.innerText = "Грешка при изпращане на транзакцията.";
    }
});
