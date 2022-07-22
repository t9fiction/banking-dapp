import './App.css';
import Mainpage from './components/Mainpage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <div className="App">
        <header className="App-header">
          <div style={{width:"85%", color:"yellow"}}>
            HOME | NFT | CRYPTO | CONTACT
          </div>
          <div style={{width:"15%", fontFamily: 'monospace'}}>
            <Navbar />
          </div>
        </header>
        <Mainpage />
      </div>
      {/* <div className='moving-background'></div> */}
    </div>
  );
}

export default App;
