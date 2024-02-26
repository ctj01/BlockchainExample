// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Example {

    struct User {
        uint256 id;
        string name;
        uint256 age;
    }
    mapping(address => User) public users;
    address[] public userAddresses;

    function createUser(string memory _name, uint256 _age) public {
        User memory newUser = User({
            id: userAddresses.length,
            name: _name,
            age: _age
        });
        users[msg.sender] = newUser;
        userAddresses.push(msg.sender);
    }

    function updateUser(string memory _name, uint256 _age) public {
        User storage user = users[msg.sender];
        user.name = _name;
        user.age = _age;
    }

    function deleteUser() public {
        delete users[msg.sender];
    }

    function getUsers() public view returns (User[] memory) {
        User[] memory _users = new User[](userAddresses.length);
        for (uint i = 0; i < userAddresses.length; i++) {
            _users[i] = users[userAddresses[i]];
        }
        return _users;
    }

    function getUser() public view returns (User memory) {
        return users[msg.sender];
    }
}
