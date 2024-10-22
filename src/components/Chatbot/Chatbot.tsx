import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Avatar } from '@nextui-org/avatar';
import { Tooltip } from '@nextui-org/tooltip';
import { generateResponse } from '@/apis/geminiService';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    setMessages([...messages, { text: input, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { text: "Sorry, I couldn't process your request. Please try again.", isUser: false }]);
    } finally {
      setIsLoading(false);
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
      <Tooltip content="Chat with Koi Pond Assistant" placement="left">
        <Button
          isIconOnly
          color="primary"
          variant="shadow"
          aria-label="Open Koi Pond Assistant"
          className="rounded-full w-14 h-14"
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
          className="absolute bottom-16 right-0 w-96"
        >
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="flex gap-3">
              <Avatar
                icon={<KoiChatbotIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#3B82F6] to-[#2563EB]",
                  icon: "text-white/90",
                }}
              />
              <div className="flex flex-col">
                <p className="text-md">Koi Pond Assistant</p>
                <p className="text-small text-default-500">How can I help you?</p>
              </div>
            </CardHeader>
            <CardBody className="flex-grow overflow-y-auto px-2">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`max-w-[70%] p-2 rounded-lg ${message.isUser ? 'bg-primary text-white' : 'bg-default-100'}`}>
                    {message.isUser ? (
                      message.text
                    ) : (
                      <ReactMarkdown className="prose prose-sm max-w-none">
                        {formatMessage(message.text)}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardBody>
            <div className="p-4 border-t">
              <Input
                fullWidth
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                endContent={
                  <Button
                    isIconOnly
                    color="primary"
                    variant="flat"
                    onPress={handleSendMessage}
                    isLoading={isLoading}
                  >
                    {!isLoading && <SendIcon />}
                  </Button>
                }
              />
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
    <path d="M13.54 8.97C13.9 9.33 14.1 9.81 14.1 10.3C14.1 10.79 13.9 11.27 13.54 11.63L12 13.17L10.46 11.63C10.1 11.27 9.9 10.79 9.9 10.3C9.9 9.81 10.1 9.33 10.46 8.97C11.2 8.23 12.8 8.23 13.54 8.97Z" fill="currentColor"/>
    <path d="M14.83 14.63C14.37 15.05 13.71 15.27 13 15.27C12.29 15.27 11.63 15.05 11.17 14.63C10.71 14.21 10.45 13.64 10.45 13.03C10.45 12.42 10.71 11.85 11.17 11.43C11.63 11.01 12.29 10.79 13 10.79C13.71 10.79 14.37 11.01 14.83 11.43C15.29 11.85 15.55 12.42 15.55 13.03C15.55 13.64 15.29 14.21 14.83 14.63Z" fill="currentColor"/>
  </svg>
);

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
  </svg>
);

export default Chatbot;
