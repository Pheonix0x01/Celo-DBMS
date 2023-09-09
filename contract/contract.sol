// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; // Updated to use the latest stable version

/**
 * @dev Required interface of an ERC20 compliant contract.
 */
interface IERC20Token {
    function transfer(address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
    function totalSupply() external view returns (uint256);
    function balanceOf(address) external view returns (uint256);
    function allowance(address, address) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Dbms {

    address private cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
        
    struct User {
        uint256 id;
        string name;
        uint256 age;
        bool registered;
    }

    uint256 public userCount;
    mapping(uint256 => User) public users;

    event UserCreated(uint256 id, string name, uint256 age); // To create user
    event UserUpdated(uint256 id, string name, uint256 age); // To update user
    event UserRegistered(uint256 id, bool registered); // To make sure user is registered
    event UserDeleted(uint256 id); // To delete user

    /**
     * @dev Create a new user with the given name and age.
     */
    function createUser(string memory _name, uint256 _age) public {
        userCount++;
        users[userCount] = User(userCount, _name, _age, false);
        emit UserCreated(userCount, _name, _age);
    }

    /**
     * @dev Update user details by ID.
     * @param _id The ID of the user to update.
     * @param _name The new name.
     * @param _age The new age.
     */
    function updateUser(uint256 _id, string memory _name, uint256 _age) public {
        User storage user = users[_id];
        require(userExists(user), "User does not exist");
        user.name = _name;
        user.age = _age;
        emit UserUpdated(_id, _name, _age);
    }

    /**
     * @dev Complete user registration by ID.
     * @param _id The ID of the user to complete registration for.
     */
    function completeRegistration(uint256 _id) public {
        User storage user = users[_id];
        require(userExists(user), "User does not exist");
        user.registered = true;
        emit UserRegistered(_id, true);
    }

    /**
     * @dev Delete user by ID. This marks the user as deleted.
     * @param _id The ID of the user to delete.
     */
    function deleteUser(uint256 _id) public {
        User storage user = users[_id];
        require(userExists(user), "User does not exist");
        delete users[_id];
        emit UserDeleted(_id);
    }

    /**
     * @dev View user details by ID.
     * @param _id The ID of the user to view.
     * @return The user's details.
     */
    function viewUser(uint256 _id) public view returns (User memory) {
        return users[_id];
    }

    /**
     * @dev Check if a user exists based on their ID.
     * @param _user The user to check.
     * @return True if the user exists, false otherwise.
     */
    function userExists(User memory _user) private pure returns (bool) {
        return _user.id > 0;
    }

    /**
     * @dev Get the address of the cUSD token contract.
     * @return The address of the cUSD token contract.
     */
    function getCUsdTokenAddress() public view returns (address) {
        return cUsdTokenAddress;
    }
}
