
import { Conversation, Message, Profile } from "@/lib/types";

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Hospital Admin Chat",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message: "Let me know if you have any questions about the rotation schedule.",
    last_message_time: new Date().toISOString(),
    unread_count: 2,
    participants: [
      {
        id: "p1",
        conversation_id: "1",
        user_id: "123",
        user: {
          id: "123",
          name: "Admin User",
          email: "admin@example.com",
          role: "hospital_admin",
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      },
      {
        id: "p2",
        conversation_id: "1",
        user_id: "456",
        user: {
          id: "456",
          name: "Student User",
          email: "student@example.com",
          role: "student",
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ]
  },
  {
    id: "2",
    name: "Tutor Support",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message: "Your case study has been reviewed and approved.",
    last_message_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    participants: [
      {
        id: "p3",
        conversation_id: "2",
        user_id: "456",
        user: {
          id: "456",
          name: "Student User",
          email: "student@example.com",
          role: "student",
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      },
      {
        id: "p4",
        conversation_id: "2",
        user_id: "789",
        user: {
          id: "789",
          name: "Tutor User",
          email: "tutor@example.com",
          role: "tutor",
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ]
  }
];

// Mock messages data
const mockMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "m1",
      conversation_id: "1",
      sender_id: "123",
      message_text: "Hello! I've updated the rotation schedule for next month.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      is_read: true,
      sender: {
        id: "123",
        name: "Admin User",
        email: "admin@example.com",
        role: "hospital_admin",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    },
    {
      id: "m2",
      conversation_id: "1",
      sender_id: "456",
      message_text: "Thank you for the update. I'll check it out.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      is_read: true,
      sender: {
        id: "456",
        name: "Student User",
        email: "student@example.com",
        role: "student",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    },
    {
      id: "m3",
      conversation_id: "1",
      sender_id: "123",
      message_text: "Let me know if you have any questions about the rotation schedule.",
      timestamp: new Date().toISOString(),
      is_read: false,
      sender: {
        id: "123",
        name: "Admin User",
        email: "admin@example.com",
        role: "hospital_admin",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  ],
  "2": [
    {
      id: "m4",
      conversation_id: "2",
      sender_id: "789",
      message_text: "I've reviewed your case study submission.",
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      is_read: true,
      sender: {
        id: "789",
        name: "Tutor User",
        email: "tutor@example.com",
        role: "tutor",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    },
    {
      id: "m5",
      conversation_id: "2",
      sender_id: "789",
      message_text: "Your case study has been reviewed and approved.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      is_read: true,
      sender: {
        id: "789",
        name: "Tutor User",
        email: "tutor@example.com",
        role: "tutor",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  ]
};

// Mock user profiles
const mockProfiles: Profile[] = [
  {
    id: "123",
    name: "Admin User",
    email: "admin@example.com",
    role: "hospital_admin",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "456",
    name: "Student User",
    email: "student@example.com",
    role: "student",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "789",
    name: "Tutor User",
    email: "tutor@example.com",
    role: "tutor",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Fetch conversations for the current user
export const fetchUserConversations = async (): Promise<Conversation[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockConversations;
};

// Fetch messages for a specific conversation
export const fetchConversationMessages = async (conversationId: string): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMessages[conversationId] || [];
};

// Fetch participants for a specific conversation
export const fetchConversationParticipants = async (conversationId: string): Promise<Profile[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const conversation = mockConversations.find(c => c.id === conversationId);
  if (!conversation || !conversation.participants) {
    return [];
  }
  
  // Extract the user profiles from the participants
  const profiles: Profile[] = [];
  
  conversation.participants.forEach(participant => {
    if (participant.user) {
      profiles.push({
        id: participant.user.id,
        name: participant.user.name,
        email: participant.user.email,
        role: participant.user.role,
        avatar_url: participant.user.avatar_url,
        created_at: participant.user.created_at || '',
        updated_at: participant.user.updated_at || ''
      });
    }
  });
  
  return profiles;
};

// Send a message to a conversation
export const sendMessage = async (
  conversationId: string, 
  messageText: string, 
  attachments?: any
): Promise<Message | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock the current user
  const currentUser = mockProfiles[1]; // Using the student profile as the current user
  
  const newMessage: Message = {
    id: `m${Date.now()}`,
    conversation_id: conversationId,
    sender_id: currentUser.id,
    message_text: messageText,
    timestamp: new Date().toISOString(),
    is_read: false,
    sender: currentUser
  };
  
  // Add the message to the mock data
  if (mockMessages[conversationId]) {
    mockMessages[conversationId].push(newMessage);
  } else {
    mockMessages[conversationId] = [newMessage];
  }
  
  // Update the conversation's last message
  const conversation = mockConversations.find(c => c.id === conversationId);
  if (conversation) {
    conversation.last_message = messageText;
    conversation.last_message_time = newMessage.timestamp;
  }
  
  return newMessage;
};

// Create a new conversation with participants
export const createConversation = async (
  name: string,
  participantIds: string[]
): Promise<Conversation | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock the current user
  const currentUser = mockProfiles[1]; // Using the student profile as the current user
  
  // Make sure the current user is included in participants
  if (!participantIds.includes(currentUser.id)) {
    participantIds.push(currentUser.id);
  }
  
  // Create participant objects
  const participants = participantIds.map(userId => {
    const user = mockProfiles.find(p => p.id === userId);
    return {
      id: `p${Date.now()}${userId}`,
      conversation_id: `conv${Date.now()}`,
      user_id: userId,
      user: user || null
    };
  });
  
  // Create the new conversation
  const newConversation: Conversation = {
    id: `conv${Date.now()}`,
    name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message: "",
    last_message_time: new Date().toISOString(),
    unread_count: 0,
    participants
  };
  
  // Add the conversation to the mock data
  mockConversations.unshift(newConversation);
  
  return newConversation;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const messages = mockMessages[conversationId];
  if (messages) {
    // Find the current user (using the student profile for this mock)
    const currentUser = mockProfiles[1];
    
    // Mark messages as read
    messages.forEach(message => {
      if (message.sender_id !== currentUser.id) {
        message.is_read = true;
      }
    });
    
    // Update unread count in the conversation
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.unread_count = 0;
    }
  }
  
  return true;
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const profile = mockProfiles.find(p => p.id === userId);
  return profile || null;
};

// Check if a user can chat with another user based on roles
export const canChatWith = (userRole: string, targetRole: string): boolean => {
  const roleHierarchy: { [key: string]: string[] } = {
    'student': ['tutor'],
    'tutor': ['student', 'nursing_head'],
    'nursing_head': ['tutor', 'hospital_admin'],
    'hospital_admin': ['nursing_head', 'principal', 'student', 'tutor'],
    'principal': ['hospital_admin', 'nursing_head', 'tutor', 'student']
  };
  
  return roleHierarchy[userRole]?.includes(targetRole) || false;
};

// Get unread message count for all conversations
export const getUnreadMessageCount = async (): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Count unread messages across all conversations
  const currentUser = mockProfiles[1]; // Using the student profile as the current user
  
  let count = 0;
  Object.values(mockMessages).forEach(messages => {
    messages.forEach(message => {
      if (message.sender_id !== currentUser.id && !message.is_read) {
        count++;
      }
    });
  });
  
  return count;
};
