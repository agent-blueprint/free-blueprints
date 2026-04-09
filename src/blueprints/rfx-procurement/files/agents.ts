export const content = `# Agent Coordination Protocol

Universal rules governing how the 5 RFx Procurement agents communicate and coordinate.

## Message Format

All inter-agent messages use a standard envelope:

\`\`\`
{
  "message_id": "unique-uuid",
  "from_agent": "agent-name",
  "to_agent": "agent-name",
  "rfx_id": "tracking-id-for-the-rfx",
  "task_type": "string describing the task",
  "payload": { ... task-specific data ... },
  "timestamp": "ISO-8601",
  "correlation_id": "original-request-uuid for tracing"
}
\`\`\`

Every message must include \`rfx_id\` and \`correlation_id\` for traceability.

## Routing Rules

- **All communication flows through the Orchestrator.** Workers never send messages directly to other workers. If the Requirements Analyzer produces output that the Content Library Matcher needs, the Orchestrator receives it first and routes it.
- **Workers are stateless.** They process a task and return a result. They do not maintain memory of previous tasks or other workers' outputs unless explicitly passed in the payload.
- **The Orchestrator owns all state.** Task status, dependencies, completion tracking, and approval status live in the Orchestrator's tracking records.

## Retry Policy

- Workers must return a result or an explicit error within 5 minutes per task. The Orchestrator enforces this timeout.
- On worker failure, the Orchestrator retries the same task once with the same payload.
- If the retry fails, the task is marked as \`failed\` and escalated to a human operator with the error details and original payload attached.
- Workers must be idempotent. Receiving the same task twice with the same \`message_id\` must produce the same result without side effects.

## Escalation to Manager

Workers escalate to the Orchestrator (not directly to humans) when:

- Confidence in the result falls below the agent's configured threshold (see agent specifications).
- A mandatory requirement cannot be fulfilled or categorized.
- Input data is malformed, incomplete, or in an unsupported format.
- A dependency on another agent's output is missing or inconsistent.

The Orchestrator decides whether to retry, re-route, or escalate to a human.

## State Propagation

- The Orchestrator updates the RFx tracking record after every worker task completes.
- Workers receive only the data they need for their specific task. They do not receive the full RFx tracking record.
- When a worker's output changes the state of requirements or responses, the Orchestrator is responsible for propagating those changes to downstream tasks.

## Idempotency

- Every task is identified by its \`message_id\`. Workers must check whether they have already processed a \`message_id\` before executing.
- If a duplicate \`message_id\` is received, the worker returns the previously computed result without re-executing.
- This applies to all workers without exception. The Orchestrator may re-send tasks during retry or recovery scenarios.

## Ordering and Dependencies

- The Orchestrator enforces task dependencies. For example, the Content Library Matcher cannot run until the Requirements Analyzer has completed.
- Workers do not enforce ordering. They process whatever task they receive. The Orchestrator is solely responsible for sending tasks in the correct sequence.
- Parallel execution is allowed when tasks have no dependencies. The Orchestrator may send independent tasks to multiple workers simultaneously.
`;
