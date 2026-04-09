export const content = `# Architecture Decisions

Key design decisions for the Employee Onboarding Automation system, with rationale for each.

---

## Why Manager-Workers (Not Pipeline)

Onboarding is not a linear process. A pipeline pattern (Agent A finishes, passes to Agent B, passes to Agent C) would be wrong here because:

- **Tasks run in parallel.** Document collection, IT provisioning, and training path assembly are independent. They should start simultaneously when a new hire event arrives, not wait in sequence.
- **Task dependencies are a graph, not a chain.** Some tasks depend on others (access provisioning depends on account creation), but most are independent. A pipeline forces artificial sequencing.
- **Different tasks complete at different speeds.** Document collection depends on the new hire responding. IT provisioning depends on hardware stock. Training path generation is near-instant. A pipeline would bottleneck on the slowest step.

Manager-Workers is the right pattern because the Orchestrator can dispatch tasks in parallel, manage the dependency graph, and handle the inherent unpredictability of onboarding timelines.

## Why Phased Rollout

Building and deploying all five agents simultaneously is high risk with no upside.

- **Phase 1 (Orchestrator + Document Processor) validates the architecture.** If the manager-worker communication pattern, the retry logic, or the integration approach has fundamental problems, you discover them with two agents, not five.
- **Document processing is the highest-volume pain point.** Every new hire requires 5-10 documents. This is where manual processes fail most visibly. Automating it first delivers measurable value fastest.
- **Phase 1 is self-contained.** The orchestrator and document processor can run in production while the other three agents are still being built. There is no "big bang" cutover.
- **Phase 2 agents reuse Phase 1 patterns.** The integration approach, message format, retry policy, and escalation flow proven in Phase 1 are directly reused for IT Provisioning, Training Assembly, and Progress Tracking.

## Orchestrator as Single Entry Point

Every onboarding starts the same way: a new-hire event from the HR system triggers the Onboarding Orchestrator. The Orchestrator is the only agent that receives external events. Workers never receive tasks from outside the system.

This matters because:

- **Single source of truth.** The Orchestrator owns the onboarding case record. Every task, every status update, every escalation flows through it. There is no ambiguity about what has been done and what has not.
- **Centralized dependency management.** Only the Orchestrator knows the full task graph. It enforces ordering (account creation before access provisioning) and parallelism (document collection and IT provisioning simultaneously).
- **Audit trail.** Every action in the system is traceable to an Orchestrator decision. This is critical for compliance.

## Parallel Worker Execution

Workers operate independently and concurrently. The Orchestrator dispatches tasks to multiple workers at the same time when those tasks have no dependencies on each other.

Concrete example of a typical new-hire event:

1. Orchestrator receives new-hire event, creates onboarding case.
2. Orchestrator simultaneously dispatches: document collection to Document Processor, account creation to IT Provisioning Coordinator, and training path generation to Training Curriculum Assembler.
3. Each worker executes independently, reports back to the Orchestrator on completion or failure.
4. Orchestrator dispatches dependent tasks as prerequisites complete (e.g., access provisioning after account creation).
5. Progress Tracker monitors all of the above and flags anything falling behind.

This parallelism is why onboarding time drops significantly. Manual processes serialize these tasks because a single person cannot do them all at once. Agents can.

## Human-in-the-Loop Checkpoints

Not everything should be automated. The system includes deliberate points where a human must review and approve:

- **Identity verification.** The Document Processor flags documents for human review rather than making a final identity determination. This is a legal and compliance requirement.
- **Access provisioning for restricted systems.** The IT Provisioning Coordinator can provision standard role-based access automatically, but access to restricted systems (financial data, admin panels, customer PII) requires explicit approval from the security team or system owner.
- **Escalation handling.** When a worker cannot resolve an issue after retries, it escalates to the Orchestrator, which routes it to the appropriate human. The system does not silently fail or make assumptions.
- **Pilot decision gate.** The Phase 1 exit requires stakeholder sign-off on measured outcomes. This is not automated because the decision to expand the system affects budget, headcount, and organizational change management.

The goal is not full autonomy. The goal is automating the predictable, repetitive parts so humans can focus on judgment calls and relationship building.

## Event-Driven Architecture

The system is event-driven rather than polling-based:

- **New-hire event** triggers onboarding case creation.
- **Document submission event** triggers validation.
- **Validation completion event** triggers tax form processing or identity verification.
- **Account creation completion event** triggers access provisioning.
- **Milestone completion event** triggers the next set of dependent tasks.
- **Deadline approaching event** triggers reminders.

This matters for two reasons:

1. **Responsiveness.** Actions happen immediately when their triggers fire, not at the next polling interval. A new hire submitting a document at 3 PM gets it validated at 3 PM, not at the next hourly batch run.
2. **Efficiency.** No agent wastes cycles checking for changes that have not happened. Each agent is dormant until it receives an event that requires its action.

The Orchestrator is the event router. It receives events from workers and external systems, updates case state, evaluates the dependency graph, and dispatches new tasks as prerequisites are met.
`;
