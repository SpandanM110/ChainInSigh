// pages/api/generate2.js
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = 'PchNZiNnPKhSbwUmWm'; // Your Translate API key
const novesApiBaseUrl = 'https://translate.noves.fi/evm'; // Base URL for Noves API

export default async function handler(req, res) {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let output;

    // Fetch transaction data
    if (input.toLowerCase().includes("transaction data for")) {
      const txHash = input.split(" ").pop(); // Extract txHash from input
      const response = await axios.get(`${novesApiBaseUrl}/eth/tx/${txHash}`, {
        headers: { apiKey },
      });

      const transactionData = response.data;

      output = `### Transaction Summary for ${txHash}\n\n` +
               `- **Transaction Hash**: ${transactionData.rawTransactionData.transactionHash}\n` +
               `- **From Address**: ${transactionData.rawTransactionData.fromAddress}\n` +
               `- **To Address**: ${transactionData.rawTransactionData.toAddress}\n` +
               `- **Block Number**: ${transactionData.rawTransactionData.blockNumber}\n` +
               `- **Gas Used**: ${transactionData.rawTransactionData.gasUsed}\n` +
               `- **Transaction Fee**: ${transactionData.rawTransactionData.transactionFee.amount} ${transactionData.rawTransactionData.transactionFee.token.symbol}\n` +
               `- **Timestamp**: ${new Date(transactionData.rawTransactionData.timestamp * 1000).toLocaleString()}\n\n` +
               `### Transaction Type: ${transactionData.classificationData.type}\n` +
               `**Description**: ${transactionData.classificationData.description}\n\n` +
               `### Actions Sent:\n` +
               transactionData.classificationData.sent.map(action => 
                 `- **Sent**: ${action.amount} ${action.token.symbol} from ${action.from.name} to ${action.to.name}\n`
               ).join('') +
               `\n### Actions Received:\n` +
               transactionData.classificationData.received.map(action => 
                 `- **Received**: ${action.amount} ${action.token.symbol} from ${action.from.name} to ${action.to.name}\n`
               ).join('');

    // Fetch token balances
    } else if (input.toLowerCase().includes("token balances for")) {
      const accountAddress = input.split(" ").pop(); // Extract accountAddress from input
      const response = await axios.post(`${novesApiBaseUrl}/eth/tokens/balancesOf/${accountAddress}`, {
        tokens: ['0xc18360217d8f7ab5e7c516566761ea12ce7f9d72', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'], // Example token addresses
      }, {
        headers: { apiKey },
      });

      const balancesData = response.data;
      output = `### Token Balances for Address: ${accountAddress}\n` +
               balancesData.map(token => `- **Token**: ${token.tokenSymbol}\n  - **Balance**: ${token.balance}\n`).join('');

    // Use Gemini AI for detailed insights on transactions
    } else {
      const chatSession = model.startChat({
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 512,
          responseMimeType: "text/plain",
        },
        history: [],
      });
      const result = await chatSession.sendMessage(input);
      output = `### Insights from Gemini AI:\n${result.response.text()}`;
    }

    return res.status(200).json({ output });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
