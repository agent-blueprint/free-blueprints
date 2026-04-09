export const content = `# Agent Coordination Rules

These rules govern how the five onboarding agents communicate, retry, and escalate. Every agent must follow them.

## Message Format

All inter-agent messages use a standard envelope:

\`\`\`
{
  "message_id": "unique-uuid",
  "timestamp": "ISO-8601",
  "source_agent": "agent-name",
  "target_agent": "agent-name",
  "onboarding_case_id": "case-uuid",
  "action": "string (the requested operation)",
  "payload": { ... },
  "correlation_id": "uuid (links related messages across agents)",
  "priority": "normal | high | critical"
}
\`\`\`

Every message must include \`onboarding_case_id\` and \`correlation_id\`. Messages without them are rejected.

## Retry Policy

- Workers retry transient failures (network timeouts, rate limits, temporary service unavailability) up to 3 times with exponential backoff: 5s, 30s, 180s.
- After 3 failures, the worker reports the failure to the Orchestrator with error details. The worker does not retry further.
- The Orchestrator decides whether to re-dispatch, escalate to a human, or mark the task as blocked.

## Escalation to Manager

Workers escalate to the Onboarding Orchestrator when:

- A task fails after exhausting retries.
- A task requires approval that the worker cannot obtain (e.g., access provisioning for a restricted system).
- Input data is missing or invalid and the worker cannot resolve it independently.
- A compliance-critical deadline is at risk (less than 24 hours remaining with incomplete requirements).

Escalation messages must include: the original task, what was attempted, what failed, and a recommended next action.

## State Propagation

- The Orchestrator is the single source of truth for onboarding case state.
- Workers report task completion or failure back to the Orchestrator. They do not update case state directly.
- The Orchestrator updates the case record and notifies dependent workers when prerequisites are met.
- The Progress Tracker reads state from the Orchestrator's case records. It does not maintain a separate state store.

## Idempotency

- Every tool invocation must be idempotent. Calling \`provision_account\` twice for the same employee and account type must produce the same result, not a duplicate account.
- Workers must check whether an action has already been completed before executing it. Use \`onboarding_case_id\` + \`action\` + \`target\` as the idempotency key.
- If a duplicate request is detected, return the existing result without re-executing.

## Parallel Execution

- The Orchestrator dispatches independent tasks in parallel. Document collection, IT provisioning, and training path assembly do not depend on each other and run simultaneously.
- Dependent tasks wait. For example, access provisioning for a specific application may depend on account creation completing first. The Orchestrator enforces this ordering.
- Workers must not assume execution order. A worker may receive tasks at any time and must handle them based on the current state of the onboarding case, not assumptions about what other workers have done.
`;
