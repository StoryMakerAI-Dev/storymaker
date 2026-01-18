import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { streamChat } from '@/utils/chatStream';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import ModelSelector from '@/components/chat/ModelSelector';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@clerk/clerk-react';

type Message = { role: 'user' | 'assistant'; content: string };

const ChatAssistant: React.FC = () => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your creative writing assistant. I'm here to help you brainstorm story ideas, develop characters, overcome writer's block, or provide feedback on your plots. What would you like to work on today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.5-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = '';
    const upsertAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: 'assistant', content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        model: selectedModel,
        userId: userId || undefined,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (error) => {
          console.error('Chat error:', error);
          toast({
            title: "Error",
            description: error.message || "Failed to get response. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-storyforge-accent to-storyforge-purple rounded-xl">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold gradient-text">AI Writing Assistant</h1>
            </div>
            <p className="text-gray-600 mb-4">Brainstorm ideas, get writing tips, and overcome writer's block</p>
            
            <div className="flex justify-center">
              <ModelSelector 
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="glass-card rounded-2xl shadow-xl p-6 flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} content={msg.content} />
              ))}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-storyforge-accent to-storyforge-purple">
                    <Sparkles className="h-5 w-5 text-white animate-pulse" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput onSend={handleSend} disabled={isLoading} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatAssistant;
