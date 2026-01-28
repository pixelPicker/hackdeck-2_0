# Gemini Chatbot - Quick Start (5 Minutes)

## What You Get

A modern AI-powered chatbot for crop disease diagnosis using Google's Gemini API.

```
Before: 250+ lines of pattern matching
After:  Natural AI conversations
```

## 3-Step Setup

### 1️⃣ Get API Key (2 min)

Go to https://aistudio.google.com/apikey and copy your key.

### 2️⃣ Configure Environment (1 min)

Create `crop-prediction/.env.local`:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

### 3️⃣ Add to Your App (1 min)

Add to any screen (`app/results/[id].tsx`, `app/(tabs)/index.tsx`, etc.):

```tsx
import GeminiChatbotComponent from "@/components/GeminiChatbot";

export default function YourScreen() {
  return (
    <View>
      {/* Your existing content */}
      <GeminiChatbotComponent /> {/* ← Adds chatbot */}
    </View>
  );
}
```

**Done!** 🎉

## What It Does

- 💬 Chat about crop diseases naturally
- 🔍 Get AI-powered diagnosis
- 💊 Treatment recommendations (chemical & organic)
- 🛡️ Prevention strategies
- 📝 Maintains conversation history

## Example Usage

**User:** "My tomato plant has brown spots"  
**Bot:** "That sounds like early blight. Brown spots with concentric rings are typical. Here's what to do..."

## File Structure

```
services/
  └── geminiChatbot.ts          # API service
components/
  └── GeminiChatbot.tsx         # Chat UI
.env.local                       # Configuration
```

## UI Overview

```
┌─────────────────────────────┐
│  Crop Disease Advisor  Reset×│  ← Header
├─────────────────────────────┤
│                             │
│              Hello! I'm...   │  ← Bot greeting
│                             │
│              My tomato...    │  ← User message
│                             │
│              That sounds...  │  ← Bot response
│                             │
├─────────────────────────────┤
│ Describe your crop issue...  │  ← Input field
│                        Send ▶│
└─────────────────────────────┘

     💬 (Floating button to open chat)
```

## Features

| Feature       | Details                          |
| ------------- | -------------------------------- |
| **API**       | Google Gemini (gemini-1.5-flash) |
| **Context**   | Maintains 10-message history     |
| **Responses** | ~500 tokens (2-3 paragraphs)     |
| **Language**  | English (extensible)             |
| **Tone**      | Friendly, practical, expert      |
| **Safety**    | Recommends expert consultation   |

## Customization

### Change System Prompt

Edit `services/geminiChatbot.ts`:

```typescript
const SYSTEM_PROMPT = `You are an expert...`;
```

### Adjust Generation Settings

```typescript
generationConfig: {
  temperature: 0.7,      // ← Increase for more creative
  maxOutputTokens: 500,  // ← Increase for longer responses
}
```

### Customize Colors

Edit `components/GeminiChatbot.tsx` styles:

```typescript
const sendButton = {
  backgroundColor: "#4CAF50", // ← Change this
};
```

## Troubleshooting

| Issue                    | Solution                           |
| ------------------------ | ---------------------------------- |
| "API key not configured" | Check `.env.local` exists with key |
| No response from bot     | Click Reset, verify internet       |
| App crashes              | Check console for error details    |
| Slow responses           | Normal - first response takes 2-3s |

## API Pricing

**Free Tier:**

- 60 requests/minute
- 1,500 requests/day
- Generous limits for testing

**Paid Plans:** See https://ai.google.dev/pricing

## Next Steps

1. ✅ Set up `.env.local` with API key
2. ✅ Add `<GeminiChatbotComponent />` to a screen
3. ✅ Test by tapping the 💬 button
4. ✅ Send a crop disease question
5. 🚀 Deploy to production

## Need Help?

- Full docs: See `GEMINI_CHATBOT_SETUP.md`
- Google Gemini API: https://ai.google.dev/docs
- React Native: https://reactnative.dev/

---

**Current Status:**

- ✅ Service implemented
- ✅ Component built
- ✅ Ready to use

**Estimated time to integrate:** 5 minutes  
**Dependencies needed:** None (uses built-in APIs)
