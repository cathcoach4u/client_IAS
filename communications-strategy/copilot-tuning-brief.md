# Copilot Tuning Brief: Why It Beats a Custom Communications Agent for IAS

## The Core Question

Jo wants IAS to have consistent, on-brand email communications company-wide. Two options:

1. **Custom communications agent** (what was previously built)
2. **Configure Copilot to enforce IAS's style** (recommended)

## Why Copilot Tuning Wins

| Factor | Custom Agent | Copilot Tuning |
|--------|-------------|----------------|
| **Email creation** | Separate tool - users must copy/paste into Outlook | Native in Outlook - drafts emails directly in compose window |
| **Maintenance** | You maintain it | Microsoft maintains it |
| **Integration** | Limited - doesn't connect to calendar, files, contacts | Full Microsoft 365 integration (emails, files, calendar, contacts) |
| **Scalability** | Must be deployed/managed per user | Assign a licence, done |
| **Cost** | Development + ongoing maintenance + AI API fees | Already included in Copilot subscription IAS pays for |
| **Updates** | You build new features | Microsoft ships improvements automatically |
| **Tone control** | Hardcoded rules, less flexible | Flexible - users can adjust per context while staying on-brand |

## What Copilot Tuning Is

Microsoft's upcoming feature (early access ~April 2026, GA expected later in 2026) that lets organisations fine-tune Copilot's AI on their own data. Specifically, the **Style Editing agent template**:

- You provide **~20 high-quality writing samples** that represent IAS's ideal communication style
- You provide a **comprehensive style guide** (tone, terminology, formatting rules)
- Copilot learns IAS's voice through supervised learning
- After tuning, **every AI-generated email automatically sounds like IAS** - no extra prompts needed
- The tuned model is private to IAS's tenant - data stays secure

## What IAS Can Do Right Now (Before Tuning Is Available)

### Quick Win 1: Outlook Draft Instructions
Every user can set persistent drafting preferences in Outlook's Copilot settings. Example:

> "Write emails in a warm, professional tone. Use plain language - avoid insurance jargon. Keep paragraphs to 2-3 sentences. Use bullet points for complex information. Always include a greeting using the recipient's first name. Close with 'Kind regards' followed by the IAS signature block."

Once saved, Copilot applies this to every email draft automatically.

### Quick Win 2: Prompt Template Library
Create a shared set of ready-to-use prompts for common IAS communications:

- **Claims acknowledgment email:** "Draft a response to [client] acknowledging their claim for [type]. Tone: empathetic, reassuring. Include next steps and expected timeline."
- **Policy renewal reminder:** "Draft a renewal reminder to [client] for their [policy type] expiring on [date]. Tone: helpful, clear. Include call to action to schedule a review."
- **Internal update:** "Draft a team update about [topic]. Tone: clear, concise. Use bullet points for key actions."

### Quick Win 3: Organisation-Wide Default Tone
Microsoft is rolling out admin capability to set a tenant-wide default tone for Copilot. An admin can define "warm and professional" as the baseline and all AI-drafted content matches that tone by default.

## What IAS Needs to Prepare

To be ready for Copilot Tuning when it launches:

1. **Collect 20+ writing samples** - best client emails, well-crafted internal comms, policy explanations that capture IAS's ideal voice
2. **Create a style guide** covering:
   - Tone (e.g., "warm, reassuring, professional")
   - Vocabulary (preferred terms, terms to avoid)
   - Formatting (bullet points, paragraph length, greetings, sign-offs)
   - Compliance requirements (disclaimers, regulatory language)
3. **Identify a champion** - someone (likely Leah) to manage the tuning process and test outputs

## The Bottom Line

IAS is already paying for Copilot. Building a separate communications agent means paying twice for the same outcome, with inferior integration and ongoing maintenance burden. The smart move is to make Copilot work in IAS's voice - which is exactly what Microsoft is building tools to do.

**For April-June:** Use Draft Instructions + prompt templates for immediate consistency.
**From July onwards:** Adopt Copilot Tuning when available for deep, permanent brand voice alignment.
