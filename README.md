# 🌸 Hello, Galaxy

> A warm, Thai-language interactive guidebook for someone switching to their first Android phone.

A personalized companion site for the Samsung Galaxy S26 Ultra, designed for a lifelong iOS user who speaks only Thai and prefers gentle guidance over technical documentation. Built as a static site with a Claude-powered chat assistant, deployable to Netlify in minutes.

---

## ✨ About this project

This is not a general-purpose Samsung user manual. It is a guidebook built for one specific person — someone who has used iPhones for decades, speaks only Thai, and finds technology intimidating when it demands too much of her attention. The project translates the official Samsung S26 Ultra manual into something that feels like a handwritten letter from a patient friend rather than a 400-page corporate document.

The guidebook is organized into three core experiences. There is a welcome page that acknowledges the emotional side of switching phone ecosystems. There is a searchable, categorized manual browser that reorganizes hundreds of manual pages into intuitive topics written in everyday Thai. And there is a Claude-powered chat assistant that answers questions in natural Thai, grounded in the manual content, with a warmth that a static page cannot provide on its own.

A dedicated storage section addresses the single pain point that has followed her across every phone she has ever owned. Rather than nagging her to delete files, it shows her where her backups already live and frames cleanup as optional and reassuring.

---

## 🎨 Design philosophy

The aesthetic is deliberately soft without tipping into childish. Think MUJI stationery, Korean wellness apps, or a well-loved paperback journal — pastel tones, generous whitespace, rounded but restrained iconography, and Thai typography that has been chosen first rather than imported as an afterthought. Every design decision is filtered through one question: *does this make her feel welcomed, or does this make her feel instructed?*

Animations are gentle. Tap targets are large. Copy is short. Nothing demands her attention.

---

## 🏗️ Architecture

The project is a static site with a single serverless function for the chat feature. This keeps hosting simple, costs near-zero, and attack surface small.

```
┌─────────────────────────┐
│   Static Frontend       │
│   (HTML / CSS / JS)     │
│                         │
│   • Welcome page        │
│   • Manual browser      │
│   • Storage section     │
│   • Chat UI             │
└───────────┬─────────────┘
            │
            │  POST /.netlify/functions/chat
            ▼
┌─────────────────────────┐
│   Netlify Function      │
│   (serverless proxy)    │
│                         │
│   • Hides API key       │
│   • Injects system      │
│     prompt + manual     │
│     context             │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Anthropic API         │
│   (Claude Sonnet 4.5)   │
└─────────────────────────┘
```

The frontend is intentionally framework-light. A compile-heavy setup would be overkill for content that is mostly static, and would slow down iteration when tweaking copy or styling.

---

## 🚀 Getting started

### Prerequisites

You will need Node.js 20 or newer, the Netlify CLI installed globally (`npm install -g netlify-cli`), and an Anthropic API key with access to Claude Sonnet 4.5 or later. The API key will be used for the chat assistant and should never be committed to the repository or exposed to the browser.

### Local development

Clone the repository, install dependencies, and create a local environment file based on the provided example. The `.env.example` file lists every variable the project expects; copy it to `.env` and fill in your Anthropic API key.

```bash
git clone <your-repo-url>
cd hello-galaxy
npm install
cp .env.example .env
# then open .env and paste your ANTHROPIC_API_KEY
```

To run the site locally with the serverless function active, use Netlify Dev rather than a plain static server. Netlify Dev emulates the production environment, including the function routes, so the chat feature works exactly as it will in production.

```bash
netlify dev
```

The site will be available at `http://localhost:8888`. Changes to static files reload automatically; changes to the function require restarting the dev server.

### Deployment

The first deploy links your local project to a new Netlify site. Subsequent deploys happen automatically on every push to the `main` branch once the repository is connected.

```bash
netlify init       # first time only — creates the Netlify site
netlify deploy --prod
```

After the first deploy, open your site settings on Netlify and add `ANTHROPIC_API_KEY` as an environment variable. The function will fail gracefully with a Thai error message if the key is missing, but of course the chat will not actually work until the key is present.

---

## 📁 Project structure

The repository is organized so that content, presentation, and logic each live in their own neighborhood. This separation is deliberate — it means non-technical edits (fixing a typo in the welcome message, adjusting a pastel color) do not require touching any JavaScript.

```
hello-galaxy/
├── public/                    # static assets served as-is
│   ├── index.html             # welcome page
│   ├── manual.html            # searchable manual browser
│   ├── storage.html           # dedicated storage section
│   ├── assets/
│   │   ├── fonts/             # Thai font files
│   │   ├── icons/             # rounded line icons
│   │   └── images/            # illustrations, screenshots
│   └── styles/
│       ├── tokens.css         # color, spacing, typography variables
│       ├── base.css           # resets, typography, layout primitives
│       └── components.css     # cards, buttons, chat bubbles
├── src/
│   ├── chat.js                # chat UI logic, fetch to function
│   ├── search.js              # manual browser search
│   └── content/
│       ├── manual.json        # parsed, categorized manual content
│       └── system-prompt.md   # Claude system prompt (Thai persona)
├── netlify/
│   └── functions/
│       └── chat.js            # serverless proxy to Anthropic API
├── .env.example
├── netlify.toml
├── package.json
└── README.md
```

