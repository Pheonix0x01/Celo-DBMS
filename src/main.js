import Web3 from "web3";
import { ContractKit } from "@celo/contractkit";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import contractAbi from "../contract/contract.abi.json";
import erc20Abi from "../contract/erc20.abi.json";


const ERC20_DECIMALS = 18;
const ContractAddress = "0xb6dA3dC8cd69b0D2711b8E1534d0FFfE82575EE6";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

let kit;
let contract;
let users;

const connectCeloWallet = async function (){
    if (window.celo){
        notification("Approve the Celo DBMS...");
        try{
            await window.celo.enable();
            notificationOff();

            const web3 = new Web3(window.celo);
            kit = newKitFromWeb3(web3);
            const accounts = await kit.web3.eth.getAccounts();
            kit.defaultAccount = accounts[0];

            contract = new kit.web3.eth.Contract(
                contractAbi,
                ContractAddress
            );

        } catch (error) {
            notification(`${error}.`);
        }

    }else {
        notification("Install the celo extension wallet to use this DApp!!!");
    }
};

async function approve(){
    const cUSDContract = new kit.web3.eth.Contract(
        erc20Abi,
        cUSDContractAddress
    );
    const result = await cUSDContract.methods
        .approve(ContractAddress)
        .send({ from: kit.defaultAccount });
    return result;    
};

const getBalance = async function(){
    const totalBalance = await kit.getTotalBalance(kit.defaultAccount);
    const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
    document.querySelector("#balance").textContent = cUSDBalance;
}

// document.getElementById("updateuserBtn").addEventListener("click", function(event){
//     event.preventDefault(); // To prevent default link behaviour
//     contract.methods.updateUser();
// })
document.querySelector("#userList").addEventListener("click", async(e) =>{
    if (e.target.className.includes("upgradeUserBtn")){
        const id = e.target.id;
        let name = prompt(`Enter new name for "${users[id].name}":`);
        let age = prompt(`Enter new age for "${users[id].name}":`);
    
        try{
            const result = await contract.methods.updateUser(id, name, age);
        } catch (error) {
            notification(`${error}.`);
        }
    }
    
    if (e.target.className.include("deleteUserBtn")){
        const id = e.target.id;
        notification(`Deleting User...`);
    
        try{
            const result = await contract.methods.deleteUser(id);
            notification(`User successfully deleted!`);
        } catch (error) {
            notification(`${error}.`);
        }
    }
});

document.querySelector("#submitBtn").addEventListener("click", async(e) => {
    const params = [
        document.getElementById("name").value,
        document.getElementById("age").value,
    ];
    notification(`Adding new user...`);

    try {
        const result = await contract.methods.createUser(...params);
    } catch (error) {
        notification(`${error}.`);
    }
    notification(`Successfully added new user!`);
});


function populateTable(){
    var tableBody = document.querySelector("userList tbody");

    data.forEach(function(item){
        var row = document.createElement("tr");

        var nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        var ageCell = document.createElement("td");
        nameCell.textContent = item.age;
        row.appendChild(ageCell);

        tableBody.appendChild(row);
    });
}

function notification(_text){
    document.querySelector(".alert").style.display = "block";
    document.querySelector("#nptification").textContent = _text;
}

function notificationOff(){
    document.querySelector(".alert").style.display = "none";
}

window.addEventListener("load", async () => {
    notification("Loading...");
    await connectCeloWallet();
    await getBalance();
    populateTable();
    notificationOff();
});

