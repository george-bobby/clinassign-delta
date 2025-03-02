
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (text: string, attachments?: any) => void;
  conversationId: string | null;
  disabled?: boolean;
}

const EMOJI_LIST = [
  '😊', '😀', '😂', '😍', '👍', '❤️', '👏', '🙏',
  '😭', '😒', '😘', '😁', '🤔', '😢', '🤗', '😎',
  '🥳', '😴', '🤯', '🥺', '😃', '👋', '🌟', '✨'
];

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  conversationId,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSendMessage = () => {
    if (message.trim() && conversationId) {
      onSendMessage(message.trim());
      setMessage('');
      setIsExpanded(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };
  
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // File handling would go here
    // For now, just log the file
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('File selected:', files[0]);
      // Later: Implement file upload to Supabase storage
    }
  };
  
  return (
    <div className="p-4 border-t">
      <div className="flex flex-col">
        {isExpanded ? (
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[100px] resize-none mb-2"
            disabled={disabled || !conversationId}
          />
        ) : (
          <div className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => message.length > 50 && setIsExpanded(true)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={disabled || !conversationId}
            />
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={disabled || !conversationId}
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJI_LIST.map((emoji) => (
                    <Button
                      key={emoji}
                      type="button"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleAttachmentClick}
              disabled={disabled || !conversationId}
            >
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Button>
          </div>
          
          <Button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim() || disabled || !conversationId}
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
