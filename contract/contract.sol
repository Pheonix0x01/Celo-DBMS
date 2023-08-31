// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0; //this contract works for solidty version from 0.7.0 to less than 0.9.0
/**
 * @dev Required interface of an ERC20 compliant contract.
 */
interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address, uint256) external returns (bool);

    /**
     * @dev Transfers `tokenId` token from `from` to `to`
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    /**
     *@dev Returns the number of tokens in``owner``'s acount.
     */
    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    /**
     *@dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     *@dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
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


    // function parseInt(string memory _value) internal pure returns (uint256) {
    //     uint256 result = 0;
    //     bytes memory valueBytes = bytes(_value);
    //     for (uint256 i = 0; i < valueBytes.length; i++) {
    //         uint256 digit = uint256(uint8(valueBytes[i])) - 48;
    //         if (digit > 9) {
    //             break; // Invalid digit found, exit the loop
    //         }
    //         result = result * 10 + digit;
    //     }
    //     return result;
    // } Made this weird function to parse a string to int. Turns out i dont need it anymore. I'll still leave it here for future use lol


    function createUser(string memory _name, uint256 _age) public {
        userCount++;
        users[userCount] = User(userCount, _name, _age, false);
        emit UserCreated(userCount, _name, _age);
    }

    function updateUser(uint256 _id, string memory _name, uint256 _age) public {
        User storage user = users[_id];
        require(userExists(user), "User does not exist");
        user.name = _name;
        user.age = _age;
        emit UserUpdated(_id, _name, _age);
    }

    function completeRegistration(uint256 _id) public {
        User storage user = users[_id];
        require(userExists(user), "User does not exist");
        user.registered = true;
        emit UserRegistered(_id, true);
    }

    function deleteUser(uint256 _id) public {
        User storage user = users[_id];
        require(userExists(user), "User does not exist");
        delete users[_id];
        userCount --;
        emit UserDeleted(_id);
    }

    function userExists(User memory _user) private pure returns (bool) {
        return _user.id > 0;
    }
}
