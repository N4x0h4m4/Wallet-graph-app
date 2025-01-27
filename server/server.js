const express = require('express');
const { Web3 } = require('web3');

const app = express();
const port = 3001;

// Infura の API キーに置き換えてください
const chains = [
  { name: 'Sepolia ETH', web3: new Web3('https://sepolia.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'ETH', web3: new Web3('https://mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Liena', web3: new Web3('https://linea-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Polygon', web3: new Web3('https://polygon-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Base', web3: new Web3('https://base-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4')},
  { name: 'Optimism', web3: new Web3('https://optimism-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4')},
  { name: 'Arbitrum', web3: new Web3('https://arbitrum-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  //{ name: 'AvalanchC', web3: new Web3('https://avalanche-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  // { name: 'ZKSync', web3: new Web3('https://zksync-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  // { name: 'BSC', web3: new Web3('https://bsc-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  // { name: 'Mantle', web3: new Web3('https://mantle-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  // { name: 'Scroll', web3: new Web3('https://scroll-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
];

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://www.gstatic.com 'unsafe-eval';");
  next();
});



app.get('/api/wallet/:address', async (req, res) => {
  console.log('Received request for wallet:', req.params.address);  // ここでリクエストの確認

  const address = req.params.address;
  const BigNumber = require('bignumber.js');

  try {
    const balances = await Promise.all(chains.map(async (chain, index) => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3秒間遅延
      try {
        const balance = await chain.web3.eth.getBalance(address);
        return new BigNumber(balance).dividedBy(new BigNumber('1000000000000000000')).toNumber();
      } catch (error) {
        console.error(`エラーが発生しました: ${chain.name}`, error);
        return 0; // エラーの場合は0を返す
      }
    }));

    const balanceInEth = balances;

    const chartData = {
      datasets: chains.map((chain, index) => ({
        label: chain.name,
        data: [balanceInEth[index], balanceInEth[index] * 2, balanceInEth[index] * 3], 
      }))
    };

    res.json(chartData);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).json({ error: 'データの取得に失敗しました' });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

