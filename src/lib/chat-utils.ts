import { supabase } from "@/lib/supabase";
import { Conversation, Message, Profile } from "@/lib/types";

// Fetch conversations for the current user
export const fetchUserConversations = async (): Promise<Conversation[]> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // For demo purposes, create mock conversations based on role
    const mockConversations: Conversation[] = [];
    
    // Get user profile to determine role
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (userProfile) {
      const userRole = userProfile.role;
      
      if (userRole === 'student') {
        // Students see conversations with tutors
        mockConversations.push(
          {
            id: "conv-1",
            name: "Dr. Sarah Johnson",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_message: "Remember to complete your case study before Thursday",
            last_message_time: new Date(Date.now() - 3600000).toISOString(),
            unread_count: 1,
            participants: []
          },
          {
            id: "conv-2",
            name: "Prof. Michael Chen",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_message: "Your clinical rotation schedule has been updated",
            last_message_time: new Date(Date.now() - 86400000).toISOString(),
            unread_count: 0,
            participants: []
          }
        );
      } else if (userRole === 'tutor') {
        // Tutors see conversations with students
        mockConversations.push(
          {
            id: "conv-3",
            name: "Emma Davis (Student)",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_message: "Thank you for the feedback on my assignment",
            last_message_time: new Date(Date.now() - 7200000).toISOString(),
            unread_count: 0,
            participants: []
          },
          {
            id: "conv-4",
            name: "James Wilson (Student)",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_message: "I have a question about tomorrow's practical",
            last_message_time: new Date(Date.now() - 43200000).toISOString(),
            unread_count: 2,
            participants: []
          },
          {
            id: "conv-5",
            name: "Sophia Martinez (Student)",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_message: "Can I reschedule my clinical supervision?",
            last_message_time: new Date(Date.now() - 172800000).toISOString(),
            unread_count: 0,
            participants: []
          }
        );
      }
      
      // Add mock participants
      mockConversations.forEach(conv => {
        // Parse name to create mock user IDs and profiles
        const otherUserId = `user-${conv.id}`;
        const otherUserRole = userRole === 'student' ? 'tutor' : 'student';
        
        conv.participants = [
          {
            id: `participant-1-${conv.id}`,
            conversation_id: conv.id,
            user_id: user.id,
            user: {
              id: user.id,
              name: userProfile.name || user.email,
              email: user.email,
              role: userRole,
              avatar_url: null,
              created_at: '',
              updated_at: ''
            }
          },
          {
            id: `participant-2-${conv.id}`,
            conversation_id: conv.id,
            user_id: otherUserId,
            user: {
              id: otherUserId,
              name: conv.name,
              email: `${conv.name.toLowerCase().replace(/ /g, '.')}@example.com`,
              role: otherUserRole,
              avatar_url: null,
              created_at: '',
              updated_at: ''
            }
          }
        ];
      });
    }
    
    return mockConversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

