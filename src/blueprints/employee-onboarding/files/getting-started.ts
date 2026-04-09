export const content = `# Getting Started

**YOU ARE THE IMPLEMENTER.** This blueprint is your specification. You are a coding agent building employee onboarding automation for an organization. The spec tells you what to build. You decide how to build it on whatever platform you are working with.

## Ground Rules

- **Do not summarize this document back to the user.** Read it, internalize it, act on it.
- **Do not ask unnecessary questions.** If the spec provides enough information to proceed, proceed. Ask only when you genuinely cannot infer the answer.
- **Act, then report.** Build the thing first. Explain what you built after.
- **Be decisive.** When the spec gives you a choice, make it. Do not present options and wait. Pick the best one and move.
- **Verify before presenting.** Test your work programmatically. Do not hand the user something you have not validated.

## Step 1: Understand the Architecture

Read these files in order:

1. \`SKILL.md\` - Architecture overview, phasing, agent summary
2. \`references/agent-specifications.md\` - Detailed agent definitions, tools, data contracts, success metrics
3. \`references/architecture-decisions.md\` - Why this architecture, why these trade-offs
4. \`references/guardrails-and-governance.md\` - Risk categories, escalation rules, PII handling
5. \`references/platform-connectivity.md\` - Integration points and patterns

Do not skim. These files contain specific tool definitions, data contracts, and escalation rules that you will implement directly.

## Step 2: Connect to the Target Platform

You are in one of three scenarios:

### A) Platform is ready and accessible

You have credentials, API access, or an SDK for the target platform (HR system, IT service management, workflow engine). Connect to it. Read its schema. Map the blueprint's agent definitions to the platform's native constructs.

### B) Building on custom code

No enterprise platform. You are building agents in code (Python, TypeScript, etc.) with direct API integrations. Use the agent specifications as your class/module definitions. Implement tools as functions. Wire up the orchestrator as the entry point.

### C) Unsure what platform to use

Read \`references/platform-connectivity.md\` for the integration categories you will need. Pick a platform or stack that covers HR system integration, identity management, document management, IT service management, and a learning management system. Or build incrementally: start with the pilot (orchestrator + document processor) and expand your platform choices as you learn.

Regardless of scenario: the orchestrator is triggered by a new-hire event from the HR system. That integration is your first technical task.

## Step 3: Build and Validate the Pilot

Follow the phased approach. Do not build all five agents at once.

### Phase A: Scaffold the orchestration

1. Implement the Onboarding Orchestrator with its four tools: \`create_onboarding_case\`, \`assign_task\`, \`check_milestone_status\`, \`escalate_blocker\`.
2. Implement the Document Processor with its four tools: \`collect_document\`, \`validate_document\`, \`process_tax_forms\`, \`verify_identity\`.
3. Wire the orchestrator to receive new-hire events and delegate document collection to the Document Processor.
4. Implement the message format and retry policy defined in \`AGENTS.md\`.

### Phase B: Make the pilot real

1. Connect to actual data sources: HR system for new-hire records, document storage for form templates, e-signature service for collection.
2. Run a test onboarding end-to-end. Verify every document type is collected, validated, and stored correctly.
3. Verify escalation works: simulate a failed identity verification and confirm it routes to a human reviewer.
4. Measure against the pilot decision gate criteria in \`SKILL.md\`.

### Phase C: Expand to full implementation

Once the pilot passes its decision gate:

1. Add the IT Provisioning Coordinator. Test account creation, hardware assignment, and access provisioning independently before connecting to the orchestrator.
2. Add the Training Curriculum Assembler. Verify it generates role-appropriate training paths.
3. Add the Progress Tracker. Verify milestone monitoring, at-risk detection, and reporting.
4. Run a full end-to-end onboarding with all five agents active.

## Step 4: Validate

Test programmatically against the metrics in \`references/evaluation-criteria.md\`:

- Document processing accuracy (target: > 98% first-pass completion)
- Time-to-productive reduction (target: > 30% vs. manual baseline)
- IT provisioning Day 1 readiness (target: > 95% of new hires)
- Compliance completion within 30 days (target: 100%)

Do not eyeball these. Write tests. Measure against real or realistic data. If a metric falls short, diagnose and fix before moving on.

## Step 5: Track Progress

Update \`implementation-state.yaml\` as you complete each agent and integration. This file is your build progress record. Keep it current so that anyone (human or agent) picking up this project knows exactly where things stand.

---

These free blueprints cover generic processes. For blueprints tailored to your company, your systems, your data, your org structure, your financials, visit https://app.agentblueprint.ai
`;
