import React from 'react'
import { GlobalStore } from '../context/GlobalState'

const Navbar = () => {
    const { getModalConnect, currentAccount, disconnectWallet, setCurrentAccount } = GlobalStore();
    const handleConnect = async () => {
        await getModalConnect()
      }
      
      const handleDisconnect = async () => {
        await disconnectWallet()
        setCurrentAccount("")
      }
    return (
        <div>
            {currentAccount ?
            <div style={{display: 'flex', flexDirection:'row', height:'8vh', top:'0',right:'0', position:'absolute'}}>
            <>Welcome: {currentAccount.substring(0,6)}...</>
                <button onClick={() => handleDisconnect()}>Disconnect</button>
                </div>
                :
                <button onClick={() => handleConnect()}>Connect</button>}
        </div>
    )
}

export default Navbar