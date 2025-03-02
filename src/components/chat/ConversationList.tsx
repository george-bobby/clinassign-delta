
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Conversation, Profile } from '@/lib/types';
import { fetchConversationParticipants } from '@/lib/chat-utils';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation
}) => {
  const { user } = useAuth();
  const [conversationsWithParticipants, setConversationsWithParticipants] = useState<Conversation[]>([]);

  useEffect(() => {
    const loadParticipants = async () => {
      const updatedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          const participants = await fetchConversationParticipants(conversation.id);
          return {
            ...conversation,
            participants: participants.map(p => ({ 
              id: '', 
              conversation_id: conversation.id, 
              user_id: p.id, 
              user: p 
            }))
          };
        })
      );
      setConversationsWithParticipants(updatedConversations);
    };

    loadParticipants();
  }, [conversations]);

  const getConversationName = (conversation: Conversation): string => {
    if (conversation.name) return conversation.name;
    
    // If no name, use the name of the other participant
    const otherParticipants = conversation.participants?.filter(
      p => p.user_id !== user?.id
    ) || [];
    
    if (otherParticipants.length === 1) {
      return otherParticipants[0].user?.name || 'Unknown User';
    } else if (otherParticipants.length > 1) {
      return `${otherParticipants[0].user?.name || 'Unknown'} and ${otherParticipants.length - 1} others`;
    }
    
    return 'Unnamed Conversation';
  };

  const getAvatarInfo = (conversation: Conversation): { image: string | null; initials: string } => {
    const otherParticipants = conversation.participants?.filter(
      p => p.user_id !== user?.id
    ) || [];
    
    if (otherParticipants.length === 1) {
      const participant = otherParticipants[0].user;
      return {
        image: participant?.avatar_url || null,
        initials: participant?.name
          ? participant.name.split(' ').map(n => n[0]).join('')
          : '??'
      };
    }
    
    // For group chats, use the first two participants' initials
    return {
      image: null,
      initials: conversation.name 
        ? conversation.name.split(' ').map(n => n[0]).join('').substring(0, 2)
        : 'GC'
    };
  };

  const getFormattedTime = (timestamp: string | undefined): string => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  return (
    <Card className="w-full h-full overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-y-auto h-[calc(100vh-200px)]">
          {conversationsWithParticipants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {conversationsWithParticipants.map((conversation) => {
                const isSelected = selectedConversationId === conversation.id;
                const avatarInfo = getAvatarInfo(conversation);
                
                return (
                  <Button
                    key={conversation.id}
                    variant={isSelected ? "secondary" : "ghost"}
                    className={`w-full justify-start rounded-none px-4 py-3 h-auto ${
                      isSelected ? 'bg-secondary' : ''
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    <div className="flex items-start w-full gap-3">
                      <Avatar className="h-10 w-10 mt-1">
                        {avatarInfo.image ? (
                          <AvatarImage src={avatarInfo.image} />
                        ) : null}
                        <AvatarFallback>
                          {avatarInfo.initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-start w-full">
                          <span className="font-medium truncate">
                            {getConversationName(conversation)}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getFormattedTime(conversation.last_message_time)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center w-full mt-1">
                          <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                            {conversation.last_message || 'No messages yet'}
                          </span>
                          
                          {conversation.unread_count ? (
                            <Badge variant="default" className="ml-2">
                              {conversation.unread_count}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
