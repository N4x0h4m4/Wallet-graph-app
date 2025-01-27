const express = require('express');
const { Web3 } = require('web3');
const BigNumber = require('bignumber.js');
const cors = require('cors'); // フロントエンドとの連携に必要

const app = express();
const port = 3001;

// CORS設定
app.use(cors());

// チェーン情報の設定
const chains = [
  { name: 'Sepolia ETH', web3: new Web3('https://sepolia.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'ETH', web3: new Web3('https://mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Liena', web3: new Web3('https://linea-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Polygon', web3: new Web3('https://polygon-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Base', web3: new Web3('https://base-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Optimism', web3: new Web3('https://optimism-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Arbitrum', web3: new Web3('https://arbitrum-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
];

// APIエンドポイント `/api/wallet/:address`
app.get('/api/wallet/:address', async (req, res) => {
  const address = req.params.address;

  // アドレスの簡易検証
  if (!address || address.length !== 42 || !address.startsWith('0x')) {
    return res.status(400).json({ error: '有効なウォレットアドレスを指定してください。' });
  }

  try {
    // 各チェーンの残高を取得
    const balances = await Promise.all(
      chains.map(async (chain) => {
        try {
          const balance = await chain.web3.eth.getBalance(address);
          return new BigNumber(balance).dividedBy(new BigNumber('1000000000000000000')).toNumber();
        } catch (error) {
          console.error(`エラー (${chain.name}):`, error.message);
          return 0; // エラーの場合は0を返す
        }
      })
    );

    // チャートデータを構築
    const chartData = {
      datasets: chains.map((chain, index) => ({
        label: chain.name,
        data: [balances[index]], // チャート用データ（残高）
      })),
    };

    // データをレスポンスとして返す
    res.status(200).json(chartData);
  } catch (error) {
    console.error('サーバーエラー:', error.message);
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' });
  }
});

// サーバー起動
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
