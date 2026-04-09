export const content = `# Architecture Decisions

This document records the key architectural decisions for the RFx Procurement Automation system and the reasoning behind each.

---

## 1. Why Manager-Workers (not Pipeline or Peer-to-Peer)

**Decision:** Use a Manager-Workers pattern where the RFx Orchestrator (manager) coordinates all four worker agents.

**Alternatives considered:**

- **Pipeline pattern** (linear chain: Analyzer → Matcher → Composer → Validator). Simpler to implement, but too rigid. Real RFx processing is not strictly linear. The Compliance Validator may flag issues that require the Response Composer to revise, which may trigger additional Content Library Matcher searches. A pipeline cannot handle these feedback loops without becoming a tangled mess of backward references.
- **Peer-to-peer** (agents communicate directly with each other). Maximum flexibility, but creates coordination complexity that scales quadratically with agent count. Debugging becomes difficult because there is no single point where you can observe the full state of an RFx being processed. Error handling and retry logic would need to be duplicated in every agent.

**Why Manager-Workers wins:**

- The Orchestrator provides a single observation point for the entire RFx lifecycle. You can inspect one record to see what has happened, what is pending, and what has failed.
- Feedback loops are handled cleanly. The Orchestrator can re-route work to any agent at any stage without the agents needing to know about each other.
- Adding or replacing a worker does not affect other workers. Each worker only knows about the Orchestrator's task contract.
- The pattern maps naturally to enterprise automation platforms that support agent orchestration.

---

## 2. Why Phased Rollout

**Decision:** Deploy in two phases. Phase 1 (4 weeks): Orchestrator + Requirements Analyzer only. Phase 2 (6 weeks): add remaining 3 workers.

**Reasoning:**

- The Requirements Analyzer is the foundation. If it cannot reliably extract and categorize requirements, none of the downstream agents will produce useful results. Testing this in isolation avoids wasting effort on content matching and response generation that would be built on unreliable inputs.
- Phase 1 delivers standalone value. Even without automated response composition, structured requirements extraction with deadline tracking saves significant manual effort. Stakeholders see value immediately.
- The Phase 1 decision gate (90% extraction accuracy, 40% time reduction, zero missed mandatory requirements) provides a clear go/no-go signal. If these metrics are not met, it is better to iterate on the analyzer than to build more agents on a shaky foundation.
- Risk is contained. If the project is cancelled after Phase 1, the organization still has a working requirements extraction tool.

---

## 3. Orchestrator as Single Entry Point

**Decision:** All RFx documents enter the system through the Orchestrator. No direct access to worker agents.

**Reasoning:**

- Every RFx gets a tracking record from the moment it enters the system. No documents can be processed without an audit trail.
- The Orchestrator applies classification and routing logic before any work begins. This prevents workers from receiving documents they are not equipped to handle.
- Access control is centralized. The Orchestrator enforces who can submit documents and who can view results, rather than duplicating this logic in every worker.
- Rate limiting and prioritization happen at a single point. When multiple RFx documents arrive simultaneously, the Orchestrator decides processing order based on deadlines and priority.

---

## 4. Content Library as Shared Resource

**Decision:** The knowledge base is a shared resource accessed only by the Content Library Matcher, not duplicated or directly accessed by other agents.

**Reasoning:**

- The Content Library Matcher owns the search and relevance scoring logic. If the Response Composer also searched the knowledge base directly, relevance scoring would diverge between the two agents, producing inconsistent results.
- Centralizing knowledge base access makes it possible to track which content is being reused, how often, and with what relevance scores. This data drives knowledge base maintenance decisions (what to update, what to retire).
- When the knowledge base technology changes (e.g., switching from keyword search to vector search, or migrating from one content repository to another), only the Content Library Matcher needs to be updated. The Response Composer's interface remains stable.
- Content access patterns can be monitored and optimized in one place rather than across multiple agents.

---

## 5. Human-in-the-Loop Approval Gates

**Decision:** Mandatory human approval checkpoints at three points: Phase 1 exit, response review, and final submission.

**Where the gates are:**

1. **Phase 1 exit gate.** Before proceeding to Phase 2, a human reviews the decision gate metrics and signs off. This prevents expanding automation before the foundation is proven.
2. **Response review gate.** After the Response Composer produces a draft and before the Compliance Validator runs, a human SME reviews the content. This is where generated (non-reused) content gets verified.
3. **Final submission gate.** After compliance validation, before the response is submitted to the issuing organization. This is the last-look checkpoint where a human confirms the response is ready.

**Reasoning:**

- RFx responses create legal and financial commitments. Fully automated submission without human review is an unacceptable risk for most organizations.
- The approval gates are positioned to catch different types of issues: Phase 1 exit catches systemic problems, response review catches content accuracy issues, and final submission catches compliance and completeness issues.
- Gates are designed to be lightweight. The human reviewer sees a structured summary of what changed since the last gate, not the entire document. The system highlights generated content, flagged sections, and compliance results.
- Over time, as confidence in the system grows, organizations can choose to streamline gates (e.g., auto-approve when all content is reused and compliance is fully passing). But starting with explicit gates builds trust.

---

## 6. Stateless Workers with State in Orchestrator

**Decision:** Worker agents do not maintain state between tasks. All state lives in the Orchestrator's tracking records.

**Reasoning:**

- Stateless workers are simpler to deploy, scale, and replace. If a worker instance fails, a new instance can pick up the next task without needing to recover state.
- State in the Orchestrator means there is one place to inspect, debug, and audit. When something goes wrong, you look at the Orchestrator's tracking record, not at multiple worker internal states.
- Idempotency is easier to enforce when workers do not accumulate state. Reprocessing a task produces the same result regardless of what the worker has done previously.
- This pattern works equally well whether workers are deployed as separate processes, serverless functions, or agents on an enterprise platform. The deployment model does not affect the architecture.
- The tradeoff is that workers receive their full context with every task (they cannot "remember" previous work on the same RFx). For this use case, the context required per task is small enough that this is not a meaningful performance concern.
`;
