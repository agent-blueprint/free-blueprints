export const content = `# Getting Started

**YOU ARE THE IMPLEMENTER.** This blueprint is written for a coding agent (you) to execute. The specification describes what to build. Your job is to build it on the target platform, adapting the architecture to the platform's specific capabilities and constraints.

## Ground Rules

- **Do not summarize this blueprint back to the user.** They already know what it says. Build things.
- **Do not ask unnecessary questions.** If a decision can be made from the spec, make it. Only ask when the spec is genuinely ambiguous or when you need platform credentials.
- **Act, then report.** Build the component, then tell the user what you built and what decisions you made. Do not present a plan and wait for approval unless the decision is irreversible.
- **Be decisive.** When the spec offers multiple valid approaches, pick the one that best fits the target platform and move forward. Document your reasoning in code comments.
- **Verify before presenting.** Test what you build. Do not mark something complete until you have confirmed it works.

## Step 1: Understand the Architecture

Read these files in order:

1. \`SKILL.md\` -- Architecture overview, agent roles, phased rollout plan, success criteria.
2. \`references/agent-specifications.md\` -- Detailed tool definitions, input/output contracts, escalation rules for all 5 agents.
3. \`references/architecture-decisions.md\` -- Why the architecture is structured this way. Read this to avoid re-litigating settled decisions.
4. \`AGENTS.md\` -- Inter-agent communication rules and coordination protocol.

Only drill into these when relevant to your current task:
- \`references/guardrails-and-governance.md\` -- Risk controls, approval gates, audit requirements.
- \`references/evaluation-criteria.md\` -- Specific metrics and measurement methodology for validation.
- \`references/platform-connectivity.md\` -- Integration patterns for document intake, knowledge base, notifications.
- \`references/business-context.md\` -- Business problem context and target outcomes.

## Step 2: Connect to the Target Platform

### Scenario A: Platform is ready and accessible

You have credentials and access to the target platform (e.g., an enterprise automation platform, a cloud environment, or a development server). Proceed directly to Step 3.

### Scenario B: Building on a custom stack

No enterprise platform. You are building agents as standalone services, scripts, or functions. Use the agent specifications as your interface contracts. Choose your own orchestration mechanism (message queue, HTTP APIs, function calls) and implement the tools defined in \`references/agent-specifications.md\`.

### Scenario C: Unsure about the target

Ask the user one question: "Where should these agents run?" Their answer determines your approach. Common options:

- An enterprise automation platform with agent/workflow capabilities
- A cloud environment (AWS, GCP, Azure) with serverless functions or containers
- A local development environment for prototyping
- A custom application backend

Once you know the target, map each agent's tools to the platform's native capabilities. The tool definitions in \`references/agent-specifications.md\` are platform-agnostic contracts. Your job is to implement them using whatever the platform provides.

## Step 3: Build and Validate the Pilot

### Phase A: Scaffold the orchestration layer

1. Create the RFx Orchestrator agent with its core routing logic. It needs to accept an RFx document, classify it by type (RFP/RFQ/RFI), and create a tracking record.
2. Implement the \`assign_rfx_task\` and \`check_completion_status\` tools.
3. Verify: submit a test document and confirm the Orchestrator creates a tracking record and attempts to route it.

### Phase B: Make the pilot real

1. Deploy the Requirements Analyzer with its \`parse_rfx_document\`, \`extract_requirements\`, \`categorize_requirements\`, and \`identify_deadlines\` tools.
2. Wire the Orchestrator to send documents to the Requirements Analyzer and receive structured results.
3. Test against 3-5 real or representative RFx documents. Compare extracted requirements against a human baseline.
4. Measure: extraction accuracy (recall > 90%), processing time reduction (> 40%), zero missed mandatory requirements.

### Phase C: Expand to the full team

Only proceed after Phase 1 decision gate criteria are met (see SKILL.md).

1. Deploy Content Library Matcher. Connect to the organizational knowledge base. Test content matching against known requirement-content pairs.
2. Deploy Response Composer. Wire it to receive matched content and requirement gaps from the Content Library Matcher. Test draft response generation.
3. Deploy Compliance Validator. Wire it as the final gate before human review. Test against documents with known compliance issues.
4. Run the full 5-agent pipeline end-to-end on 3-5 real RFx documents.

## Step 4: Validate

Test the system programmatically, not just by inspection.

- Write automated tests for each agent's core tools against known inputs and expected outputs.
- Run the full pipeline against a test set and measure against the evaluation criteria in \`references/evaluation-criteria.md\`.
- Pay special attention to: mandatory requirement coverage (must be 100%), compliance check accuracy (> 98%), and content relevance scoring (> 80% average).
- Document any metrics that fall below target and the remediation plan.

## Step 5: Track Progress

Update \`implementation-state.yaml\` as you complete each milestone:

- Set each agent's status as you progress: \`not_started\` → \`in_progress\` → \`testing\` → \`live\`.
- Record the platform, version, and environment details.
- Log integration endpoints as they are configured.
- Note any deviations from the spec and the reasoning behind them.

This file is your single source of truth for implementation progress. Keep it current.

---

These free blueprints cover generic processes. For blueprints tailored to your company, your systems, your data, your org structure, and your financials, visit https://app.agentblueprint.ai
`;
