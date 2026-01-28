/**
 * Gemini-Powered Chatbot Component
 * ================================
 * React Native modal chatbot using Google Gemini API
 * Handles crop disease diagnosis and treatment recommendations
 */

import { useState, useEffect, useRef } from "react";
import {
  View,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import GeminiChatbot from "@/services/geminiChatbot";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function GeminiChatbotComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatbot, setChatbot] = useState<GeminiChatbot | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Initialize chatbot on component mount
  useEffect(() => {
    const initializeChatbot = async () => {
      try {
        const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
          setError(
            "Gemini API key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.",
          );
          return;
        }

        const newChatbot = new GeminiChatbot(apiKey);
        const greeting = await newChatbot.initialize();

        setChatbot(newChatbot);
        setMessages([
          {
            id: "1",
            text: greeting,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to initialize chatbot";
        setError(errorMsg);
        console.error("Chatbot initialization error:", err);
      }
    };

    if (isOpen && !chatbot) {
      initializeChatbot();
    }
  }, [isOpen, chatbot]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || !chatbot || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to UI
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);
    setError(null);

    try {
      // Get response from Gemini
      const response = await chatbot.chat(userMessage);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Auto-scroll to latest message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to get response";
      setError(errorMsg);
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    // Keep conversation history but allow starting fresh on next open
  };

  const handleResetChat = () => {
    if (chatbot) {
      chatbot.resetConversation();
      setMessages([]);
      setError(null);
    }
  };

  // Render individual message
  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <ThemedText
        style={[
          styles.messageText,
          item.sender === "user" ? styles.userText : styles.botText,
        ]}
        numberOfLines={0}
      >
        {item.text}
      </ThemedText>
      <ThemedText
        style={[
          styles.timestamp,
          item.sender === "user" ? { color: "#999" } : { color: "#666" },
        ]}
      >
        {item.timestamp.toLocaleTimeString()}
      </ThemedText>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Chatbot Toggle Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.fabIcon}>💬</ThemedText>
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleCloseChat}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.chatContainer}>
            {/* Header */}
            <View style={styles.header}>
              <ThemedText style={styles.headerTitle}>
                Crop Disease Advisor
              </ThemedText>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={handleResetChat}
                  style={styles.headerButton}
                >
                  <ThemedText style={styles.headerButtonText}>Reset</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCloseChat}
                  style={styles.headerButton}
                >
                  <ThemedText style={styles.headerButtonText}>×</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
                <TouchableOpacity onPress={() => setError(null)}>
                  <ThemedText style={styles.errorDismiss}>Dismiss</ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {/* Messages List */}
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyStateText}>
                  Start a conversation about your crop concerns
                </ThemedText>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
              />
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4CAF50" />
                <ThemedText style={styles.loadingText}>Analyzing...</ThemedText>
              </View>
            )}

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Describe your crop issue..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                multiline
                maxHeight={80}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  isLoading && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                <ThemedText style={styles.sendButtonText}>Send</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 28,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: "20%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#101010",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  messagesList: {
    padding: 12,
  },
  messageBubble: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: "85%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderBottomWidth: 1,
    borderBottomColor: "#ef5350",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "#c62828",
    fontSize: 12,
    flex: 1,
  },
  errorDismiss: {
    color: "#c62828",
    marginLeft: 8,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
