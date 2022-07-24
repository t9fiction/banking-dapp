import React from 'react'
import { GlobalStore } from '../context/GlobalState'



const Mainpage = () => {
  const { bankContract, Modal, selectedSymbol, showModal, setShowModal, displayModal, depositOrWithdraw, toRound, tokenBalances, currentAccount, getContract, isDeposit, setIsDeposit, setAmount, whiteListed } = GlobalStore();


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

  return (
    <div>
      {currentAccount ?
        <div>
          <div className='list-group'>
            <div className='list-group-item'>
              {Object.keys(tokenBalances).map((symbol, idx) => (
                <div className=" row d-flex py-3" key={idx}>
                  <div className="col-md-6">
                    <div>{symbol.toUpperCase()}</div>
                  {/* </div>
                  <div className="d-flex gap-4 col-md-6"> */}
                    <small className="opacity-50 text-nowrap">{toRound(tokenBalances[symbol])}</small>
                  </div>

                  <div className="d-flex gap-4 col-md-6">
                    <button onClick={() => displayModal(symbol)} className="btn btn-primary">Deposit/Withdraw</button>
                    <Modal
                      show={showModal}
                      onClose={() => setShowModal(false)}
                      symbol={selectedSymbol}
                      depositOrWithdraw={depositOrWithdraw}
                      isDeposit={isDeposit}
                      setIsDeposit={setIsDeposit}
                      setAmount={setAmount}
                    />
                  </div>
                </div>
              )
              )}
            </div>

          </div>

        </div> : <div style={{ color: "white" }}> No Account Connected</div>
      }
    </div>
  )
}

export default Mainpage