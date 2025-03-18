
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Conversation, 
  Message,
  Profile 
} from '@/lib/types';
import ConversationList from '@/components/chat/ConversationList';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import NewConversationDialog from '@/components/chat/NewConversationDialog';
import { 
  fetchUserConversations, 
  fetchConversationMessages,
  fetchConversationParticipants,
  sendMessage,
  createConversation,
  markMessagesAsRead
} from '@/lib/chat-utils';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const userConversations = await fetchUserConversations();
        setConversations(userConversations);
        
        // Select the first conversation by default if available
        if (userConversations.length > 0 && !selectedConversation) {
          handleSelectConversation(userConversations[0]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load conversations',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, handleNewMessage)
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    try {
      // Load messages for the selected conversation
      const conversationMessages = await fetchConversationMessages(conversation.id);
      setMessages(conversationMessages);
      
      // Load participants
      const conversationParticipants = await fetchConversationParticipants(conversation.id);
      setParticipants(conversationParticipants);
      
      // Mark messages as read
      await markMessagesAsRead(conversation.id);
      
      // Update the unread count for this conversation
      setConversations(prev => 
        prev.map(c => 
          c.id === conversation.id 
            ? { ...c, unread_count: 0 } 
            : c
        )
      );
    } catch (error) {
      console.error('Error loading conversation data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation data',
        variant: 'destructive'
      });
    }
  };
  
  const handleNewMessage = (payload: any) => {
    // Handle new message from subscription
    const newMessage = payload.new as Message;
    
    // If the message belongs to the currently selected conversation, add it to the messages
    if (selectedConversation && newMessage.conversation_id === selectedConversation.id) {
      setMessages(prev => [...prev, newMessage]);
      
      // Mark as read if from someone else
      if (newMessage.sender_id !== user?.id) {
        markMessagesAsRead(selectedConversation.id);
      }
    }
    
    // Update the last message in conversations list
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === newMessage.conversation_id) {
          const isFromCurrentUser = newMessage.sender_id === user?.id;
          const unreadIncrement = isFromCurrentUser ? 0 : 1;
          
          return {
            ...conv,
            last_message: newMessage.message_text,
            last_message_time: newMessage.timestamp,
            unread_count: (conv.unread_count || 0) + unreadIncrement
          };
        }
        return conv;
      })
    );
  };
  
  const handleSendMessage = async (text: string, attachments?: any) => {
    if (!selectedConversation || !user) return;
    
    setIsSending(true);
    try {
      const result = await sendMessage(
        selectedConversation.id,
        text,
        attachments
      );
      
      if (!result) {
        throw new Error('Failed to send message');
      }
      
      // Add the new message to the messages list
      setMessages(prev => [...prev, result]);
      
      // Update the last message in conversations list
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              last_message: text,
              last_message_time: result.timestamp
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleCreateConversation = async (name: string, participantIds: string[]) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const newConversation = await createConversation(name, participantIds);
      
      if (!newConversation) {
        throw new Error('Failed to create conversation');
      }
      
      // Add the new conversation to the list and select it
      const updatedConversation = {
        ...newConversation,
        participants: participantIds.map(id => ({
          id: '',
          conversation_id: newConversation.id,
          user_id: id
        }))
      };
      
      setConversations(prev => [updatedConversation, ...prev]);
      handleSelectConversation(updatedConversation);
      
      toast({
        title: 'Success',
        description: 'Conversation created successfully',
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getRoleSpecificTitle = () => {
    if (!user) return "Chat";
    
    switch (user.role) {
      case 'student':
        return "Chat with Tutors";
      case 'tutor':
        return "Chat with Students";
      default:
        return "Chat";
    }
  };
  
  const getRoleSpecificDescription = () => {
    if (!user) return "";
    
    switch (user.role) {
      case 'student':
        return "Connect with your tutors for questions and guidance";
      case 'tutor':
        return "Connect with your students to provide guidance and answer questions";
      default:
        return "Connect with other users";
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">{getRoleSpecificTitle()}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Chat list sidebar */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setIsNewConversationOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <ConversationList
                    conversations={conversations}
                    selectedConversationId={selectedConversation?.id || null}
                    onSelectConversation={handleSelectConversation}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Chat messages and input */}
          <div className="md:col-span-3">
            <Card className="h-full">
              <CardHeader className="p-4">
                <CardTitle className="text-lg truncate">
                  {selectedConversation ? (
                    selectedConversation.name || 'Conversation'
                  ) : (
                    'Select or create a conversation'
                  )}
                </CardTitle>
                {selectedConversation && (
                  <CardDescription>
                    {user?.role === 'student' ? 'Conversation with tutor' : 'Conversation with student'}
                  </CardDescription>
                )}
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : selectedConversation ? (
                  <>
                    <MessageList 
                      messages={messages} 
                      participants={participants}
                    />
                    <MessageInput 
                      onSendMessage={handleSendMessage}
                      conversationId={selectedConversation?.id || null}
                      disabled={isSending}
                    />
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center h-[400px] p-4 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 max-w-md">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                        <div>
                          <h3 className="font-medium text-blue-600 dark:text-blue-400">
                            {user?.role === 'student' 
                              ? "Connect with Your Tutors" 
                              : user?.role === 'tutor'
                                ? "Connect with Your Students"
                                : "Start a Conversation"}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {user?.role === 'student' 
                              ? "Use this chat to ask questions, schedule additional consultations, or get feedback on your clinical work."
                              : user?.role === 'tutor'
                                ? "Use this chat to provide guidance, answer questions, and give feedback to your students."
                                : "Select an existing conversation or create a new one to start chatting."}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setIsNewConversationOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Conversation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <NewConversationDialog
        isOpen={isNewConversationOpen}
        onClose={() => setIsNewConversationOpen(false)}
        onCreateConversation={handleCreateConversation}
      />
    </Layout>
  );
};

export default ChatPage;
