import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4 animate-fade-in`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-storyforge-blue to-storyforge-purple' 
          : 'bg-gradient-to-br from-storyforge-accent to-storyforge-purple'
      }`}>
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-br from-storyforge-blue to-storyforge-purple text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
