/**
 * Gemini-Powered Chatbot Service
 * ==============================
 * Uses Google's Gemini API for conversational crop disease diagnosis.
 * Provides crop health assessment, disease identification, and treatment recommendations.
 */

interface GeminiMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

interface ConversationContext {
  messages: GeminiMessage[];
  diseaseContext?: string;
  cropType?: string;
}

const SYSTEM_PROMPT = `You are an expert agricultural disease diagnostician AI. Your role is to:

1. Help farmers identify crop diseases from symptom descriptions
2. Provide treatment recommendations (both chemical and organic)
3. Suggest preventive measures
4. Explain disease biology and spread patterns
5. Recommend when to consult agricultural experts

When responding:
- Be concise but informative
- Use simple language suitable for farmers
- Provide practical, actionable advice
- Always include confidence level in your diagnosis
- Never make definitive medical diagnoses - always suggest consulting experts
- Ask clarifying questions about symptoms if needed
- Consider local climate and crop varieties when relevant
- Answer in 500 words or less. complete the whole sentence and dont cut the answer in between 

Format your responses with clear sections when discussing treatments or prevention.`;

export class GeminiChatbot {
  private apiKey: string;
  private conversationHistory: GeminiMessage[] = [];
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
  private model = "gemini-2.5-flash";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.apiKey = apiKey;
  }

  /**
   * Send a message and get a response from Gemini
   */
  async chat(userMessage: string): Promise<string> {
    try {
      // Prepare contents with system prompt on first message
      let contents = this.conversationHistory;

      // If first message, prepend system prompt
      if (this.conversationHistory.length === 0) {
        contents = [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\n\n" + userMessage }],
          },
        ];
      } else {
        // Add user message to history for subsequent messages
        contents = [
          ...this.conversationHistory,
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ];
      }

      // Prepare the request
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1500,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE",
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Gemini API error: ${error.error?.message || "Unknown error"}`,
        );
      }

      const data = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        throw new Error("Invalid response from Gemini API");
      }

      const botMessage =
        data.candidates[0].content.parts[0].text ||
        "Sorry, I couldn't generate a response.";

      // Add user message and bot response to history (for tracking conversation)
      this.conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      // Add bot response to history
      this.conversationHistory.push({
        role: "model",
        parts: [{ text: botMessage }],
      });

      return botMessage;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get response from Gemini: ${errorMessage}`);
    }
  }

  /**
   * Reset conversation history for a new topic
   */
  resetConversation(): void {
    this.conversationHistory = [];
  }

  /**
   * Get current conversation history
   */
  getHistory(): GeminiMessage[] {
    return this.conversationHistory;
  }

  /**
   * Set conversation context (disease or crop info)
   */
  setContext(context: Partial<ConversationContext>): void {
    if (context.diseaseContext) {
      const contextMessage = `Context: Previously discussed disease - ${context.diseaseContext}`;
      this.conversationHistory.push({
        role: "user",
        parts: [{ text: contextMessage }],
      });
    }
    if (context.cropType) {
      const cropMessage = `Crop type: ${context.cropType}`;
      this.conversationHistory.push({
        role: "user",
        parts: [{ text: cropMessage }],
      });
    }
  }

  /**
   * Initialize chatbot with opening message
   */
  async initialize(): Promise<string> {
    const greeting =
      "Hello! I'm your crop disease expert. I can help you identify crop diseases, recommend treatments, and suggest preventive measures. What crop issue are you experiencing today?";
    this.conversationHistory.push({
      role: "model",
      parts: [{ text: greeting }],
    });
    return greeting;
  }
}

export default GeminiChatbot;
