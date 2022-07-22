import React from 'react'
import { GlobalStore } from '../context/GlobalState'



const Mainpage = () => {
  const { bankContract, Modal, selectedSymbol, showModal, setShowModal, displayModal, tokenSymbols, toRound, testFun, tokenBalances, currentAccount, getContract, getTokenContracts, whiteListed } = GlobalStore();


  const handleContract = async () => {
    const { maticContract, shibContract, usdtContract } = await getContract()
    console.log(bankContract)
    console.log("Contract : ", maticContract)
    console.log("Contract : ", shibContract)
    console.log("Contract : ", usdtContract)
  }
  const handleWhiteListing = async () => {
    await whiteListed();
  }

  const handleSymbol = async () => {
    await whiteListed();
    // await getTokenContracts(tokenSymbols);
  }

  const disModal = async () => {
    await testFun()
    displayModal()
  }

  return (
    <div>
      {currentAccount ?
        <div>
          <div className='list-group'>
            <div className='list-group-item'>
              {tokenSymbols ? <div>Hello</div> : <div>no</div>}
              {Object.keys(tokenBalances).map((symbol, idx) => {
                <div className=" row d-flex py-3" key={idx}>

                  <div className="col-md-6">
                    <div>{symbol.toUpperCase()}</div>
                  </div>
                  <div className="d-flex gap-4 col-md-6">
                    <small className="opacity-50 text-nowrap">{toRound(tokenBalances[symbol])}</small>
                  </div>

                </div>
              })}
            </div>

          </div>

        </div> : <div style={{ color: "white" }}> No Account Connected</div>
      }
    </div>
  )
}

export default Mainpage