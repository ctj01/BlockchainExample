
"use client";
import { useEffect, useState } from "react";
import abi from '../../artifacts/contracts/Example.sol/Example.json'
import { ethers } from "ethers";
import PrimaryButton from "../components/primary-button";
import Input from "@/components/input";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [userToCreate, setUserToCreate] = useState({ name: '', age: '' });
  const [users, setUsers] = useState([])
  const ABI = abi.abi
  const contractExample = process.env.NEXT_PUBLIC_EXAMPLE_CONTRACT_ADDRESS

  const getUsers = async () => {
    if (ethereum && connectedAccount) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractExample, ABI, signer)
      const userList = await contract.getUsers()
      setUsers(userList)

    }
  }
  const getConnectedAccount = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }

    if (ethereum) {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      handleAccounts(accounts);
    }
  };
  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('We have an authorized account: ', account);
      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet")
    }
  };

  const connectAccount = async () => {
    if (!ethereum) {
      alert('MetaMask is required to connect an account');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    handleAccounts(accounts);
  };
  const createUser = async (name, age) => {
    if (ethereum && connectedAccount) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractExample, ABI, signer)
      const tx = await contract.createUser(name, age)
      await tx.wait()
      const clearForm = { name: '', age: '' }
      setUserToCreate(clearForm)
      getUsers()
    }

  }
  const handleChange = (e) => {
    setUserToCreate({ ...userToCreate, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    await createUser(userToCreate.name, userToCreate.age)
  }
  useEffect(() => {
    getUsers()
  }, []);
  useEffect(() => {
    getConnectedAccount();
  }, []);

   
  return (
    <main className="flex justify-center" >
      <div className="flex flex-col">
        <div className="mt-6">
          <h1 className="text-rose-950 text-4xl text-center">Example</h1>
        </div>
        <div>
          {!connectedAccount ? (
            <div className="mt-6">
              <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
            </div>
          ) : (
            <div className="mt-6">
              <h4 className="font-bold text-base">User register</h4>
              <form className="mt-6">
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                  <div className="form-group">
                    <Input type="text" name="name" placeholder="Enter your name" value={userToCreate.name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <Input type="number" name="age" placeholder="Enter your age" value={userToCreate.age} onChange={handleChange} />
                  </div>
                </div>

                <br />
                <br />
                <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
              </form>
              <div class="relative overflow-x-auto mt-6">
                  <h4 className="font-bold text-base">Users</h4>
                  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-6">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr> <th class="p-2">Name</th> <th class="p-2">Age</th> </tr>
                      </thead>
                      <tbody class="bg-white divide-y dark:divide-gray-700 dark:divide-gray-600 dark:bg-gray-800">
                        {users.map((user, index) => {
                          return (
                            <tr key={index} class="text-gray-700 dark:text-gray-400">
                              <td class="p-2">{user.name}</td>
                              <td class="p-2">{user.age}</td>
                            </tr>
                          )
                        }
                        )}
                      </tbody>
                  </table>

            </div>
        </div>)}
        </div>
      </div>
    </main>
  );
}
