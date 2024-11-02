// pages/api/generate.js
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY; // Ensure this is set correctly
const baseOdosApiUrl = "https://api.odos.xyz"; // Base URL for Odos API

export default async function handler(req, res) {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    let responseData;

    // Token Price Inquiries
    if (input.toLowerCase().includes("current price of ethereum") ||
        input.toLowerCase().includes("price of wbtc") ||
        input.toLowerCase().includes("how much is dai")) {
      const chainId = 1; // Example chain ID for Ethereum
      responseData = await axios.get(`${baseOdosApiUrl}/pricing/token/${chainId}`);
      const pricesData = responseData.data.tokenPrices;

      const ethPrice = pricesData['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee']; // Ethereum price
      const wbtcPrice = pricesData['0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599']; // WBTC price
      const daiPrice = pricesData['0x6B175474E89094C44Da98b954EedeAC495271d0F']; // DAI price

      return res.status(200).json({
        output: `Current Prices:\n- Ethereum: $${ethPrice}\n- WBTC: $${wbtcPrice}\n- DAI: $${daiPrice}`
      });

    // Available Currencies
    } else if (input.toLowerCase().includes("currencies odos supports") ||
               input.toLowerCase().includes("list all available currencies") ||
               input.toLowerCase().includes("fiat currencies")) {
      responseData = await axios.get(`${baseOdosApiUrl}/pricing/currencies`);
      const currenciesData = responseData.data.currencies;
      const currencyList = currenciesData.map(currency => currency.name).join(', ');
      return res.status(200).json({ output: `Odos supports the following currencies: ${currencyList}.` });

    // Supported Blockchains
    } else if (input.toLowerCase().includes("which blockchains") ||
               input.toLowerCase().includes("supported chains") ||
               input.toLowerCase().includes("current blockchains")) {
      responseData = await axios.get(`${baseOdosApiUrl}/info/chains`);
      const chainsData = responseData.data.chains;
      return res.status(200).json({ output: `Odos supports the following blockchains: ${chainsData.join(', ')}.` });

    // Liquidity Sources
    } else if (input.toLowerCase().includes("liquidity sources") ||
               input.toLowerCase().includes("supported liquidity providers") ||
               input.toLowerCase().includes("dexs integrated")) {
      const chainId = 1; // Example chain ID for Ethereum
      responseData = await axios.get(`${baseOdosApiUrl}/info/liquidity-sources/${chainId}`);
      const sourcesData = responseData.data.sources;
      return res.status(200).json({ output: `Odos uses the following liquidity sources: ${sourcesData.join(', ')}.` });

    // General Queries about Odos
    } else if (input.toLowerCase().includes("what is odos") ||
               input.toLowerCase().includes("how does it work") ||
               input.toLowerCase().includes("smart order routing benefits")) {
      return res.status(200).json({
        output: `Odos is a decentralized protocol that facilitates smart order routing for token swaps, ensuring users get the best prices by aggregating liquidity across multiple sources.`
      });

    // Trading and Swap Mechanics
    } else if (input.toLowerCase().includes("factors affect the price of token swaps") ||
               input.toLowerCase().includes("how does slippage impact my trades") ||
               input.toLowerCase().includes("gas fee structure")) {
      return res.status(200).json({
        output: `Factors that affect token swap prices include:\n
        - Market liquidity\n
        - Trading volume\n
        - Slippage\n
        - Gas fees\n
        - Token supply and demand\n
        - Price impact due to trade size.`
      });

    // Market Trends and Insights
    } else if (input.toLowerCase().includes("current trends in the defi space") ||
               input.toLowerCase().includes("analyze token price movements") ||
               input.toLowerCase().includes("consider when swapping tokens")) {
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(input);
      return res.status(200).json({ output: result.response.text() });

    // Using Gemini AI for Insights
    } else if (input.toLowerCase().includes("summary of the current defi market") ||
               input.toLowerCase().includes("implications of the latest crypto regulations") ||
               input.toLowerCase().includes("insights on the most traded tokens")) {
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(input);
      return res.status(200).json({ output: result.response.text() });

    } else {
      // If no specific handling matches, fall back to Gemini AI
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(input);
      return res.status(200).json({ output: result.response.text() });
    }

  } catch (error) {
    console.error('Error with Odos API or Gemini AI:', error); // Log the error for debugging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('Request data:', error.request);
      res.status(500).json({ error: 'No response received from the Odos API.' });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  }
}
