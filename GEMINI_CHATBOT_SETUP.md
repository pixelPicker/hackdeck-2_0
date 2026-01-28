# Gemini Chatbot Setup Guide

## Overview

The new chatbot system uses **Google's Gemini API** for conversational crop disease diagnosis. It replaces the previous JSON knowledge base system with a modern LLM-powered approach.

## Features

✅ **Natural Conversations** - Ask questions in plain language
✅ **Disease Diagnosis** - Get AI-powered crop disease identification
✅ **Treatment Recommendations** - Learn both chemical and organic solutions
✅ **Prevention Advice** - Get proactive measures to protect crops
✅ **Context Awareness** - Maintains conversation history for follow-ups
✅ **Mobile Optimized** - Built for React Native with smooth UI

## Installation

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Get API Key"
3. Create new project or select existing one
4. Copy your API key

### Step 2: Configure Environment Variables

Create or update `.env.local` in the project root:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Important:**

- Use `EXPO_PUBLIC_` prefix to expose in Expo apps
- Never commit `.env` files to version control
- Keep your API key secret

### Step 3: Install Dependencies

The implementation uses only built-in React Native APIs. No additional npm packages needed for the chatbot itself.

```bash
npm install
# or
yarn install
```

### Step 4: Integrate into Your App

Add the chatbot to any screen:

```tsx
import GeminiChatbotComponent from "@/components/GeminiChatbot";

export default function MyScreen() {
  return (
    <View>
      {/* Your existing content */}
      <GeminiChatbotComponent />
    </View>
  );
}
```

The chatbot appears as a floating button (💬) in the bottom-right corner.

## Usage

### Basic Flow

1. **User taps the floating button** → Chat modal opens
2. **User types a question** → "Send" button becomes active
3. **Bot responds** → Uses Gemini API to generate response
4. **Continue conversation** → Full context maintained

### Example Questions

- "What's wrong with my tomato plant? It has brown spots on leaves"
- "How do I treat early blight?"
- "What organic pesticides work best?"
- "How do I prevent powdery mildew?"
- "What's the best time to spray fungicide?"

### Controls

- **Reset** - Clear conversation history
- **×** - Close chatbot modal

## Architecture

### Files

```
services/
  └── geminiChatbot.ts          # Gemini API service class

components/
  └── GeminiChatbot.tsx         # React Native UI component
```

### Flow

```
User Input
    ↓
GeminiChatbot.tsx (UI)
    ↓
GeminiChatbot class (Service)
    ↓
Google Gemini API
    ↓
Response with context
    ↓
Display in chat UI
```

### Core Components

#### GeminiChatbot Service (`geminiChatbot.ts`)

Handles API communication:

```typescript
const chatbot = new GeminiChatbot(apiKey);
const greeting = await chatbot.initialize();
const response = await chatbot.chat("My tomato has spots");
```

**Methods:**

- `constructor(apiKey)` - Initialize with API key
- `initialize()` - Get opening greeting
- `chat(message)` - Send message, get response
- `resetConversation()` - Clear history
- `getHistory()` - Get all messages
- `setContext(context)` - Add disease/crop context

#### GeminiChatbot Component (`GeminiChatbot.tsx`)

React Native UI with:

- Floating action button
- Modal chat interface
- Message bubbles (user vs bot)
- Input field with send button
- Error handling
- Loading states
- Auto-scroll to latest messages

## Configuration

### System Prompt

The chatbot has a built-in system prompt that instructs Gemini to:

- Act as an expert agricultural disease diagnostician
- Provide practical, actionable advice
- Consider local climate and crop varieties
- Always suggest consulting experts for complex issues
- Never provide definitive medical diagnoses

Located in `geminiChatbot.ts`:

```typescript
const SYSTEM_PROMPT = `You are an expert agricultural disease diagnostician...`;
```

### Generation Settings

Customize in `geminiChatbot.ts`:

```typescript
generationConfig: {
  temperature: 0.7,        // Creativity (0-2, higher = more creative)
  topK: 40,                // Top K sampling
  topP: 0.95,              // Nucleus sampling
  maxOutputTokens: 500,    // Response length limit
}
```

