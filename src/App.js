import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Skeleton from 'react-loading-skeleton';

const App = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch('/api/wallet/0x1234567890abcdef1234567890abcdef12345678')
      .then(response => response.json())
      .then(data => {
        const newData = data.datasets.map(dataset => ({
          name: dataset.label,
          value: dataset.data[0],  // データを変更する場合は適宜調整
        }));
        setChartData(newData);
      })
      .catch(error => {
        console.error('データの取得に失敗しました:', error);
      });
  }, []);

  const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'
  ];

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Wallet Balances</h1>
      {isLoading ? (
        <Skeleton height={400} />
      ) : chartData.length > 0 ? (
        <PieChart width={400} height={400}>
          {/* ... */}
        </PieChart>
      ) : (
        <p>データがありません。</p>
      )}
    </div>
  );
};

export default App;
