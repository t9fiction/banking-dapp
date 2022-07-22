import { createContext, useContext, useEffect, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Authereum from "authereum";
// import MewConnect from "@myetherwallet/mewconnect-web-client";
import { ethers, BigNumber } from 'ethers';
import Web3Modal from "web3modal";
import Modal from '../Modal.css'

import bankArtifact from '../artifacts/contracts/Bank.sol/Bank.json';
import maticArtifact from '../artifacts/contracts/Matic.sol/Matic.json';
import shibArtifact from '../artifacts/contracts/Shib.sol/Shib.json';
import usdtArtifact from '../artifacts/contracts/Usdt.sol/Usdt.json';

// const { ethereum } = window;
const CONTRACT_ADDRESS = "0x985145dc3B4b828fFaDcDb84DaA51e49aBF02828"
const CONTRACT_ABI = bankArtifact.abi;

const MATIC_ADDRESS = "0x90Ef03168ec5C20793e6626c14620c8ceD90eBAd"
const MATIC_ABI = maticArtifact.abi;

const SHIB_ADDRESS = "0xc6d150c283f76e20870ECf062fFec7d17a1e8A8F"
const SHIB_ABI = shibArtifact.abi;

const USDT_ADDRESS = "0x9c90e58f1a944ede9370220cD736dC0963BED2BB"
const USDT_ABI = usdtArtifact.abi;

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [web3Modal, setWeb3Modal] = useState(null)
    const [bankContract, setBankContract] = useState(undefined);
    const [balance, setBalance] = useState();
    const [currentAccount, setCurrentAccount] = useState("");
    const [mintAmount, setMintAmount] = useState(1)
    const [tokenSymbols, setTokenSymbols] = useState([])
    const [tokenContracts, setTokenContracts] = useState({})
    const [tokenBalances, setTokenBalances] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(undefined);
    // const isConnected = Boolean(accounts[0]);

    const providerOptions = {
        /* See Provider Options Section */
        coinbasewallet: {
            package: CoinbaseWalletSDK, // Required
            options: {
                appName: "Desi Kukar", // Required
                infuraId: "17342b0f3f344d2d96c2c89c5fddc959", // Required
                rpc: "", // Optional if `infuraId` is provided; otherwise it's required
                chainId: 4, // Optional. It defaults to 1 if not provided
                darkMode: false // Optional. Use dark theme, defaults to false
            }
        },

        walletconnect: {
            display: {
                name: "Mobile"
            },
            package: WalletConnectProvider,
            options: {
                infuraId: "17342b0f3f344d2d96c2c89c5fddc959" // required
            }
        },
        authereum: {
            package: Authereum // required
        },
        // mewconnect: {
        //     package: MewConnect, // required
        //     options: {
        //         infuraId: "17342b0f3f344d2d96c2c89c5fddc959" // required
        //     }
        // }
    };


    const getModalConnect = async () => {
        const web3Modal = new Web3Modal({
            network: "rinkeby",
            cacheProvider: true, // very important
            providerOptions,
        });
        await web3Modal.connect();
        console.log("Web3Modal : ", web3Modal)
        setWeb3Modal(web3Modal)
    }

    const getContract = async () => {
        const provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        // const bankContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const maticContract = new ethers.Contract(MATIC_ADDRESS, MATIC_ABI, signer);
        const shibContract = new ethers.Contract(SHIB_ADDRESS, SHIB_ABI, signer);
        const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
        return { maticContract, shibContract, usdtContract }
    };

    // disconnect wallet
    const disconnectWallet = async () => {
        await web3Modal.clearCachedProvider()
    }

    //Helper functions
    const toBytes32 = text => (ethers.utils.formatBytes32String(text));
    const toString = bytes32 => (ethers.utils.parseBytes32String(bytes32));
    const toWei = ether => (ethers.utils.parseEther(ether));
    const toEther = wei => (ethers.utils.formatEther(wei).toString());
    const toRound = num => (Number(num).toFixed(2));

    const whiteListed = async () => {
        // const provider = await web3Modal.connect();
        // const { bankContract } = await getContract()
        await bankContract?.getWhitelistedSymbols().then((result) => {
            const symbols = result.map(s => toString(s))
            // console.log("result", symbols)
            setTokenSymbols(symbols)
            getTokenContracts(symbols)
            // console.log("result", tokenSymbols)
        })
        // console.log("Bank Contract Methods : ",bankContract.functions.getWhitelistedSymbols)
    }

    // const getTokenContract = async(symbol, _bankContract) =>{
    //     const address = await _bankContract.
    // }

    const getTokenContracts = async (symbols) => {
        const { maticContract, shibContract, usdtContract } = await getContract()
        symbols.map(async symbol => {
            console.log("getTokenContract: ", symbol)
            symbol === 'Matic' ?
                setTokenContracts(prev => ({ ...prev, [symbol]: maticContract }))
                : symbol === 'Shib' ?
                    setTokenContracts(prev => ({ ...prev, [symbol]: shibContract }))
                    :
                    setTokenContracts(prev => ({ ...prev, [symbol]: usdtContract }))
        })
    }

    const getTokenBalance = async (symbol, signer) => {
        const balance = await bankContract?.connect(signer).getTokenBalance(toBytes32(symbol))
        console.log("Balance : ", balance)
        return toEther(balance)
    };

    const getTokenBalances = async (signer) => {
        tokenSymbols.map(async symbol => {
            const balance = await getTokenBalance(symbol, signer)
            setTokenBalances(prev => ({ ...prev, [symbol]: balance.toString() }))
            console.log(symbol, " : ", tokenBalances)
        })
    }

    const displayModal = (symbol) => {
        setShowModal(true)
        setSelectedSymbol(symbol)
    }

    // const mintToken = async () => {
    //     try {
    //         const contract = await getContract();
    //         const response = await contract.mint(BigNumber.from(mintAmount), {
    //             value: ethers.utils.parseEther((0.02 * mintAmount).toString())
    //         })
    //         // const response = await contract.mintNFTs(1, {
    //         //     value: ethers.utils.parseEther('0.01')
    //         // });
    //         await response.wait();
    //         // getMintedStatus();
    //         // getCount();
    //     } catch (error) {
    //         console.log("error: ", error)
    //     }

    // }

    // const testFun = async () => {
    //     const provider = await web3Modal.connect();
    //     const ethersProvider = new ethers.providers.Web3Provider(provider)
    //     const signer = ethersProvider.getSigner();
    //     const acc = await signer.getAddress()
    //     // console.log(signer,"signerFun")
    //     // console.log(acc,"accFun")
    //     await getTokenBalances(acc);
    // }


    useEffect(() => {
        const init = async () => {
            if (web3Modal) {
                const provider = await web3Modal.connect();
                const ethersProvider = new ethers.providers.Web3Provider(provider)
                const signer = ethersProvider.getSigner();
                const acc = await signer.getAddress()
                const bankContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                setBankContract(bankContract)
                // await getTokenContracts(tokenSymbols);
                setCurrentAccount(acc);
                // console.log(acc)
                // if (tokenSymbols) {
                // }
            }
        }
        init();
    }, [web3Modal]);
    
    useEffect(() => {
        const init = async () => {
            await whiteListed().then((result) => {
                console.log(result)
            }).catch((err) => {
                console.log(err)
            })
            await getTokenBalances(currentAccount);
            // console.log("1nd Effect")
        }
        init();
    }, [bankContract]);

    return (
        <GlobalContext.Provider value={{
            setMintAmount, mintAmount, selectedSymbol, displayModal, Modal, showModal, setShowModal, tokenBalances, toRound, currentAccount, tokenSymbols, bankContract, getTokenContracts, whiteListed, getModalConnect, getTokenBalance, disconnectWallet, getContract, setCurrentAccount
        }} >
            {children}
        </GlobalContext.Provider>
    )
}

export const GlobalStore = () => useContext(GlobalContext);