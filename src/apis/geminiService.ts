import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyA97oZAQXbrmm_RluotaZnHM23dRBtdljg';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateResponse = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: messages[messages.length - 1].content }]
        }]
      }
    );
    
    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, I encountered an error. Please try again later.';
  }
};
