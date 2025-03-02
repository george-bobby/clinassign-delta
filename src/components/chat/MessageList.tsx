
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Profile } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  participants: Profile[];
}

const MessageList: React.FC<MessageListProps> = ({ messages, participants }) => {
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);
  
  const getParticipantName = (participantId: string): string => {
    const participant = participants.find(p => p.id === participantId);
    return participant?.name || 'Unknown User';
  };
  
  const getParticipantAvatar = (participantId: string): string | null => {
    const participant = participants.find(p => p.id === participantId);
    return participant?.avatar_url || null;
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2);
  };
  
  return (
    <ScrollArea 
      ref={scrollAreaRef} 
      className="h-[calc(100vh-320px)] p-4"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.sender_id === user?.id;
            const senderName = message.sender?.name || getParticipantName(message.sender_id);
            const senderAvatar = message.sender?.avatar_url || getParticipantAvatar(message.sender_id);
            const messageDate = new Date(message.timestamp);
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    {senderAvatar ? (
                      <AvatarImage src={senderAvatar} />
                    ) : null}
                    <AvatarFallback>
                      {getInitials(senderName)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="text-xs font-medium mb-1">
                      {senderName}
                    </div>
                  )}
                  
                  <div className="break-words">
                    {message.message_text}
                  </div>
                  
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {format(messageDate, 'h:mm a')}
                  </div>
                </div>
                
                {isCurrentUser && (
                  <Avatar className="h-8 w-8 ml-2 mt-1">
                    {user?.avatar_url ? (
                      <AvatarImage src={user.avatar_url} />
                    ) : null}
                    <AvatarFallback>
                      {getInitials(user?.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageList;
