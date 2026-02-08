# AI Video Editing Platform - PHASE 0 MVP Strategy

**Tarih:** 8 Şubat 2026  
**Hedef:** Doğrulama odaklı, minimum viable product  
**Zaman Çerçevesi:** 2-3 hafta MVP, ardından erken kullanıcı testi

---

## PHASE 0 MVP - Kapsamı

### ✅ Yapılacak (MVP)

**1. Web Interface**
- Minimal, clean UI
- Video upload (no processing)
- Text/voice command input area
- Edit plan output display
- Export (JSON, PDF, text)

**2. AI Command Interpreter**
- LLM integration (OpenAI API)
- Structured prompt engineering
- Command parsing
- Constraint validation (asset library only)

**3. Edit Plan Generator**
- Timeline-based output
- Caption suggestions
- Asset recommendations
- Animation presets
- Style decisions

**4. Asset Library (Static)**
- Predefined animations
- Caption styles
- Transition presets
- Motion templates
- (No custom generation)

**5. User System**
- Simple auth (email/password or OAuth)
- Subscription tiers
- Usage tracking
- API key management

**6. Monetization**
- Stripe integration
- Free tier (5 edit plans/month)
- Pro tier ($19/month, unlimited)
- Team tier ($49/month, 3 users)

### ❌ Yapılmayacak (PHASE 1+)

- Real video rendering
- Timeline UI manipulation
- Video processing
- Auto-captions (real)
- Custom animations
- Advanced effects
- Collaboration features
- Mobile app

---

## Technical Architecture

### Stack Selection

**Frontend:**
- React 19 (fast, familiar)
- TypeScript
- Tailwind CSS
- Zustand (state)
- React Query (API)

**Backend:**
- Node.js + Express
- PostgreSQL (user data, plans)
- Redis (rate limiting)
- OpenAI API (LLM)

**Hosting:**
- Vercel (frontend)
- Railway/Render (backend)
- AWS S3 (plan storage)

**Why this stack?**
- Fast iteration
- Minimal DevOps
- Scalable
- Cost-effective
- No video processing overhead

---

## MVP Feature Breakdown

### Feature 1: Command Input

**User inputs:**
```
"Cut this scene from 0:12 to 0:18"
"Add bold, yellow captions for the dialogue"
"Show a flight animation from Istanbul to Antalya"
"Make it energetic with fast cuts"
```

**AI processes:**
- Parses command
- Maps to predefined actions
- Validates against asset library
- Generates structured edit plan

### Feature 2: Edit Plan Output

**Example output (JSON):**
```json
{
  "plan_id": "uuid",
  "title": "User's Video Edit",
  "scenes": [
    {
      "id": "scene_1",
      "start_time": "0:00",
      "end_time": "0:12",
      "action": "KEEP",
      "notes": "Intro scene"
    },
    {
      "id": "scene_2",
      "start_time": "0:12",
      "end_time": "0:18",
      "action": "CUT",
      "reason": "User requested cut"
    }
  ],
  "captions": [
    {
      "time": "0:20",
      "text": "This is amazing!",
      "style": "bold_yellow_high_contrast",
      "duration": "3s"
    }
  ],
  "animations": [
    {
      "type": "flight_map",
      "from": "Istanbul",
      "to": "Antalya",
      "duration": "2.5s",
      "timing": "ease-in-out"
    }
  ],
  "export_formats": ["json", "pdf", "text"]
}
```

### Feature 3: Asset Library

**Predefined assets (static JSON):**
```json
{
  "animations": {
    "flight_map": {...},
    "text_pop": {...},
    "fade_transition": {...}
  },
  "caption_styles": {
    "bold_yellow": {...},
    "neon_pink": {...},
    "minimal_white": {...}
  },
  "motion_presets": {
    "fast_cuts": {...},
    "smooth_pan": {...},
    "energetic_zoom": {...}
  }
}
```

---

## AI Prompt Engineering Strategy

### System Prompt (Simplified)

```
You are a creative director for social media video editing.
Your job is to convert user commands into structured edit plans.

CONSTRAINTS:
- Only use predefined assets (animations, captions, transitions)
- Do NOT invent custom visuals
- Do NOT hallucinate effects
- Output ONLY valid JSON structures
- Validate all references against the asset library

USER COMMAND: [user input]
ASSET LIBRARY: [available assets]

Generate a structured edit plan in JSON format.
```

### Prompt Refinement

- Test with 10-20 real user commands
- Iterate on output format
- Add guardrails for invalid requests
- Create fallback responses

---

## User Workflow (MVP)

1. **Sign up** → Email/password or Google OAuth
2. **Upload video** (metadata only, no processing)
3. **Write command** → "Cut this scene, add captions, make it energetic"
4. **AI generates plan** → 5-10 seconds
5. **Review plan** → JSON/PDF/text
6. **Export** → Copy to clipboard, download, or email
7. **Use elsewhere** → Send to editor, use as reference, etc.

---

## Monetization Strategy (PHASE 0)

### Pricing Tiers

