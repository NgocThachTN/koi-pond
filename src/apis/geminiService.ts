import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyCJdZwLcg8p4KgKD2oCPZ8x_iVt-n2axLs';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const generateResponse = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }))
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, I encountered an error. Please try again later.';
  }
};
