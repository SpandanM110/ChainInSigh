// pages/NovesAPI.js
import { useState } from 'react';
import axios from 'axios';

const NovesAPI = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/generate2', { input });
      setOutput(response.data.output);
    } catch (err) {
      console.error('Error generating output:', err);
      setError('An error occurred while generating the output.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Noves API Integration</h1>
      <h6>The Noves API offers tools for accessing detailed Ethereum transaction data, including transaction 
        previews and descriptions of actions taken. By integrating with Gemini, 
        a generative AI model, this setup translates complex blockchain information into clear, understandable language. 
        Users can input transaction parameters and receive comprehensive insights into their implications, 
        making blockchain interactions more accessible and user-friendly. 
        This integration simplifies the understanding of Ethereum transactions for both novice and experienced users.</h6>
        <br/>
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
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {output && (
        <div className="mt-4 p-4 border">
          <h2 className="text-xl">Output:</h2>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default NovesAPI;
