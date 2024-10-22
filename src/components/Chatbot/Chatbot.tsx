import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Card, CardBody, CardHeader, Avatar, Tooltip } from "@nextui-org/react";
import { generateResponse } from '@/apis/geminiService';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; isThinking?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);

  const toggleChatbot = () => {
    if (!isOpen && messages.length === 0) {
      // Add initial greeting when opening for the first time
      setMessages([{ text: "Hello! How can I help you?", isUser: false }]);
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isThinking) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsThinking(true);

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: input }
    ];

    try {
      setMessages(prevMessages => [...prevMessages, { text: '...', isUser: false, isThinking: true }]);
      const response = await generateResponse(updatedHistory);
      setMessages(prevMessages => prevMessages.slice(0, -1));
      const botMessage = { text: response, isUser: false };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setConversationHistory([
        ...updatedHistory,
        { role: 'model', content: response }
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev.slice(0, -1), { text: "Sorry, I couldn't process your request. Please try again.", isUser: false }]);
    } finally {
      setIsThinking(false);
    }
  };

  const formatMessage = (text: string) => {
    // Remove leading/trailing asterisks and newlines
    return text.replace(/^\*+|\*+$/g, '').trim();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatbotRef}>
      <Tooltip content="Hello! How can I help you?" placement="left">
        <Button
          isIconOnly
          color="secondary"
          variant="shadow"
          aria-label="Open Koi Pond Assistant"
          className="rounded-full w-16 h-16 bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors"
          onClick={toggleChatbot}
        >
          <KoiChatbotIcon />
        </Button>
      </Tooltip>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-20 right-0 w-[400px]"
        >
          <Card className="h-[500px] flex flex-col bg-white dark:bg-gray-900 shadow-xl">
            <CardHeader className="flex gap-3 p-4 bg-white dark:bg-gray-900">
              <Avatar
                icon={<KoiChatbotIcon />}
                className="bg-purple-600 text-white"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Koi Pond Assistant</p>
              </div>
            </CardHeader>
            <div className="flex-grow overflow-y-auto scrollbar-hide">
              <CardBody className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-3`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl ${
                      message.isUser 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'
                    }`}>
                      {message.isUser ? (
                        message.text
                      ) : message.isThinking ? (
                        <div className="flex space-x-1 items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                      ) : (
                        <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                          {message.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardBody>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-900">
              <Input
                fullWidth
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
              />
              <Button
                isIconOnly
                color="secondary"
                variant="flat"
                onPress={handleSendMessage}
                isDisabled={isThinking}
                className="rounded-full w-10 h-10 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <SendIcon />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

const KoiChatbotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
    <path d="M12 6C9.79 6 8 7.79 8 10C8 11.2 8.54 12.27 9.38 13L12 16L14.62 13C15.46 12.27 16 11.2 16 10C16 7.79 14.21 6 12 6ZM12 11C11.45 11 11 10.55 11 10C11 9.45 11.45 9 12 9C12.55 9 13 9.45 13 10C13 10.55 12.55 11 12 11Z" fill="currentColor"/>
    <path d="M12 17C10.69 17 9.58 17.81 9.17 18.95C10.01 19.63 10.97 20 12 20C13.03 20 13.99 19.63 14.83 18.95C14.42 17.81 13.31 17 12 17Z" fill="currentColor"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.4 20.4L20.85 12.92C21.66 12.57 21.66 11.43 20.85 11.08L3.4 3.6C2.74 3.31 2.01 3.8 2.01 4.51L2 9.12C2 9.62 2.37 10.05 2.87 10.11L17 12L2.87 13.88C2.37 13.95 2 14.38 2 14.88L2.01 19.49C2.01 20.2 2.74 20.69 3.4 20.4Z" fill="currentColor"/>
  </svg>
);

export default Chatbot;
