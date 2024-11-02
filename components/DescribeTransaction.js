// components/DescribeTransaction.js
import { useState } from 'react';
import axios from 'axios';

const DescribeTransaction = () => {
  const [chain, setChain] = useState('eth');
  const [transaction, setTransaction] = useState({
    from: '',
    to: '',
    data: '',
    value: '',
    gas: '',
    gasPrice: '',
    maxFeePerGas: '',
    maxPriorityFeePerGas: '',
    type: '',
  });
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = 'PchNZiNnPKhSbwUmWm'; // Your Foresight API key

  const fetchDescription = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`https://foresight.noves.fi/evm/${chain}/describe`, {
        transaction,
      }, {
        headers: {
          apiKey: apiKey,
        },
      });
      setDescription(response.data);
    } catch (err) {
      setError('Failed to describe the transaction. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Describe Transaction</h1>
      <select
        value={chain}
        onChange={(e) => setChain(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="eth">Ethereum</option>
        {/* Add more chains as needed based on the /chains endpoint */}
      </select>
      <h2 className="text-xl mb-2">Transaction Object</h2>
      {Object.keys(transaction).map((key) => (
        <div key={key} className="mb-2">
          <label className="block">
            {key.charAt(0).toUpperCase() + key.slice(1)}:
            <input
              type="text"
              value={transaction[key]}
              onChange={(e) => setTransaction({ ...transaction, [key]: e.target.value })}
              className="border p-2 w-full"
            />
          </label>
        </div>
      ))}
      <button onClick={fetchDescription} className="bg-blue-500 text-white p-2 mt-2">
        Describe Transaction
      </button>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {description && (
        <div className="mt-4">
          <h2 className="text-xl">Description:</h2>
          <pre>{JSON.stringify(description, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DescribeTransaction;
