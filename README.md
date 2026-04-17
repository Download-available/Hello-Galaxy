# 🌸 Hello Galaxy — S26 Ultra Personal Guidebook

A warm, Thai-language interactive guidebook for Samsung Galaxy S26 Ultra.
Built for Mod — a first-time Android user coming from iPhone.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Welcome page |
| `manual.html` | Searchable manual browser with iPhone comparisons |
| `storage.html` | Gentle storage guidance with backup map |
| `chat.html` | Thai-language AI chatbot (requires API key) |

## Deploy to Netlify

### Option A — Netlify CLI (recommended)

```bash
# From the repo root
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Option B — Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) → New site → Import from Git
2. Connect your GitHub repo (`Download-available/Hello-Galaxy`)
3. Set publish directory to `.` (root)
4. Deploy

### Add your Anthropic API Key

In Netlify Dashboard → Site → **Environment Variables** → Add:

```
Key:   ANTHROPIC_API_KEY
Value: sk-ant-xxxxxxxxxxxx
```

The chatbot will work once the key is set. Without it, the chat page will show an error message.

## Local Development

```bash
npm install -g netlify-cli
cp .env.example .env
# Edit .env and add your real ANTHROPIC_API_KEY
netlify dev
```

Then open `http://localhost:8888` in your browser.

## Stack

- Plain HTML / CSS / JavaScript — no build step needed
- Netlify Functions (Node.js) for the chatbot backend
- Anthropic API (`claude-sonnet-4-5`) for Thai-language responses
- Google Fonts: Noto Sans Thai + Bai Jamjuree

## Notes

- All user-facing text is in Thai
- The chatbot system prompt is in `netlify/functions/chat.js`
- Conversation history is kept in browser memory (not persisted)
- The `.env.example` shows required environment variables
