import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import contractAbi from "../contract/contract.abi.json";
import erc20Abi from "../contract/erc20.abi.json";

const ERC20_DECIMALS = 18;
const CONTRACT_ADDRESS = "0x681A31e0FE35F1B9ae369C0eaD5927e8843233f8";
const CUSD_CONTRACT_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

let kit;
let contract;

const connectCeloWallet = async function () {
    if (window.celo){
        displayNotification("Approve the CELO DBMS to use it!");
        try{
            await window.celo.enable();
            notificationOff();

            const web3 = new Web3(window.celo);
            kit = newKitFromWeb3(web3);

            const accounts = await kit.web3.eth.getAccounts();
            kit.defaultAccount = accounts[0];

            contract = new kit.web3.eth.Contract(
                contractAbi,
                CONTRACT_ADDRESS
            );
        } catch (error){
            displayNotification(`${error}.`);
        }
    } else{
        displayNotification("Please install the Celo Wallet Extension!");
    }
};

const getBalance = async function () {
    if (!kit){
        console.error("ContractKit is not initialized yet. Call connectCeloWallet() first!");
        return;
    }
    try{
        const totalBalance = await kit.getTotalBalance(kit.defaultAccount);
        const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
        document.querySelector("#balance").textContent = cUSDBalance;
    }
    catch (error){
        console.error(error);
    }
}


/* function notification(_text) {
	document.querySelector(".alert").style.display = "block";
	document.querySelector("#notification").textContent = _text;
} */

function notificationOff() {
	document.querySelector(".alert").style.display = "none";
}

function displayNotification(_text, isError=false){
    const notification = document.getElementById("notification");
    notification.textContent = _text;
    notification.style.color = isError ? "red" : "green";
}

const createUser = async (name, age) => {
    if (!kit) {
        console.error("ContractKit is not initialized yet. Call connectCeloWallet() first!");
        return;
    }

    try {
        const accounts = await kit.web3.eth.getAccounts();
        kit.defaultAccount = accounts[0];

        const contract = new kit.web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
        const gas = await contract.methods.createUser(name, age).estimateGas();
        const tx = await contract.methods.createUser(name, age).send({
            from: kit.defaultAccount,
            gas,
        });

        console.log("Transaction receipt:", tx);

        // Refresh the user list after creating a new user
        await displayUsers();
    } catch (error) {
        console.error(error);
    }
};

// Function to handle the form submission
const handleCreateUserForm = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);

    if (name && !isNaN(age)) {
        await createUser(name, age);
        document.getElementById("createUserForm").reset();
    } else {
        displayNotification("Please provide a valid name and age.", true);
    }
};

// Add an event listener to the "createUserButton" button
document.getElementById("createUserButton").addEventListener("click", handleCreateUserForm);

// Function to update a user
const updateUser = async (id) => {
    if (!kit) {
        console.error("ContractKit is not initialized yet. Call connectCeloWallet() first!");
        return;
    }

    try {
        const accounts = await kit.web3.eth.getAccounts();
        kit.defaultAccount = accounts[0];

        const contract = new kit.web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
        const gas = await contract.methods.updateUser(id, name, age).estimateGas();
        const tx = await contract.methods.updateUser(id, name, age).send({
            from: kit.defaultAccount,
            gas,
        });

        console.log("Transaction receipt:", tx);

        // Refresh the user list after updating a user
        await displayUsers();
    } catch (error) {
        console.error(error);
    }
};

// Function to delete a user
const deleteUser = async (id) => {
    if (!kit) {
        console.error("ContractKit is not initialized yet. Call connectCeloWallet() first!");
        return;
    }

    try {
        const accounts = await kit.web3.eth.getAccounts();
        kit.defaultAccount = accounts[0];

        const contract = new kit.web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
        const gas = await contract.methods.deleteUser(id).estimateGas();
        const tx = await contract.methods.deleteUser(id).send({
            from: kit.defaultAccount,
            gas,
        });

        console.log("Transaction receipt:", tx);

        // Refresh the user list after deleting a user
        await displayUsers();
    } catch (error) {
        console.error(error);
    }
};

// Function to display users
const displayUsers = async () => {
    if (!kit) {
        console.error("ContractKit is not initialized yet. Call connectCeloWallet() first!");
        return;
    }

    try {
        const accounts = await kit.web3.eth.getAccounts();
        kit.defaultAccount = accounts[0];

        const contract = new kit.web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
        const userCount = await contract.methods.userCount().call();

        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = ""; // Clear existing table rows

        for (let i = 1; i <= userCount; i++) {
            const user = await contract.methods.viewUser(i).call();
            const row = userTableBody.insertRow();
            row.insertCell(0).textContent = user.id;
            row.insertCell(1).textContent = user.name;
            row.insertCell(2).textContent = user.age;
            row.insertCell(3).textContent = user.registered ? "Yes" : "No";

            // Add update and delete buttons to each row
            const actionsCell = row.insertCell(4);
            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.classList.add("update-button");
            actionsCell.appendChild(updateButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");
            actionsCell.appendChild(deleteButton);
        }
    } catch (error) {
        console.error(error);
    }
};



// Add an event listener to the table for update and delete buttons
document.getElementById("userTableBody").addEventListener("click", async (event) => {
    const target = event.target;
    if (target.classList.contains("update-button")) {
        const row = target.parentElement.parentElement;
        const id = parseInt(row.cells[0].textContent);

        // Prompt for new name and age
        const newName = prompt("Enter the new name:");
        const newAge = parseInt(prompt("Enter the new age:"));

        if (newName !== null && !isNaN(newAge)) {
            await updateUser(id, newName, newAge);
        }
    } else if (target.classList.contains("delete-button")) {
        if (confirm("Are you sure you want to delete this user?")) {
            const row = target.parentElement.parentElement;
            const id = parseInt(row.cells[0].textContent);
            await deleteUser(id);
        }
    }
});

// Call the displayUsers function once when the page loads
window.addEventListener("load", async () => {
    displayNotification("Loading...");
    await connectCeloWallet();
    await displayUsers(); // Call the function to populate the table
    getBalance(); // Call the function to get the balance
    notificationOff(); // Turn off the loading notification
});
