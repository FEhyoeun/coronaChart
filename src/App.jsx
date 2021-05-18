import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Contents from './components/Contents';
import Loading from './components/Loading';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://api.covid19api.com/total/dayone/country/kr')
      .then(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <Header />
      {loading ? <Loading /> : <Contents />}
    </div>
  );
}

export default App;
