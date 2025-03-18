import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { canChatWith } from '@/lib/chat-utils';

interface NewConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (name: string, participantIds: string[]) => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  isOpen,
  onClose,
  onCreateConversation
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let userData: Profile[] = [];
        
        // For demo purposes, create mock users based on the current user's role
        if (user.role === 'student') {
          // Students can chat with tutors
          userData = [
            { 
              id: 'tutor-1', 
              name: 'Dr. Sarah Johnson', 
              email: 'sarah.johnson@example.com', 
              role: 'tutor',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            },
            { 
              id: 'tutor-2', 
              name: 'Prof. Michael Chen', 
              email: 'michael.chen@example.com', 
              role: 'tutor',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            },
            { 
              id: 'tutor-3', 
              name: 'Dr. Lisa Rodriguez', 
              email: 'lisa.rodriguez@example.com', 
              role: 'tutor',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            },
            { 
              id: 'tutor-4', 
              name: 'Prof. David Thompson', 
              email: 'david.thompson@example.com', 
              role: 'tutor',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            }
          ];
        } else if (user.role === 'tutor') {
          // Tutors can chat with students
          userData = [
            { 
              id: 'student-1', 
              name: 'Emma Davis', 
              email: 'emma.davis@example.com', 
              role: 'student',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            },
            { 
              id: 'student-2', 
              name: 'James Wilson', 
              email: 'james.wilson@example.com', 
              role: 'student',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            },
            { 
              id: 'student-3', 
              name: 'Sophia Martinez', 
              email: 'sophia.martinez@example.com', 
              role: 'student',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            },
            { 
              id: 'student-4', 
              name: 'Noah Thompson', 
              email: 'noah.thompson@example.com', 
              role: 'student',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            },
            { 
              id: 'student-5', 
              name: 'Olivia Brown', 
              email: 'olivia.brown@example.com', 
              role: 'student',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            }
          ];
        } else {
          // Other roles can see both students and tutors
          userData = [
            { 
              id: 'tutor-1', 
              name: 'Dr. Sarah Johnson', 
              email: 'sarah.johnson@example.com', 
              role: 'tutor',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            },
            { 
              id: 'student-1', 
              name: 'Emma Davis', 
              email: 'emma.davis@example.com', 
              role: 'student',
              avatar_url: null,
              created_at: '',
              updated_at: ''
            }
          ];
        }
        
        setUsers(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, user, toast]);
  
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(user => 
          user.name?.toLowerCase().includes(query) || 
          user.email?.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  const handleCreateConversation = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one participant',
        variant: 'destructive'
      });
      return;
    }
    
    const conversationName = name.trim() || generateDefaultName();
    onCreateConversation(conversationName, selectedUsers);
    handleClose();
  };
  
  const generateDefaultName = (): string => {
    if (selectedUsers.length === 1) {
      const user = users.find(u => u.id === selectedUsers[0]);
      return user?.name || 'New Conversation';
    } else {
      return `Group Conversation (${selectedUsers.length + 1} participants)`;
    }
  };
  
  const handleClose = () => {
    setName('');
    setSearchQuery('');
    setSelectedUsers([]);
    onClose();
  };
  
  const getUserRoleLabel = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      'student': 'Student',
      'tutor': 'Tutor',
      'nursing_head': 'Nursing Head',
      'hospital_admin': 'Hospital Admin',
      'principal': 'Principal'
    };
    return roleMap[role] || role;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            {user?.role === 'student' 
              ? "Select a tutor to start a conversation with."
              : user?.role === 'tutor'
                ? "Select a student to start a conversation with."
                : "Select participants to start a conversation."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Conversation Name (optional)</Label>
            <Input
              id="name"
              placeholder="Enter a name for the conversation"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="space-y-2">
            <Label>
              {user?.role === 'student' ? 'Select Tutors' : 
               user?.role === 'tutor' ? 'Select Students' : 
               'Select Participants'}
            </Label>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center space-x-3 p-2 rounded hover:bg-secondary/50 cursor-pointer"
                      onClick={() => handleUserSelect(user.id)}
                    >
                      <Checkbox 
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserSelect(user.id)}
                      />
                      <Avatar className="h-8 w-8">
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} />
                        ) : null}
                        <AvatarFallback>
                          {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {getUserRoleLabel(user.role)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'No users matching your search' : 'No users available'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {selectedUsers.length === 0 ? (
              <p>No participants selected</p>
            ) : (
              <p>{selectedUsers.length} participant(s) selected</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateConversation} disabled={selectedUsers.length === 0}>
            Create Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
