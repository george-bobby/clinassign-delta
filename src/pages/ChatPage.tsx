
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare } from 'lucide-react';

// Mock chat data
const mockChats = [
  {
    id: '1',
    sender: 'Jane Smith',
    senderRole: 'Tutor',
    content: 'Hello students! How is your clinical rotation going today?',
    timestamp: '10:30 AM',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    sender: 'John Doe',
    senderRole: 'Student',
    content: 'Pretty well! I\'m learning a lot about patient assessment.',
    timestamp: '10:32 AM',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    sender: 'Sarah Johnson',
    senderRole: 'Student',
    content: 'I have a question about the documentation process for medication administration.',
    timestamp: '10:34 AM',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    sender: 'Jane Smith',
    senderRole: 'Tutor',
    content: 'Great question, Sarah. Always remember to follow the five rights of medication administration. Let\'s discuss this in more detail.',
    timestamp: '10:36 AM',
    avatar: '/placeholder.svg'
  }
];

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState(mockChats);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: (chats.length + 1).toString(),
      sender: user?.name || 'Current User',
      senderRole: user?.role?.replace('_', ' ') || 'User',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '/placeholder.svg'
    };
    
    setChats([...chats, newMessage]);
    setMessage('');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Chat</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Chat list sidebar */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 px-3 pb-3">
                <Button variant="ghost" className="w-full justify-start font-normal h-auto py-2">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>GC</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">General Chat</p>
                      <p className="text-xs text-muted-foreground">All department members</p>
                    </div>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal h-auto py-2">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">Jane Smith</p>
                      <p className="text-xs text-muted-foreground">Tutor</p>
                    </div>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal h-auto py-2">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>TG</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">Tutors Group</p>
                      <p className="text-xs text-muted-foreground">6 members</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Chat messages and input */}
          <Card className="md:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">General Chat</CardTitle>
              <p className="text-xs text-muted-foreground">All department members</p>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {chats.map((chat) => (
                    <div 
                      key={chat.id} 
                      className={`flex ${chat.sender === (user?.name || 'Current User') ? 'justify-end' : 'justify-start'}`}
                    >
                      {chat.sender !== (user?.name || 'Current User') && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback>{chat.sender.split(' ').map(name => name[0]).join('')}</AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          chat.sender === (user?.name || 'Current User') 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{chat.sender}</span>
                          <span className="text-xs opacity-70">{chat.timestamp}</span>
                        </div>
                        <p>{chat.content}</p>
                      </div>
                      {chat.sender === (user?.name || 'Current User') && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback>{chat.sender.split(' ').map(name => name[0]).join('')}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
