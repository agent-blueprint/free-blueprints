export const content = `---
name: employee-onboarding-automation
description: >-
  Implementation specification for Employee Onboarding Automation. 5 AI agents,
  Manager-Workers pattern, vendor-agnostic.
compatibility: Any coding agent (Claude Code, Codex, Cursor).
metadata:
  generated-by: agent-blueprint
  generated-at: "2026-04-08T00:00:00.000Z"
  blueprint-id: "free-employee-onboarding"
  target-platform: "vendor_agnostic"
  agent-count: "5"
  pattern: "Manager-Workers"
  investment-tier: "medium"
---

# Implementation Specification

> Automate the employee onboarding lifecycle with 5 AI agents in a Manager-Workers pattern. One orchestrator coordinates four specialized workers that handle document processing, IT provisioning, training assembly, and progress tracking. Vendor-agnostic. Phased rollout. Production-ready specification.

## Business Problem

Employee onboarding is broken at most organizations. The symptoms are predictable:

- **Slow ramp time.** New hires wait days or weeks for accounts, hardware, and access. Their first impression is sitting idle.
- **Inconsistent experience.** Onboarding quality depends on which manager or HR generalist handles it. Some new hires get a structured first week. Others get a laptop and a "good luck."
- **Manual tracking.** HR teams juggle spreadsheets, email threads, and tribal knowledge to track who has completed what. Things fall through the cracks constantly.
- **Compliance gaps.** Tax forms, NDAs, and mandatory training have hard deadlines. Manual processes miss them. The company eats the risk.
- **IT provisioning delays.** Account creation, software licenses, and access permissions require multiple teams and multiple tickets. Coordination overhead is enormous.

These problems scale linearly with headcount. A company hiring 50 people per quarter has 50 opportunities per quarter for something to go wrong.

## Solution Architecture

- **Platform:** Vendor-agnostic (adaptable to any HR, IT, or workflow platform)
- **Pattern:** Manager-Workers
- **Agents:** 5

| # | Agent | Role | Type |
|---|-------|------|------|
| 1 | Onboarding Orchestrator | Coordinates full onboarding lifecycle, manages task dependencies, tracks completion, escalates blockers | Manager |
| 2 | Document Processor | Collects, validates, and processes new hire documentation (tax forms, ID verification, benefits enrollment, NDAs) | Worker |
| 3 | IT Provisioning Coordinator | Provisions accounts, hardware, software licenses, access permissions, and environment setup | Worker |
| 4 | Training Curriculum Assembler | Builds personalized training paths based on role, department, and experience level | Worker |
| 5 | Progress Tracker | Monitors onboarding milestones, generates status reports, identifies at-risk onboards, triggers reminders | Worker |

## Phase 1: Pilot

**Goal:** Validate the core pattern with the two highest-impact agents before investing in the full system.

**Duration:** 4 weeks

**Why these two agents first:** Document processing is the highest-volume, most error-prone part of onboarding. The orchestrator is required regardless. Together they prove the architecture works and deliver measurable value.

### Pilot Workstreams

1. **Week 1-2: Scaffold and integrate.** Deploy the Onboarding Orchestrator and Document Processor. Connect to the HR system's new-hire event trigger. Wire up document collection and validation workflows.
2. **Week 2-3: Run parallel.** Process real new hires through both the automated system and the existing manual process. Compare results side by side.
3. **Week 3-4: Measure and decide.** Collect metrics against the decision gate criteria below. Present findings to stakeholders.

### Decision Gate Criteria

The pilot passes if ALL of the following are met:

- Document processing accuracy > 95% (first-pass completion without human correction)
- Time from new-hire event to document completion reduced by > 50% vs. manual baseline
- Zero compliance gaps (no missed deadlines for required documents)
- No critical errors requiring manual intervention more than once per 20 onboards

### Exit Criteria

- Stakeholder sign-off on pilot metrics
- Architecture validated for adding additional workers
- Integration patterns documented for reuse in Phase 2

## Phase 2: Full Implementation

**Duration:** 6 weeks

**Scope:** Add the remaining three workers to the validated architecture.

1. **IT Provisioning Coordinator** (Weeks 1-3): Account creation, hardware assignment, software licensing, access permissions. Integrates with identity management and IT service management systems.
2. **Training Curriculum Assembler** (Weeks 2-4): Personalized training path generation based on role, department, seniority, and compliance requirements. Integrates with learning management systems.
3. **Progress Tracker** (Weeks 3-6): Real-time milestone monitoring, at-risk identification, automated reminders, and status reporting for HR and hiring managers.

Workers are deployed incrementally. Each new worker is validated independently before the next begins.

## Agent Specifications Summary

1. **Onboarding Orchestrator** - Manager agent that coordinates the full onboarding lifecycle from new-hire event to Day 90 completion.
2. **Document Processor** - Collects, validates, and routes all required new-hire documentation with compliance deadline enforcement.
3. **IT Provisioning Coordinator** - Provisions accounts, hardware, software, and access permissions with Day 1 readiness as the target.
4. **Training Curriculum Assembler** - Builds role-specific, department-aware training paths and tracks module completion.
5. **Progress Tracker** - Monitors all onboarding milestones, flags at-risk onboards, and generates status reports for stakeholders.

Full specifications including tools, data contracts, and success metrics: \`references/agent-specifications.md\`

## Risk & Governance Summary

### Top 3 Technical Risks

1. **Integration fragility.** HR, IT, and document systems have different APIs, data formats, and reliability characteristics. A single integration failure can stall an entire onboarding.
2. **PII exposure.** Onboarding involves SSNs, government IDs, bank account details, and medical information. Every data flow is a potential leak.
3. **State synchronization.** Five agents operating on overlapping data create race conditions and consistency risks. The orchestrator must be the single source of truth.

### Top 3 Business Risks

1. **Employee experience degradation.** Automation that feels robotic or impersonal can make onboarding worse, not better. Human touchpoints must be preserved for high-impact moments.
2. **Compliance liability.** Automated document processing that misses a required form or accepts an invalid one creates legal exposure.
3. **Change management resistance.** HR teams and hiring managers have established workflows. Forcing adoption without demonstrating value creates friction and workarounds.

Full risk analysis, escalation rules, and governance framework: \`references/guardrails-and-governance.md\`

## How to Use This Spec

1. Read this file top to bottom to understand the architecture and phasing.
2. Read \`GETTING-STARTED.md\` for implementation instructions.
3. Read \`references/agent-specifications.md\` for detailed agent definitions, tools, and data contracts.
4. Read \`references/platform-connectivity.md\` to plan your integrations.
5. Use \`implementation-state.yaml\` to track your build progress as you go.

---

Generated by [Agent Blueprint](https://agentblueprint.ai) - Free Community Blueprint
`;