// Fetch messages for a specific conversation
export const fetchConversationMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    // For demo purposes, create mock messages
    const mockMessages: Message[] = [];
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Get user profile to determine role
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (!userProfile) {
      return mockMessages;
    }
    
    // Different mock messages based on conversation
    if (conversationId === "conv-1") {
      // Conversation with Dr. Sarah Johnson
      mockMessages.push(
        {
          id: "msg-1",
          conversation_id: conversationId,
          sender_id: "tutor-1",
          message_text: "Hi, just checking in on your progress with the case study assignment.",
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          is_read: true,
          sender: {
            id: "tutor-1",
            name: "Dr. Sarah Johnson",
            email: "sarah.johnson@example.com",
            role: "tutor",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-2",
          conversation_id: conversationId,
          sender_id: user.id,
          message_text: "Hello Dr. Johnson, I've completed the first section but having trouble with the patient assessment part.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          is_read: true,
          sender: {
            id: user.id,
            name: userProfile.name || user.email,
            email: user.email,
            role: userProfile.role,
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-3",
          conversation_id: conversationId,
          sender_id: "tutor-1",
          message_text: "That's common. Focus on the vital signs first, then build your assessment. Would you like to schedule a quick review session?",
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          is_read: true,
          sender: {
            id: "tutor-1",
            name: "Dr. Sarah Johnson",
            email: "sarah.johnson@example.com",
            role: "tutor",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-4",
          conversation_id: conversationId,
          sender_id: "tutor-1",
          message_text: "Remember to complete your case study before Thursday",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          is_read: false,
          sender: {
            id: "tutor-1",
            name: "Dr. Sarah Johnson",
            email: "sarah.johnson@example.com",
            role: "tutor",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        }
      );
    } else if (conversationId === "conv-2") {
      // Conversation with Prof. Michael Chen
      mockMessages.push(
        {
          id: "msg-5",
          conversation_id: conversationId,
          sender_id: "tutor-2",
          message_text: "Hello, I've updated the clinical rotation schedule for next month.",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          is_read: true,
          sender: {
            id: "tutor-2",
            name: "Prof. Michael Chen",
            email: "michael.chen@example.com",
            role: "tutor",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-6",
          conversation_id: conversationId,
          sender_id: user.id,
          message_text: "Thanks Professor. Will we still have pediatrics on Mondays?",
          timestamp: new Date(Date.now() - 129600000).toISOString(),
          is_read: true,
          sender: {
            id: user.id,
            name: userProfile.name || user.email,
            email: user.email,
            role: userProfile.role,
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-7",
          conversation_id: conversationId,
          sender_id: "tutor-2",
          message_text: "Yes, that remains unchanged. But your Wednesday rotation will now be in the cardiology department instead of general medicine.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          is_read: true,
          sender: {
            id: "tutor-2",
            name: "Prof. Michael Chen",
            email: "michael.chen@example.com",
            role: "tutor",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        }
      );
    } else if (conversationId === "conv-3") {
      // Tutor conversation with Emma Davis
      mockMessages.push(
        {
          id: "msg-8",
          conversation_id: conversationId,
          sender_id: user.id,
          message_text: "Emma, I've reviewed your latest assignment. Your patient care plan was excellent.",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          is_read: true,
          sender: {
            id: user.id,
            name: userProfile.name || user.email,
            email: user.email,
            role: userProfile.role,
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-9",
          conversation_id: conversationId,
          sender_id: "student-1",
          message_text: "Thank you! I spent a lot of time researching the best approaches for that particular case.",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          is_read: true,
          sender: {
            id: "student-1",
            name: "Emma Davis",
            email: "emma.davis@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-10",
          conversation_id: conversationId,
          sender_id: user.id,
          message_text: "It shows. I particularly liked your integration of holistic care approaches with traditional methods.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          is_read: true,
          sender: {
            id: user.id,
            name: userProfile.name || user.email,
            email: user.email,
            role: userProfile.role,
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-11",
          conversation_id: conversationId,
          sender_id: "student-1",
          message_text: "Thank you for the feedback on my assignment",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          is_read: true,
          sender: {
            id: "student-1",
            name: "Emma Davis",
            email: "emma.davis@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        }
      );
    } else if (conversationId === "conv-4") {
      // Tutor conversation with James Wilson
      mockMessages.push(
        {
          id: "msg-12",
          conversation_id: conversationId,
          sender_id: "student-2",
          message_text: "Hello Professor, I've been reviewing the material for tomorrow's practical session.",
          timestamp: new Date(Date.now() - 129600000).toISOString(),
          is_read: true,
          sender: {
            id: "student-2",
            name: "James Wilson",
            email: "james.wilson@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-13",
          conversation_id: conversationId,
          sender_id: user.id,
          message_text: "That's good to hear, James. Are you prepared for the catheterization demonstration?",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          is_read: true,
          sender: {
            id: user.id,
            name: userProfile.name || user.email,
            email: user.email,
            role: userProfile.role,
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-14",
          conversation_id: conversationId,
          sender_id: "student-2",
          message_text: "I've practiced with the mannequins, but I'm still a bit nervous about the sterile technique.",
          timestamp: new Date(Date.now() - 64800000).toISOString(),
          is_read: true,
          sender: {
            id: "student-2",
            name: "James Wilson",
            email: "james.wilson@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-15",
          conversation_id: conversationId,
          sender_id: "student-2",
          message_text: "I have a question about tomorrow's practical",
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          is_read: false,
          sender: {
            id: "student-2",
            name: "James Wilson",
            email: "james.wilson@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-16",
          conversation_id: conversationId,
          sender_id: "student-2",
          message_text: "Will we be graded on tomorrow's performance?",
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          is_read: false,
          sender: {
            id: "student-2",
            name: "James Wilson",
            email: "james.wilson@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        }
      );
    } else if (conversationId === "conv-5") {
      // Tutor conversation with Sophia Martinez
      mockMessages.push(
        {
          id: "msg-17",
          conversation_id: conversationId,
          sender_id: "student-3",
          message_text: "Professor, I need to reschedule my clinical supervision for next week.",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          is_read: true,
          sender: {
            id: "student-3",
            name: "Sophia Martinez",
            email: "sophia.martinez@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-18",
          conversation_id: conversationId,
          sender_id: user.id,
          message_text: "What's the reason for rescheduling, Sophia?",
          timestamp: new Date(Date.now() - 216000000).toISOString(),
          is_read: true,
          sender: {
            id: user.id,
            name: userProfile.name || user.email,
            email: user.email,
            role: userProfile.role,
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-19",
          conversation_id: conversationId,
          sender_id: "student-3",
          message_text: "I have a medical appointment that couldn't be scheduled at any other time.",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          is_read: true,
          sender: {
            id: "student-3",
            name: "Sophia Martinez",
            email: "sophia.martinez@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        },
        {
          id: "msg-20",
          conversation_id: conversationId,
          sender_id: "student-3",
          message_text: "Can I reschedule my clinical supervision?",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          is_read: true,
          sender: {
            id: "student-3",
            name: "Sophia Martinez",
            email: "sophia.martinez@example.com",
            role: "student",
            avatar_url: null,
            created_at: '',
            updated_at: ''
          }
        }
      );
    }
    
    return mockMessages;
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};

// Fetch participants for a specific conversation
export const fetchConversationParticipants = async (conversationId: string): Promise<Profile[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Get user profile to determine role
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (!userProfile) {
      return [];
    }
    
    // Create mock participants based on the conversation ID
    const mockParticipants: Profile[] = [];
    
    // Add current user
    mockParticipants.push({
      id: user.id,
      name: userProfile.name || user.email,
      email: user.email,
      role: userProfile.role,
      avatar_url: null,
      created_at: '',
      updated_at: ''
    });
    
    // Add the other participant based on conversation ID
    if (conversationId === "conv-1") {
      mockParticipants.push({
        id: "tutor-1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "tutor",
        avatar_url: null,
        created_at: '',
        updated_at: ''
      });
    } else if (conversationId === "conv-2") {
      mockParticipants.push({
        id: "tutor-2",
        name: "Prof. Michael Chen",
        email: "michael.chen@example.com",
        role: "tutor",
        avatar_url: null,
        created_at: '',
        updated_at: ''
      });
    } else if (conversationId === "conv-3") {
      mockParticipants.push({
        id: "student-1",
        name: "Emma Davis",
        email: "emma.davis@example.com",
        role: "student",
        avatar_url: null,
        created_at: '',
        updated_at: ''
      });
    } else if (conversationId === "conv-4") {
      mockParticipants.push({
        id: "student-2",
        name: "James Wilson",
        email: "james.wilson@example.com",
        role: "student",
        avatar_url: null,
        created_at: '',
        updated_at: ''
      });
    } else if (conversationId === "conv-5") {
      mockParticipants.push({
        id: "student-3",
        name: "Sophia Martinez",
        email: "sophia.martinez@example.com",
        role: "student",
        avatar_url: null,
        created_at: '',
        updated_at: ''
      });
    }
    
    return mockParticipants;
  } catch (error) {
    console.error("Error fetching conversation participants:", error);
    return [];
  }
};

// Send a message to a conversation
export const sendMessage = async (
  conversationId: string, 
  messageText: string, 
  attachments?: any
): Promise<Message | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Get user profile
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (!userProfile) {
      throw new Error("User profile not found");
    }
    
    // Create a mock message
    const mockMessage: Message = {
      id: `new-msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: user.id,
      message_text: messageText,
      timestamp: new Date().toISOString(),
      is_read: false,
      sender: {
        id: user.id,
        name: userProfile.name || user.email,
        email: user.email,
        role: userProfile.role,
        avatar_url: null,
        created_at: '',
        updated_at: ''
      }
    };
    
    return mockMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

// Create a new conversation with participants
export const createConversation = async (
  name: string,
  participantIds: string[]
): Promise<Conversation | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Create a mock conversation
    const mockConversation: Conversation = {
      id: `new-conv-${Date.now()}`,
      name: name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message: null,
      last_message_time: null,
      unread_count: 0,
      participants: []
    };
    
    return mockConversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // In a demo implementation, we just return true
    return true;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return false;
  }
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Check if a user can chat with another user based on roles
export const canChatWith = (userRole: string, targetRole: string): boolean => {
  // Focus on student-tutor communication
  if (userRole === 'student' && targetRole === 'tutor') return true;
  if (userRole === 'tutor' && targetRole === 'student') return true;
  
  // Other role combinations can be added as needed
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
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // In a demo implementation, we return a random count
    return Math.floor(Math.random() * 5);
  } catch (error) {
    console.error("Error getting unread message count:", error);
    return 0;
  }
};
