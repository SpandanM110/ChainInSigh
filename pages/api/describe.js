// pages/api/describe.js
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'PchNZiNnPKhSbwUmWm'; // Your API key for the Foresight API

export default async function handler(req, res) {
  const { chain, transaction } = req.body;

  if (!chain || !transaction) {
    return res.status(400).json({ error: 'Chain and transaction are required' });
  }

  try {
    // Call Foresight API to get a description of the transaction
    const foresightResponse = await axios.post(`https://foresight.noves.fi/evm/${chain}/describe`, {
      transaction,
    }, {
      headers: {
        apiKey: apiKey,
      },
    });

    const descriptionData = foresightResponse.data;

    // Initialize Gemini AI for generating explanatory text
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const generationConfig = {
      temperature: 0.5,
      topP: 0.95,
      maxOutputTokens: 512,
      responseMimeType: "text/plain",
    };

    // Generate the descriptive text
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Create the input prompt for Gemini based on the transaction description
    const prompt = `
      You are a financial advisor. Explain the following transaction in simple terms:
      From: ${descriptionData.from}
      To: ${descriptionData.to}
      Value: ${descriptionData.value} Wei
      Gas: ${descriptionData.gas}
      Gas Price: ${descriptionData.gasPrice} Wei
      The action that will take place: ${descriptionData.description}
    `;

    const result = await chatSession.sendMessage(prompt);
    
    return res.status(200).json({ output: result.response.text() });
  } catch (error) {
    console.error('Error fetching transaction description:', error);
    return res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
