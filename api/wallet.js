import Web3 from 'web3';
import BigNumber from 'bignumber.js';

const chains = [
  { name: 'Sepolia ETH', web3: new Web3('https://sepolia.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'ETH', web3: new Web3('https://mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Liena', web3: new Web3('https://linea-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Polygon', web3: new Web3('https://polygon-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Base', web3: new Web3('https://base-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Optimism', web3: new Web3('https://optimism-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
  { name: 'Arbitrum', web3: new Web3('https://arbitrum-mainnet.infura.io/v3/a05f0e1b0abc448081f91e1ffda53fc4') },
];

export default async function handler(req, res) {
  const { address } = req.query;

  if (!address || address.length !== 42 || !address.startsWith('0x')) {
    return res.status(400).json({ error: '有効なウォレットアドレスを指定してください。' });
  }

  try {
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

    const chartData = {
      datasets: chains.map((chain, index) => ({
        label: chain.name,
        data: [balances[index]], // チャート用データ（残高）
      })),
    };

    res.status(200).json(chartData);
  } catch (error) {
    console.error('サーバーエラー:', error.message);
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' });
  }
}