---

## ⚙️ Configuration

### Environment variables

Every variable the project reads is documented in `.env.example`. The most important one is `ANTHROPIC_API_KEY`, which authenticates the serverless function against the Anthropic API. A second variable, `CLAUDE_MODEL`, lets you pin a specific model version without editing code — useful when newer Claude models ship and you want to evaluate them without a deploy.

```bash
# .env.example
ANTHROPIC_API_KEY=sk-ant-...          # required
CLAUDE_MODEL=claude-sonnet-4-5        # optional, defaults to sonnet-4-5
MAX_TOKENS=1024                       # optional, defaults to 1024
```

### Customizing the assistant's personality

The chat assistant's tone, voice, and behavior are defined in `src/content/system-prompt.md`. This file is written in Thai and loaded by the serverless function at request time. Editing this file is how you shape what the assistant *feels like* to talk to — whether it is more formal or casual, whether it uses honorifics, whether it offers to elaborate, whether it tells small jokes. Treat this file as a living document; adjust it based on real conversations rather than guessing in advance.

### Manual content

The content served by the manual browser lives in `src/content/manual.json`. This file is derived from the official Samsung PDFs but rewritten into shorter, friendlier Thai. To regenerate or expand it, edit the JSON directly — there is no build step between the content file and what the user sees, which keeps iteration fast.

---

## 🧩 How the chat assistant works

When the user sends a message, the frontend posts it to `/.netlify/functions/chat` along with the short conversation history so far. The serverless function then assembles a request to the Anthropic API with three parts layered together. First comes the system prompt from `system-prompt.md`, which defines the Thai persona, tone, and behavioral guardrails. Second comes a condensed version of the manual content, passed as context so the assistant can answer questions about specific S26 Ultra features without hallucinating. Third comes the actual conversation — the user's messages and the assistant's prior replies.

The function returns only the assistant's text reply to the frontend. The API key, the system prompt, and the manual context never leave the server. This matters both for security and for preventing users from extracting or modifying the assistant's instructions.

Conversation history is stored in the browser (in memory only, cleared on page reload) rather than on a server. This is deliberate — there is no user account system, no database, and no tracking. The chat is ephemeral by design, which fits the gentle, low-pressure tone of the rest of the guidebook.

---

## 🧭 Adding or editing content

Most changes to this project will be content changes rather than code changes. The common edits follow a predictable pattern.

To change the welcome message, edit `public/index.html` directly. The copy is in Thai and lives in semantic HTML — there is no templating layer to fight with. To add a new topic to the manual browser, add an entry to `src/content/manual.json` with a category, title, body, and optional iPhone-comparison note; the search index rebuilds automatically when the page loads. To adjust the assistant's behavior, edit `src/content/system-prompt.md` — even small tone changes here ripple through every conversation.

To change the visual language, most adjustments happen in `public/styles/tokens.css`, which centralizes colors, spacing, and typography as CSS custom properties. Changing a single token value updates every component that uses it.

---

## 🛡️ Privacy and safety

No user data is collected, stored, or transmitted to third parties beyond what is required for a chat turn to reach Anthropic's API. There is no analytics script, no tracking pixel, no cookie banner because there are no cookies to warn about. Chat history exists only in the user's browser tab and disappears when the tab closes.

The serverless function includes basic abuse protections — a maximum message length, a maximum conversation length, and a rate limit per IP — to keep API costs predictable if the site is ever shared more widely than intended.

---

## 🌱 Roadmap ideas

This project is intentionally scoped small, but a few extensions would be natural additions if the core experience proves useful. A voice-input button on the chat interface would lower the friction of typing Thai on a touchscreen keyboard. A "show me" mode that walks through a feature with annotated screenshots would help for visual learners. A seasonal theming system could refresh the palette for Songkran, Loy Krathong, or the new year without touching component code.

None of these are planned yet. The first version is meant to do one thing well: make her feel welcomed into her new phone.

---

## 📜 License

This is a personal project built as a gift. The code is shared under the MIT License; the manual content remains the property of Samsung Electronics and is used here under fair use for personal, non-commercial reference.

---

## 💌 Acknowledgments

Built with care for someone who deserves technology that meets her where she is, not where it wishes she would be. Thanks to Anthropic for the Claude API, to Netlify for making serverless deployment boring in the best possible way, and to the Thai type design community for making beautiful fonts that render this guidebook with the warmth it needs.
