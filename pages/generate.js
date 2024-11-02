// pages/generate.js
import { useState } from 'react';
import axios from 'axios';

const Generate = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = async () => {
    try {
      const response = await axios.post('/api/generate', { input });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error generating output:', error);
      setOutput('An error occurred while generating the output.');
    }
  };

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">
        Integration of Odos and Gemini
        </h1>
      <h1 className="text-2xl mb-4">
      We’ve developed an application that combines Odos, a decentralized protocol for efficient token swaps, with Gemini, an AI-driven service for market insights.
Key Features:
Token Prices: Query current prices of tokens like Ethereum and WBTC.
Available Currencies: Get information on supported currencies.
Supported Blockchains: Learn about the blockchains Odos operates on.
Liquidity Sources: Discover integrated liquidity providers.
Market Insights: Gain insights into trading mechanics and trends using AI responses.
This integration enables users to make informed trading decisions by accessing real-time data and intelligent analysis.
        
      </h1>
      <br/>
      <textarea
        className="border p-2 w-full"
        rows="4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your query here..."
      />
      <button
        className="bg-blue-500 text-white p-2 mt-2"
        onClick={handleGenerate}
      >
        Generate
      </button>
      {output && (
        <div className="mt-4 p-4 border">
          <h2 className="text-xl">Output:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
};

export default Generate;
