# EditAI - Complete Setup & Deployment Guide

## Quick Start

```bash
# 1. Clone/setup
git clone <repo> editai
cd editai

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your API keys

# 4. Database setup
npm run db:push

# 5. Start development
npm run dev

# 6. Open browser
http://localhost:3000
```

---

## Project Structure

```
editai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── services/
│   ├── package.json
│   └── server.ts
├── database/
│   ├── schema.sql
│   └── migrations/
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## Technology Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **AI:** OpenAI API (GPT-4)
- **Auth:** JWT + bcrypt
- **Payments:** Stripe
- **Hosting:** Vercel (frontend) + Railway/Render (backend)

---

## Environment Variables

```env
# Frontend
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/editai
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
NODE_ENV=development
PORT=5000
```

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Edit Plans
CREATE TABLE edit_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255),
  video_title VARCHAR(255),
  command TEXT,
  plan_json JSONB,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  tier VARCHAR(50),
  status VARCHAR(50),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Edit Plans
- `POST /api/plans/generate` - Generate edit plan from command
- `GET /api/plans` - List user's plans
- `GET /api/plans/:id` - Get plan details
- `DELETE /api/plans/:id` - Delete plan
- `POST /api/plans/:id/export` - Export plan (JSON/PDF)

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/upgrade` - Upgrade to Pro
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/webhook/stripe` - Stripe webhook

### AI
- `POST /api/ai/interpret` - Interpret user command
- `POST /api/ai/validate` - Validate edit plan

---

## Key Features Implementation

### 1. Command Interpreter (AI)

```typescript
// services/aiService.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function interpretCommand(
  command: string,
  assetLibrary: object
): Promise<EditPlan> {
  const systemPrompt = `You are a creative director for social media video editing.
Convert user commands into structured edit plans.
ONLY use assets from the provided library.
Output ONLY valid JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Command: "${command}"\n\nAsset Library: ${JSON.stringify(assetLibrary)}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || "{}");
}
```

### 2. Edit Plan Generator

```typescript
// services/planService.ts
export interface EditPlan {
  plan_id: string;
  title: string;
  scenes: Scene[];
  captions: Caption[];
  animations: Animation[];
  transitions: Transition[];
  export_formats: string[];
}

export interface Scene {
  id: string;
  start_time: string;
  end_time: string;
  action: "KEEP" | "CUT" | "TRIM" | "SLOW" | "SPEED";
  reason?: string;
}

export interface Caption {
  id: string;
  time: string;
  text: string;
  style: string;
  duration: string;
}

export interface Animation {
  id: string;
  type: string;
  duration: string;
  timing: string;
  properties: Record<string, any>;
}

export interface Transition {
  id: string;
  type: string;
  duration: string;
}
```

### 3. Asset Library (Static)

```typescript
// data/assetLibrary.ts
export const ASSET_LIBRARY = {
  animations: {
    flight_map: {
      id: "flight_map",
      name: "Flight Map Animation",
      description: "Shows flight path on world map",
      duration: "2.5s",
      properties: {
        from: "string",
        to: "string",
        timing: "ease-in-out",
      },
    },
    text_pop: {
      id: "text_pop",
      name: "Text Pop",
      description: "Text pops in with scale animation",
      duration: "0.5s",
      properties: {
        scale_from: 0,
        scale_to: 1,
      },
    },
    fade_transition: {
      id: "fade_transition",
      name: "Fade Transition",
      description: "Fade between scenes",
      duration: "0.5s",
    },
  },
  caption_styles: {
    bold_yellow: {
      id: "bold_yellow",
      name: "Bold Yellow",
      color: "#FFD700",
      weight: "bold",
      background: "rgba(0,0,0,0.7)",
      size: "24px",
    },
    neon_pink: {
      id: "neon_pink",
      name: "Neon Pink",
      color: "#FF1493",
      weight: "bold",
      background: "rgba(0,0,0,0.8)",
      size: "28px",
    },
    minimal_white: {
      id: "minimal_white",
      name: "Minimal White",
      color: "#FFFFFF",
      weight: "normal",
      background: "transparent",
      size: "20px",
    },
  },
  motion_presets: {
    fast_cuts: {
      id: "fast_cuts",
      name: "Fast Cuts",
      description: "Quick, energetic cuts",
      cut_duration: "0.2s",
      transition_duration: "0.1s",
    },
    smooth_pan: {
      id: "smooth_pan",
      name: "Smooth Pan",
      description: "Smooth camera pans",
      duration: "2s",
      timing: "ease-in-out",
    },
  },
};
```

### 4. Subscription System

```typescript
// services/subscriptionService.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function createCheckoutSession(
  userId: string,
  tier: "pro" | "team"
): Promise<string> {
  const prices = {
    pro: "price_1234567890",
    team: "price_0987654321",
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: prices[tier],
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    metadata: {
      userId,
      tier,
    },
  });

  return session.url || "";
}

export async function handleStripeWebhook(
  event: Stripe.Event
): Promise<void> {
  switch (event.type) {
    case "customer.subscription.updated":
      // Update subscription status
      break;
    case "customer.subscription.deleted":
      // Cancel subscription
      break;
  }
}
```

### 5. Frontend Components

```typescript
// components/CommandInput.tsx
import { useState } from "react";
import { useEditPlan } from "../hooks/useEditPlan";

export function CommandInput() {
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { generatePlan } = useEditPlan();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await generatePlan(command);
      setCommand("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Describe your video edit... e.g., 'Cut this scene, add bold yellow captions, make it energetic'"
          className="flex-1 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !command.trim()}
          className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate Plan"}
        </button>
      </div>
    </form>
  );
}
```

```typescript
// components/EditPlanDisplay.tsx
import { EditPlan } from "../types";

export function EditPlanDisplay({ plan }: { plan: EditPlan }) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{plan.title}</h2>

      {/* Scenes */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Scenes</h3>
        <div className="space-y-3">
          {plan.scenes.map((scene) => (
            <div key={scene.id} className="p-4 bg-gray-50 rounded border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {scene.start_time} → {scene.end_time}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{scene.action}</p>
                </div>
                {scene.reason && (
                  <p className="text-sm text-gray-500">{scene.reason}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Captions */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Captions</h3>
        <div className="space-y-3">
          {plan.captions.map((caption) => (
            <div key={caption.id} className="p-4 bg-gray-50 rounded border">
              <p className="font-medium">{caption.text}</p>
              <p className="text-sm text-gray-600 mt-1">
                {caption.time} ({caption.duration}) - {caption.style}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Export */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Export JSON
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Export PDF
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Copy Text
        </button>
      </div>
    </div>
  );
}
```

---

## Deployment

### Frontend (Vercel)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
# https://vercel.com/new

# 3. Set environment variables in Vercel dashboard
VITE_API_URL=https://editai-api.railway.app
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### Backend (Railway)

```bash
# 1. Create Railway project
# https://railway.app

# 2. Connect GitHub repo
# 3. Set environment variables
DATABASE_URL=postgresql://...
JWT_SECRET=...
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...

# 4. Deploy
git push origin main
```

### Database (Railway PostgreSQL)

```bash
# 1. Add PostgreSQL plugin in Railway
# 2. Get connection string
# 3. Run migrations
npm run db:push
```

---

## Pricing Tiers

| Feature | Free | Pro | Team |
|---------|------|-----|------|
| Edit plans/month | 5 | Unlimited | Unlimited |
| Export formats | JSON | JSON + PDF + Text | All |
| Team members | 1 | 1 | 3 |
| Priority support | ❌ | ✅ | ✅ |
| API access | ❌ | ✅ | ✅ |
| **Price** | **Free** | **$19/mo** | **$49/mo** |

---

## Success Metrics

- Week 1: 100 signups
- Week 2: 200 signups
- Week 3: 500 signups
- Month 1: 5% → Pro conversion = $95/month
- Month 3: 10% → Pro conversion = $1,900/month

---

## Next Steps

1. Set up GitHub repo
2. Configure environment variables
3. Deploy frontend to Vercel
4. Deploy backend to Railway
5. Set up Stripe webhooks
6. Launch on ProductHunt
7. Iterate based on user feedback

---

## Support

For issues or questions, refer to:
- GitHub Issues: https://github.com/editai/editai/issues
- Documentation: https://docs.editai.com
- Discord: https://discord.gg/editai
