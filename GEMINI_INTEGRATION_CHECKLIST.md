# Gemini Chatbot Integration Checklist

## Pre-Integration ✓

- [x] Old JSON KB-based system removed
- [x] 7 TypeScript modules deleted
- [x] ChatbotComponent.tsx deleted
- [x] New Gemini service created
- [x] New React component created
- [x] Documentation complete

## Setup (5 Minutes)

### Step 1: Get API Key

- [ ] Visit https://aistudio.google.com/apikey
- [ ] Sign in with Google account
- [ ] Create new API key or use existing
- [ ] Copy API key to clipboard

### Step 2: Configure Environment

- [ ] Navigate to `crop-prediction/` directory
- [ ] Create file `.env.local`
- [ ] Add: `EXPO_PUBLIC_GEMINI_API_KEY=your_key_here`
- [ ] Save file
- [ ] Verify file is not in git (check .gitignore)

### Step 3: Add Component to App

- [ ] Open screen where you want chatbot (e.g., `app/results/[id].tsx`)
- [ ] Import: `import GeminiChatbotComponent from "@/components/GeminiChatbot";`
- [ ] Add to JSX: `<GeminiChatbotComponent />`
- [ ] Save file

### Step 4: Test

- [ ] Run: `npm start`
- [ ] Open app in simulator or device
- [ ] Look for 💬 button in bottom-right corner
- [ ] Tap button to open chat
- [ ] Type: "What is early blight?"
- [ ] Wait for response (2-3 seconds)
- [ ] Verify response is relevant
- [ ] Test follow-up question
- [ ] Click "Reset" to clear history
- [ ] Close and re-open to verify it works

## Integration Points

### Results Page

```tsx
// app/results/[id].tsx
import GeminiChatbotComponent from "@/components/GeminiChatbot";

export default function ResultPage() {
  return (
    <View>
      {/* Existing diagnosis results */}
      <GeminiChatbotComponent />
    </View>
  );
}
```

- [ ] Add to results screen
- [ ] Test with diagnosis results

### Home Screen

```tsx
// app/(tabs)/index.tsx
import GeminiChatbotComponent from "@/components/GeminiChatbot";

export default function HomeScreen() {
  return (
    <View>
      {/* Existing home content */}
      <GeminiChatbotComponent />
    </View>
  );
}
```

- [ ] Add to home screen
- [ ] Test accessibility

### Other Screens

- [ ] Diagnose screen
- [ ] History screen
- [ ] Profile screen
- [ ] Any other relevant screens

## Configuration

### Environment File

- [ ] `.env.local` created
- [ ] API key filled in
- [ ] File ignored in git (.gitignore check)
- [ ] Dev server restarted after changes

### Optional: Customize System Prompt

- [ ] Open `services/geminiChatbot.ts`
- [ ] Find `const SYSTEM_PROMPT = \`You are...\``
- [ ] Modify prompt for your needs
- [ ] Save and restart dev server

### Optional: Adjust Generation Settings

- [ ] Open `services/geminiChatbot.ts`
- [ ] Find `generationConfig` section
- [ ] Adjust `temperature`, `maxOutputTokens`, etc.
- [ ] Test and verify behavior

## Testing

### Functionality Tests

- [ ] **Initialization**: Greeting message appears
- [ ] **Send Message**: Can type and send message
- [ ] **Response**: Bot responds with relevant answer
- [ ] **Context**: Follow-up questions reference previous messages
- [ ] **Reset**: Clear button resets history
- [ ] **Close/Reopen**: Conversation preserved after reopening
- [ ] **Error Handling**: Shows error if API fails

### Edge Cases

- [ ] **Empty Input**: Can't send empty message
- [ ] **Loading State**: Shows loading indicator while waiting
- [ ] **Long Response**: Response displays fully
- [ ] **Special Characters**: Handles special characters
- [ ] **Multiple Sessions**: Each session is independent
- [ ] **Network Loss**: Graceful error if no internet

### Performance Tests

- [ ] **First Response**: 2-3 seconds (normal)
- [ ] **Follow-up**: Similar response time
- [ ] **UI**: Smooth scrolling in message list
- [ ] **Input**: No lag while typing
- [ ] **Memory**: No memory leaks on repeated open/close

## Documentation

### Read Documentation