## Troubleshooting

### "API key not configured"

**Error:** "Gemini API key not configured"

**Solution:**

1. Verify `.env.local` exists in project root
2. Check key is set: `EXPO_PUBLIC_GEMINI_API_KEY=xxx`
3. Restart dev server: `npm start`

### "Failed to initialize chatbot"

**Error:** Error during initialization

**Possible causes:**

- Invalid API key
- Network connectivity issue
- API quota exceeded

**Solution:**

1. Verify API key is valid on [Google AI Studio](https://aistudio.google.com/apikey)
2. Check internet connection
3. Check [Gemini API documentation](https://ai.google.dev/) for status

### No response from bot

**Error:** Chat hangs or shows "Analyzing..." indefinitely

**Possible causes:**

- API timeout
- Network issue
- Large context history

**Solution:**

1. Click "Reset" to clear conversation
2. Try simpler questions first
3. Check network connectivity
4. Verify API key quota

### App crashes on send

**Error:** App crashes when sending message

**Solution:**

1. Check console logs for error details
2. Verify `.env.local` is properly configured
3. Ensure API key is valid
4. Try clearing app cache: `npm start -- -c`

## API Limits

**Free Tier:**

- 60 requests per minute
- 1,500 requests per day
- 500,000 tokens per day

**Pricing:**

- See [Google AI pricing](https://ai.google.dev/pricing)
- Monitor usage in [Google AI Studio](https://aistudio.google.com/)

## Best Practices

### 1. Error Handling

Always wrap API calls in try-catch (already done in component).

### 2. Conversation Context

Keep conversations focused on crop health - bot maintains context.

### 3. Reset Regularly

Clear history for new topics to avoid context confusion.

### 4. API Key Security

- Never hardcode API keys
- Use environment variables
- Rotate keys periodically
- Monitor usage for unusual activity

### 5. Rate Limiting

Consider implementing rate limiting if:

- Supporting many concurrent users
- Deploying to production
- Hitting API limits

## Integration Examples

### Add to Results Page

```tsx
// app/results/[id].tsx
import GeminiChatbotComponent from "@/components/GeminiChatbot";

export default function ResultPage() {
  return (
    <View style={styles.container}>
      {/* Existing diagnosis results */}

      {/* Add chatbot */}
      <GeminiChatbotComponent />
    </View>
  );
}
```

### Add to Multiple Screens

```tsx
// In any screen component
import GeminiChatbotComponent from "@/components/GeminiChatbot";

export default function Screen() {
  return (
    <View>
      {/* Your content */}
      <GeminiChatbotComponent />
    </View>
  );
}
```

### Standalone Chatbot Screen

```tsx
// app/(tabs)/chatbot.tsx
import GeminiChatbotComponent from "@/components/GeminiChatbot";
import { View } from "react-native";

export default function ChatbotScreen() {
  return (
    <View style={{ flex: 1 }}>
      <GeminiChatbotComponent />
    </View>
  );
}
```

## Development

### Testing Locally

1. Start dev server:

   ```bash
   npm start
   ```

2. Open in simulator/device

3. Test API key loading:
   - Check console for initialization errors
   - Verify greeting message appears when opening chat

4. Test conversation:
   - Send various crop disease questions
   - Verify responses are relevant
   - Check message history is maintained

### Debugging

Enable detailed logging in `GeminiChatbot.tsx`:

```typescript
// Add before API call
console.log("Sending to Gemini:", userMessage);
console.log("History length:", this.conversationHistory.length);

// After response
console.log("Received:", response);
```

## Future Enhancements

- **Image Upload** - Analyze crop images using Gemini Vision
- **Persistence** - Save conversations to database
- **Multi-language** - Support different languages
- **Export** - Download chat history as PDF
- **Analytics** - Track common crop diseases
- **Integration** - Link results to treatment marketplace

## Support

### Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)

### Common Issues

See **Troubleshooting** section above for common problems and solutions.

---

**Version:** 1.0  
**Last Updated:** 2026-01-28
