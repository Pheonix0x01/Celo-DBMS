import Web3 from "web3";
import { ContractKit } from "@celo/contractkit";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import contractAbi from "../contract/contract.abi.json";
import erc20Abi from "../contract/erc20.abi.json";


const ERC20_DECIMALS = 18;
const ContractAddress = "0xb74e1c04E449306FF0df8fE924E777C3f56e34e0";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

let kit;
let contract;
let users = [];

const connectCeloWallet = async function () {
    if (window.celo) {
        notification("Approve the Celo DBMS...")
        try {
            await window.celo.enable();
            notification("Celo Wallet Connected");
            setTimeout(notificationOff, 3000); // 3 second delay before turning of the notification
            const web3 = new Web3(window.celo);
            kit = newKitFromWeb3(web3);
            const accounts = await kit.web3.eth.getAccounts();
            kit.defaultAccount = accounts[0];

            contract = new kit.web3.eth.Contract(
                contractAbi,
                ContractAddress
            );
            getBalance();
        } catch (error) {
            notification(`${error}.`);
        }
    } else {
        notification("Install the celo extension wallet to use this DApp!!!");
    }
};

const getBalance = async function () {
    if (!kit) {
        console.error("Celo wallet is not connected.");
        return;
    }

    try {
        const totalBalance = await kit.getTotalBalance(kit.defaultAccount);
        const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
        document.querySelector("#balance").textContent = cUSDBalance;
    } catch (error) {
        console.error("Error getting balance:", error);
    }
};

function notification(_text){
    document.querySelector(".alert").style.display = "block";
    document.querySelector("#notification").textContent = _text;
}

function notificationOff(){
    document.querySelector(".alert").style.display = "none";
}

const getUsers = async function(){
    const _numberOfUsers = await contract.methods
            .userCount()
            .call();

    const _users = [];
    
    for (let i=0; i<_numberOfUsers; i++){
        let _user = new Promise(async(resolve, reject) =>{
            let p = await contract.methods.viewUser(i).call;
            resolve({
                index: i,
                name: p[0],
                age: p[1],
                registered: p[2],

            });
        });
        _users.push(_user);
    }
    users = await Promise.all(_users);
    renderUsers();
};

function renderUsers(){
    document.getElementById("userList").innerHTML = "";
    users.forEach((_user) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = _user.name;

        const ageCell = document.createElement("td");
        ageCell.textContent = _user.age;

        row.appendChild(nameCell);
        row.appendChild(ageCell);

        tableBody.appendChild(row);
    });
}

async function approve(){
    const cUSDContract = new kit.web3.eth.Contract(
            erc20Abi,
            cUSDContractAddress
    );

    const result = await cUSDContract.methods
            .approve(ContractAddress)
            .send({ from: kit.defaultAccount });
    return result;        
}

document.querySelector("#submitBtn").addEventListener("click", async (e) => {
    const params = [
        document.getElementById("name").value,
        document.getElementById("age").value,

    ];
    notification(`Adding "${params[0]}"...`);
    try{
        await contract.methods
            .createUser(...params)
            .send({ from: kit.defaultAccount }); 
                                            
    notification(`MADE IT HERE`) ;                              
    } catch (error){
        notification(`${error}.`);
    }
    setTimeout(() => {
        notification(`"${params[0]}", successfully added to the database`);
    }, 1000);

    setTimeout(() => {
        notificationOff();
    }, 2000)
    redirectToUserList("../public/userList.html");
});

document.querySelector("#backToList").addEventListener("click", async (e) =>{
    try{
        redirectToUserList("../publicuserList.html");
    } catch(error){
        notification(`${error}`);
    }
})

function redirectToUserList(){
    window.location.href = url;
}


// function getUserList(){
    
// }



window.addEventListener("load", async () => {
    await connectCeloWallet();
    await getBalance();
});