- [ ] Read `GEMINI_QUICK_START.md` (5 minutes)
- [ ] Read `GEMINI_CHATBOT_SETUP.md` (20 minutes)
- [ ] Read `MIGRATION_GUIDE.md` for context
- [ ] Reference `GEMINI_SYSTEM_OVERVIEW.md` as needed

### Share with Team

- [ ] Share GEMINI_QUICK_START.md with team
- [ ] Discuss architecture changes
- [ ] Review API costs and limits
- [ ] Plan monitoring strategy

## Deployment

### Pre-Production

- [ ] Test on multiple devices
- [ ] Test on iOS and Android
- [ ] Test with varying network speeds
- [ ] Monitor API usage
- [ ] Set up error logging

### Production

- [ ] Set API key in production .env
- [ ] Monitor API quota
- [ ] Set up alerts for API failures
- [ ] Document support process
- [ ] Plan for scaling

### Monitoring

- [ ] Check [Google AI Studio](https://aistudio.google.com/) daily first week
- [ ] Monitor request counts
- [ ] Track error rates
- [ ] Set up alerts for quota warnings
- [ ] Plan scaling if needed

## Troubleshooting

### Common Issues

**"API key not configured"**

- [ ] Verify `.env.local` exists
- [ ] Verify key is set (not empty)
- [ ] Restart dev server: `npm start`
- [ ] Check console for full error message

**"No response / Timeout"**

- [ ] Check internet connection
- [ ] Verify API key is valid
- [ ] Check [Google AI Studio status](https://aistudio.google.com/)
- [ ] Try shorter, simpler question
- [ ] Click "Reset" and retry

**"API Error"**

- [ ] Check console for error message
- [ ] Verify API quota not exceeded
- [ ] Check rate limit (60/min, 1500/day)
- [ ] Try again in a few minutes

**"App Crashes"**

- [ ] Check console logs for stack trace
- [ ] Verify imports are correct
- [ ] Clear app cache: `npm start -c`
- [ ] Rebuild app

### Support Resources

- [ ] Console logs for debugging
- [ ] Google Gemini API docs: https://ai.google.dev/docs
- [ ] React Native docs: https://reactnative.dev/
- [ ] Local docs in root directory

## Cleanup (Optional)

### Remove Old Files

- [ ] Backup old `CHATBOT_*.md` files if needed
- [ ] Optionally delete old documentation files
- [ ] Keep `MIGRATION_GUIDE.md` for reference

### Code Cleanup

- [ ] Remove unused imports from old system
- [ ] Remove commented-out code
- [ ] Verify no console.log statements left
- [ ] Run linter: `npm run lint`

## Final Checks

### Verification

- [ ] Component renders without errors
- [ ] API key is loaded
- [ ] First message appears
- [ ] Can send messages
- [ ] Responses are relevant
- [ ] No console errors
- [ ] Styling matches app theme
- [ ] Works on actual device

### Performance

- [ ] Responses take 2-3 seconds (normal)
- [ ] UI doesn't freeze during API call
- [ ] Message list scrolls smoothly
- [ ] Input field is responsive

### Security

- [ ] API key not hardcoded
- [ ] .env.local not in git
- [ ] .gitignore includes .env.local
- [ ] No sensitive data in logs

### Documentation

- [ ] Team members know how to use it
- [ ] Setup instructions are clear
- [ ] Troubleshooting guide available
- [ ] API costs understood

## Sign-Off

- [ ] **Developer**: Integration complete
- [ ] **QA**: Testing complete
- [ ] **Product**: Features approved
- [ ] **Deployment**: Ready for production

---

## Quick Reference

| File                           | Purpose       |
| ------------------------------ | ------------- |
| `services/geminiChatbot.ts`    | API service   |
| `components/GeminiChatbot.tsx` | UI component  |
| `.env.local`                   | Configuration |
| `GEMINI_QUICK_START.md`        | 5-min guide   |
| `GEMINI_CHATBOT_SETUP.md`      | Full docs     |
| `MIGRATION_GUIDE.md`           | What changed  |

## Estimated Timelines

| Task                 | Time       |
| -------------------- | ---------- |
| Get API Key          | 2 min      |
| Configure .env       | 1 min      |
| Add Component        | 2 min      |
| Initial Test         | 5 min      |
| Full Testing         | 30 min     |
| Documentation Review | 20 min     |
| **Total Setup**      | **60 min** |

---

**Status**: Ready to integrate ✅  
**Last Updated**: 2026-01-28  
**Version**: 1.0
