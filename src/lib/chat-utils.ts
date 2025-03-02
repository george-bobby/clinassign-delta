
import { supabase } from "@/lib/supabase";
import { Conversation, Message, Profile } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

// Fetch conversations for the current user
export const fetchUserConversations = async (): Promise<Conversation[]> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Get conversations that the user is a participant in
    const { data: participantData, error: participantError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);
    
    if (participantError) {
      throw participantError;
    }
    
    if (!participantData || participantData.length === 0) {
      return [];
    }
    
    const conversationIds = participantData.map(p => p.conversation_id);
    
    // Get conversation details
    const { data: conversations, error: conversationsError } = await supabase
      .from("conversations")
      .select("*")
      .in("id", conversationIds)
      .order("updated_at", { ascending: false });
    
    if (conversationsError) {
      throw conversationsError;
    }
    
    return conversations || [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

// Fetch messages for a specific conversation
export const fetchConversationMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    // Get messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id(id, name, email, role, avatar_url)
      `)
      .eq("conversation_id", conversationId)
      .order("timestamp", { ascending: true });
    
    if (messagesError) {
      throw messagesError;
    }
    
    return messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

// Fetch participants for a specific conversation
export const fetchConversationParticipants = async (conversationId: string): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from("conversation_participants")
      .select(`
        user_id,
        user:profiles!inner(id, name, email, role, avatar_url)
      `)
      .eq("conversation_id", conversationId);
    
    if (error) {
      throw error;
    }
    
    // Extract the user profiles and ensure correct type
    const profiles: Profile[] = [];
    
    if (data && data.length > 0) {
      data.forEach(item => {
        if (item.user) {
          profiles.push(item.user as Profile);
        }
      });
    }
    
    return profiles;
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
    
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        conversation_id: conversationId,
        message_text: messageText,
        attachments: attachments,
        is_read: false
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
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
    
    // Make sure the current user is included in participants
    if (!participantIds.includes(user.id)) {
      participantIds.push(user.id);
    }
    
    // Start a transaction to create conversation and add participants
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        name: name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (conversationError) {
      throw conversationError;
    }
    
    // Add participants
    const participantsToInsert = participantIds.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId
    }));
    
    const { error: participantsError } = await supabase
      .from("conversation_participants")
      .insert(participantsToInsert);
    
    if (participantsError) {
      throw participantsError;
    }
    
    return conversation;
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
    
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .eq("is_read", false);
    
    if (error) {
      throw error;
    }
    
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
    
    // Get conversations the user is part of
    const { data: participantData, error: participantError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);
    
    if (participantError) {
      throw participantError;
    }
    
    if (!participantData || participantData.length === 0) {
      return 0;
    }
    
    const conversationIds = participantData.map(p => p.conversation_id);
    
    // Count unread messages not sent by the current user
    const { count, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .in("conversation_id", conversationIds)
      .neq("sender_id", user.id)
      .eq("is_read", false);
    
    if (countError) {
      throw countError;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error getting unread message count:", error);
    return 0;
  }
};
