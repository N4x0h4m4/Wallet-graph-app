import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Skeleton from 'react-loading-skeleton';

const App = () => {
  const [walletAddress, setWalletAddress] = useState(''); // 入力されたウォレットアドレス
  const [chartData, setChartData] = useState([]); // チャートデータ
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const [error, setError] = useState(''); // エラーメッセージ

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  // 入力変更ハンドラー
  const handleInputChange = (e) => setWalletAddress(e.target.value);

  // データ取得関数
  const fetchWalletData = async () => {
    if (!walletAddress || walletAddress.length !== 42 || !walletAddress.startsWith('0x')) {
      setError('有効なウォレットアドレスを入力してください。');
      setChartData([]);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      //const response = await fetch(`http://localhost:3001/api/wallet/${walletAddress}`);//ローカル用
      const response = await fetch(`/api/wallet?address=${walletAddress}`);//デプロイ用

      if (!response.ok) {
        throw new Error('データ取得に失敗しました。');
      }

      const data = await response.json();
      const newData = data.datasets.map(dataset => ({
        name: dataset.label,
        value: dataset.data[0],
      }));

      if (newData.length === 0) {
        setError('データがありません。');
      }
      setChartData(newData);
    } catch (error) {
      console.error('エラー:', error.message);
      setError('サーバーエラーが発生しました。');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Wallet Balances</h1>
      <input
        type="text"
        placeholder="ウォレットアドレスを入力"
        value={walletAddress}
        onChange={handleInputChange}
        style={{
          width: '300px',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '16px',
        }}
      />
      <button
        onClick={fetchWalletData}
        style={{
          padding: '10px 20px',
          backgroundColor: '#36A2EB',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        チャートを表示
      </button>

      {isLoading ? (
        <Skeleton height={400} />
      ) : error ? (
        <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>
      ) : chartData.length > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p style={{ color: 'red', marginTop: '20px' }}>ウォレットアドレスのデータがありません。</p>
      )}
    </div>
  );
};

export default App;
