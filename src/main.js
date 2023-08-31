import Web3 from "web3";
import { ContractKit } from "@celo/contractkit";

const ERC20_DECIMALS = 18;
const ContractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

let kit;

const connectCeloWallet = async function () {
    if (window.celo) {
        try {
            await window.celo.enable();
            const web3 = new Web3(window.celo);
            kit = new ContractKit(web3);
            const accounts = await kit.web3.eth.getAccounts();
            kit.defaultAccount = accounts[0];
            getBalance();
        } catch (error) {
            console.error(error);
        }
    } else {
        console.error("Install the Celo extension wallet to use this DApp!!!");
    }
};

const getBalance = async function () {
    if (!kit) {
        console.error("Celo wallet is not connected.");
        return;
    }

    try {
        const totalBalance = await kit.getTotalBalance(kit.defaultAccount);
        const cUSDBalance = totalBalance.cUSD.toString();
        document.querySelector("#balance").textContent = cUSDBalance;
    } catch (error) {
        console.error("Error getting balance:", error);
    }
};



window.addEventListener("load", async () => {
    await connectCeloWallet();
    await getBalance();
});
