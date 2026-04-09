export const content = `---
name: rfx-procurement-automation
description: >-
  Implementation specification for RFx Procurement Automation. 5 AI agents,
  Manager-Workers pattern, vendor-agnostic.
compatibility: Any coding agent (Claude Code, Codex, Cursor).
metadata:
  generated-by: agent-blueprint
  generated-at: "2026-04-08T00:00:00.000Z"
  blueprint-id: "free-rfx-procurement"
  target-platform: "vendor_agnostic"
  agent-count: "5"
  pattern: "Manager-Workers"
  investment-tier: "medium"
---

# Implementation Specification

> Automate RFx procurement response workflows with 5 AI agents in a Manager-Workers pattern. One orchestrator coordinates four specialized workers to parse requirements, match existing content, compose responses, and validate compliance. Phased rollout starts with a 2-agent pilot and expands to the full team after validation.

## Business Problem

Organizations responding to RFx documents (RFPs, RFQs, RFIs) face compounding inefficiencies:

- **Manual response assembly.** Subject matter experts spend 60-80% of their time on repetitive copy-paste from previous responses rather than crafting tailored answers.
- **Missed deadlines.** Complex RFx documents contain dozens of embedded deadlines, sub-deadlines, and conditional timelines. Manual tracking leads to late submissions and disqualification.
- **Inconsistent quality.** Different team members produce responses with varying levels of detail, tone, and accuracy. Win rates suffer when evaluators see uneven quality across sections.
- **Compliance gaps.** Mandatory requirements buried in dense documents get overlooked. A single missed "shall" statement can disqualify an otherwise strong submission.
- **Knowledge fragmentation.** Reusable content lives across shared drives, wikis, past submissions, and individual inboxes. Finding the best existing answer takes longer than writing a new one.

## Solution Architecture

- **Platform:** Vendor-agnostic (deployable on any enterprise automation platform or custom stack)
- **Pattern:** Manager-Workers
- **Agents:** 5

| # | Agent | Role | Type |
|---|-------|------|------|
| 1 | RFx Orchestrator | Routes RFx documents, coordinates workers, enforces approval gates, tracks completion | Manager |
| 2 | Requirements Analyzer | Parses documents, extracts and categorizes requirements, identifies deadlines | Worker |
| 3 | Content Library Matcher | Searches knowledge base for reusable content, scores relevance, identifies gaps | Worker |
| 4 | Response Composer | Assembles draft responses, generates new content for gaps, maintains formatting | Worker |
| 5 | Compliance Validator | Cross-checks against mandatory requirements, validates formatting, flags gaps | Worker |

## Phase 1: Pilot

**Goal:** Prove that automated requirements extraction and orchestration routing work reliably before adding response generation.

**Duration:** 4 weeks

**Agents deployed:** RFx Orchestrator + Requirements Analyzer

### Pilot Workstreams

1. **Document intake pipeline.** Configure the Orchestrator to accept RFx documents from at least one intake channel (email, shared drive, or procurement portal). Validate that documents are correctly classified by type (RFP, RFQ, RFI).
2. **Requirements extraction.** Deploy the Requirements Analyzer against 5-10 historical RFx documents. Validate extracted requirements against human-annotated baselines.
3. **Categorization accuracy.** Verify that requirements are correctly categorized as mandatory, scored, or informational. Measure precision and recall against manual categorization.
4. **Deadline identification.** Confirm that all submission deadlines, Q&A periods, and milestone dates are correctly extracted and surfaced.
5. **Orchestrator routing.** Validate that the Orchestrator correctly assigns tasks, tracks status, and surfaces progress to stakeholders.

### Decision Gate Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Requirements extraction accuracy | > 90% recall, > 85% precision | Compare against human-annotated test set of 10 documents |
| Processing time reduction | > 40% faster than manual extraction | Time RFx intake-to-requirements-complete vs. manual baseline |
| Mandatory requirements missed | Zero | Cross-check extracted mandatory items against human review |
| Orchestrator routing accuracy | > 95% | Verify task assignments match expected worker for each requirement type |

### Exit Criteria

Phase 1 is complete when all four decision gate metrics are met across at least 5 real RFx documents processed end-to-end. Stakeholder sign-off required before proceeding to Phase 2.

## Phase 2: Full Implementation

**Duration:** 6 weeks

**Agents added:** Content Library Matcher, Response Composer, Compliance Validator

### Phase 2 Workstreams

1. **Knowledge base integration.** Connect the Content Library Matcher to organizational content repositories. Index and prepare content for semantic search.
2. **Content matching calibration.** Tune relevance scoring against a test set of requirements with known best-match content. Target > 80% average relevance score for top-3 matches.
3. **Response composition.** Deploy the Response Composer to assemble draft responses from matched content. For gaps where no existing content matches, generate new draft content flagged for SME review.
4. **Compliance validation.** Deploy the Compliance Validator to cross-check every draft response against the full requirements set. Validate formatting rules (page limits, font requirements, section structure).
5. **End-to-end integration.** Run the full 5-agent pipeline against 3-5 real RFx documents. Measure end-to-end processing time, response completeness, and stakeholder satisfaction.
6. **Human-in-the-loop gates.** Configure approval checkpoints where human reviewers approve or revise draft responses before final submission.

## Agent Specifications Summary

- **RFx Orchestrator** (Manager): Single entry point for all RFx documents. Routes tasks to workers, tracks completion, enforces approval gates, and escalates blockers.
- **Requirements Analyzer** (Worker): Parses RFx documents to extract, categorize, and prioritize requirements. Identifies deadlines, constraints, and evaluation criteria.
- **Content Library Matcher** (Worker): Searches organizational knowledge bases for reusable content matching extracted requirements. Scores relevance and flags gaps needing original content.
- **Response Composer** (Worker): Assembles draft responses from matched content and generates new content for gaps. Maintains consistent tone, formatting, and compliance with document structure requirements.
- **Compliance Validator** (Worker): Final quality gate. Cross-checks every response section against mandatory requirements, validates formatting rules, and flags incomplete or non-compliant sections.

Full tool definitions, data contracts, and escalation rules: \`references/agent-specifications.md\`

## Risk & Governance Summary

### Top Technical Risks

1. **Low extraction accuracy on complex documents.** Highly formatted or image-heavy RFx documents may resist automated parsing. Mitigation: support multiple document formats, fall back to OCR, and flag low-confidence extractions for human review.
2. **Content library staleness.** Matched content from the knowledge base may be outdated or no longer accurate. Mitigation: track content age, flag matches older than a configurable threshold, require SME verification for stale content.
3. **Response hallucination.** Generated content for gaps may include fabricated claims, statistics, or commitments. Mitigation: all generated content must be flagged for human review, never auto-submitted.

### Top Business Risks

1. **Unauthorized submission.** An automated response submitted without proper review could contain errors or unauthorized commitments. Mitigation: mandatory human approval gate before any submission.
2. **Confidentiality breach.** RFx documents and responses contain sensitive business information. Mitigation: enforce access controls, document classification, and audit logging on all agent actions.
3. **Over-reliance on automation.** Teams may reduce SME involvement prematurely, degrading response quality. Mitigation: track SME review rates and response win rates as leading indicators.

Full risk register, escalation rules, and governance framework: \`references/guardrails-and-governance.md\`

## How to Use This Spec

1. **Read this document first.** It provides the architecture overview, phased approach, and success criteria.
2. **Review the agent specifications.** Open \`references/agent-specifications.md\` for detailed tool definitions, data contracts, and escalation rules for each agent.
3. **Understand the platform connectivity requirements.** Open \`references/platform-connectivity.md\` to plan integrations with your document intake, knowledge base, and notification systems.
4. **Follow the getting-started guide.** Open \`GETTING-STARTED.md\` for step-by-step implementation instructions, starting with the Phase 1 pilot.
5. **Track progress in the implementation state file.** Update \`implementation-state.yaml\` as you complete each agent and integration milestone.

---

Generated by [Agent Blueprint](https://agentblueprint.ai) — Free Community Blueprint
`;