| Feature | Free | Pro | Team |
|---------|------|-----|------|
| Edit plans/month | 5 | Unlimited | Unlimited |
| Export formats | JSON | JSON + PDF + Text | All |
| Team members | 1 | 1 | 3 |
| Priority support | ❌ | ✅ | ✅ |
| API access | ❌ | ✅ | ✅ |
| **Price** | **Free** | **$19/mo** | **$49/mo** |

### Revenue Projection (Conservative)

- **Month 1:** 100 signups, 5% conversion → $95/month
- **Month 2:** 300 signups, 8% conversion → $456/month
- **Month 3:** 1,000 signups, 10% conversion → $1,900/month
- **Month 6:** 5,000 signups, 12% conversion → $11,400/month

---

## Development Timeline

### Week 1: Foundation

- [ ] Project setup (React + Node)
- [ ] Database schema (users, plans, subscriptions)
- [ ] Auth system (email + OAuth)
- [ ] Basic UI layout

### Week 2: Core Features

- [ ] Video upload (metadata)
- [ ] Command input interface
- [ ] AI integration (OpenAI API)
- [ ] Edit plan generator
- [ ] JSON/PDF export

### Week 3: Polish & Launch

- [ ] Asset library (static JSON)
- [ ] Stripe integration
- [ ] Rate limiting
- [ ] Error handling
- [ ] Testing
- [ ] Deploy to production

### Week 4: Early Users

- [ ] Beta testing
- [ ] Feedback collection
- [ ] Iterate on AI prompts
- [ ] Monitor usage

---

## Success Metrics (PHASE 0)

### Week 1-2 (Internal Testing)

- ✅ AI generates valid edit plans
- ✅ Export works (JSON, PDF, text)
- ✅ Auth system functional
- ✅ No crashes

### Week 3-4 (Beta Users)

- ✅ 50+ beta signups
- ✅ 5+ paid conversions
- ✅ Average plan quality score > 7/10
- ✅ User feedback collected

### Month 2-3 (Growth)

- ✅ 500+ signups
- ✅ 50+ paid users
- ✅ $500+ MRR
- ✅ Product-market fit signals

---

## Risks & Mitigation

### Risk 1: AI Generates Invalid Plans

**Mitigation:**
- Strict prompt engineering
- Validation layer (check against asset library)
- Fallback responses
- Manual review option

### Risk 2: Low Adoption

**Mitigation:**
- Target influencers first (early adopters)
- Free tier generous (5 plans/month)
- Viral loop (share plans)
- Content marketing (TikTok editing tips)

### Risk 3: Scaling Costs (LLM API)

**Mitigation:**
- Rate limiting (free tier)
- Caching common commands
- Batch processing
- Monitor API spend closely

### Risk 4: Founder Burnout

**Mitigation:**
- MVP-only scope (no scope creep)
- Automate repetitive tasks
- Use no-code tools where possible
- Set hard deadlines

---

## Go-to-Market Strategy

### Phase 0 Launch (Week 4)

**Target Audience:**
- TikTok creators (100K-1M followers)
- YouTube Shorts editors
- Instagram Reels creators
- Beginner video editors

**Launch Channels:**
1. **ProductHunt** (Day 1)
2. **Twitter/X** (Thread + demo video)
3. **Reddit** (r/VideoEditing, r/Influencers)
4. **Direct outreach** (50 micro-influencers)

**Key Message:**
> "AI Creative Director for social media videos. Get professional edit plans in seconds. No editing skills needed."

### Early User Acquisition

- **Week 1:** 100 signups (ProductHunt + Twitter)
- **Week 2:** 200 signups (Reddit + word-of-mouth)
- **Week 3:** 300 signups (influencer mentions)
- **Week 4:** 500 signups (organic growth)

### Conversion Strategy

- Free tier: 5 plans/month (generous)
- Paywall: After 5 plans, show upgrade prompt
- Social proof: "500+ creators use EditAI"
- Trial: 7-day free Pro trial

---

## Next Steps (Immediate)

### This Week

1. ✅ Finalize technical architecture
2. ✅ Design database schema
3. ✅ Create UI mockups (Figma)
4. ✅ Write AI prompt templates
5. ✅ Set up development environment

### Next Week

1. Build auth system
2. Create basic UI
3. Integrate OpenAI API
4. Build edit plan generator
5. Test with sample commands

### Week 3

1. Add export functionality
2. Integrate Stripe
3. Build asset library UI
4. Polish and refine
5. Deploy MVP

---

## Critical Success Factors

1. **Speed:** MVP in 3 weeks, not 3 months
2. **Simplicity:** No video processing, just plans
3. **Validation:** Get paying users ASAP
4. **Founder health:** Sustainable pace, no burnout
5. **Iteration:** Listen to users, adapt quickly

---

## Conclusion

This PHASE 0 MVP is designed to:
- ✅ Validate market demand
- ✅ Generate early revenue ($500-1,000/month by month 3)
- ✅ Avoid technical overload
- ✅ Respect founder's time and energy
- ✅ Build foundation for PHASE 1 (real editing)

The key insight: **Users don't need video rendering. They need direction and structure.** AI provides that in seconds.

Let's build this.
