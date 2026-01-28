# Chatbot Knowledge Base Integration

## Overview

The chatbot has been enhanced with a comprehensive JSON-based knowledge base containing detailed information about 10+ crop diseases. The chatbot now intelligently responds to user questions by searching through the knowledge base.

## Files Created

- **`data/diseases.json`** - Comprehensive disease knowledge base

## File Structure

### diseases.json Contains:

#### 1. **Diseases Array** (10 diseases with full details):

- Late Blight
- Early Blight
- Bacterial Spot
- Powdery Mildew
- Downy Mildew
- Septoria Leaf Spot
- Fusarium Wilt
- Verticillium Wilt
- Leaf Curl (Tomato Yellow Leaf Curl Virus)
- Anthracnose
- Rust

Each disease entry includes:

- `id` - Unique identifier
- `name` - Common name
- `scientificName` - Scientific/Latin name
- `affectedCrops` - List of affected crop types
- `severity` - High/Medium/Low classification
- `symptoms` - Array of symptom descriptions (5-7+ detailed symptoms)
- `causes` - Array of causative agents and transmission methods
- `conditions` - Ideal conditions for disease development (temperature, humidity, rainfall, seasonality)
- `treatment` - Immediate actions, chemical treatments, biological controls, frequency, duration
- `prevention` - 8+ preventive measures
- `riskFactors` - Environmental and management factors that increase disease risk
- `lifespan` - Disease cycle duration
- `economicImpact` - Potential crop loss percentage
- `zoneAffected` - Geographic zones where disease is common

#### 2. **Treatment Methods Section**:

- **Chemical Fungicides** - Specific products with dosages, frequency, safety info, cost
- **Chemical Bactericides** - For bacterial diseases
- **Biological Agents** - Natural control organisms with advantages/limitations

#### 3. **General Knowledge Section**:

- Disease management best practices
- Preventive measures
- Environmental factors affecting disease
- Temperature, humidity, and moisture considerations

#### 4. **FAQ Section**:

10+ frequently asked questions with detailed answers:

- Differences between fungal and bacterial diseases
- Virus curability
- Fungal spore survival in soil
- Overhead irrigation concerns
- Resistant variety information
- Preventive vs. curative spraying
- Early vs. late blight distinction
- Soil reuse practices
- And more

## Chatbot Enhancement

### New Function: `getKnowledgeBasedResponse()`

The chatbot now uses intelligent keyword matching to search the knowledge base and provide relevant responses.

**Query Types Supported:**

1. **Symptoms** - Questions about how disease appears
2. **Causes** - Questions about disease origins and transmission
3. **Treatment** - Questions about chemical/spray options
4. **Prevention** - Questions about preventive measures
5. **Biological Control** - Organic and natural treatment options
6. **Risk Factors** - What conditions favor disease
7. **Severity/Impact** - Potential damage and economic impact
8. **Lifespan/Cycle** - Disease progression timeline
9. **Geographic/Zones** - Where disease is common
10. **FAQ Topics** - Answers to common farming questions

### How It Works:

1. User asks a question in the chatbot
2. `getKnowledgeBasedResponse()` analyzes the query for keywords
3. Function matches query to appropriate disease data
4. Returns detailed, contextual response from the knowledge base
5. If no specific match, provides general disease overview

### Example Interactions:

- User: "What are the symptoms?" → Returns symptom list with context
- User: "How to treat this?" → Returns recommended chemicals and procedures
- User: "How to prevent?" → Returns prevention strategies
- User: "What causes it?" → Returns causative agent and conditions
- User: "Is it dangerous?" → Returns severity and economic impact
- User: "Can I use organic methods?" → Returns biological control options

## Integration

The chatbot is integrated in:

- **File**: [app/results/[id].tsx](app/results/[id].tsx)
- **Data Source**: [data/diseases.json](data/diseases.json)
- **Key Function**: `getKnowledgeBasedResponse()`

The import statement:

```tsx
import diseasesData from "@/data/diseases.json";
```

## File Size

- **diseases.json**: ~45-50 KB (very detailed, comprehensive)
- Full knowledge base for all disease information in one file

## Features

✓ Comprehensive disease information (symptoms, causes, treatment, prevention)
✓ Intelligent keyword-based response generation
✓ Multiple query types supported
✓ Contextual responses based on user questions
✓ FAQ section for common questions
✓ General agricultural knowledge
✓ Chemical, biological, and cultural practices covered
✓ Scalable (easy to add more diseases)
✓ No external API calls needed (all data local)

## How to Extend

To add more diseases:

1. Open `data/diseases.json`
2. Add new disease object to the `diseases` array
3. Follow the same structure as existing diseases
4. Include all required fields for best results
5. Chatbot will automatically support new disease queries

The chatbot will automatically handle any new diseases added to the JSON file.
