export const content = `# Guardrails and Governance

Risk management, escalation rules, approval gates, and data handling requirements for the Employee Onboarding Automation system.

---

## Risk Categories

### PII Handling

Onboarding involves the most sensitive categories of personal data. The system processes:

- **Social Security Numbers** (tax forms, I-9)
- **Government-issued ID documents** (passport, driver's license photos)
- **Bank account details** (direct deposit enrollment)
- **Medical information** (benefits enrollment, disability accommodations)
- **Emergency contact information**
- **Date of birth, home address, phone number**

Every data flow involving PII must be encrypted in transit (TLS 1.2+) and at rest (AES-256 or equivalent). PII must never appear in log files, error messages, or inter-agent message payloads in cleartext. Use tokenized references (document IDs, employee IDs) in messages and logs. The actual PII lives only in the secure document store and the HR system of record.

### Unauthorized Access Provisioning

The IT Provisioning Coordinator creates accounts and grants access. Misconfigurations here create security vulnerabilities:

- **Over-provisioning:** Granting more access than the role requires. Mitigated by role-based access templates and the principle of least privilege. No ad-hoc access grants without manager approval.
- **Stale access:** Provisioning access for a hire who never starts (offer rescinded, start date delayed). Mitigated by the Orchestrator checking HR system status before dispatching provisioning tasks.
- **Orphaned accounts:** Accounts created but not associated with an active onboarding case. Mitigated by the Orchestrator's case record being the authoritative source. Every account maps to a case ID.

### Incomplete Compliance Training

Compliance training has legal deadlines. Missing them creates liability:

- **Anti-harassment training** is required within 30 days in many jurisdictions.
- **Security awareness training** is required before access to production systems.
- **Data privacy training** is required before handling customer data.

The Training Curriculum Assembler assigns these with hard deadlines. The Progress Tracker monitors completion and escalates non-compliance. The system does not allow deadline extensions for mandatory compliance modules without HR director approval.

### Data Retention Violations

Onboarding documents have different retention requirements:

- **Tax forms:** Retained for the duration of employment plus 4 years (IRS requirement for US).
- **I-9 forms:** Retained for 3 years after hire date or 1 year after termination, whichever is later.
- **ID document copies:** Retained only for the duration of the verification process, then deleted. Storing copies long-term creates unnecessary exposure.
- **Benefits enrollment:** Retained for the duration of the benefit plan year.

The Document Processor must tag every document with its retention category. Automated retention enforcement (deletion at expiry) should be implemented but requires legal review of the specific organization's jurisdiction and policies.

---

## Escalation Rules

### When to Escalate to a Human

| Situation | Escalation Target | Response SLA |
|-----------|-------------------|--------------|
| Identity verification failure or ambiguity | HR Compliance Specialist | 4 hours |
| Document fails validation 3 times | HR Generalist | 8 hours |
| Compliance document not submitted within 72 hours of start date | HR Manager + Hiring Manager | 4 hours |
| PII mismatch between document and HR record | HR Compliance Specialist + Security | 2 hours |
| Access request for restricted system | System Owner or Security Team | 12 hours |
| Hardware cannot be delivered by start date | IT Manager + Hiring Manager | 24 hours |
| License pool exhausted for required software | IT Procurement | 24 hours |
| Employee has not started compliance training within 7 days | Hiring Manager | 24 hours |
| At-risk onboarding flagged for 48+ hours with no progress | HR Director | 4 hours |

### Escalation Message Requirements

Every escalation must include:

1. The onboarding case ID and employee name
2. The specific task that is blocked
3. What was attempted (including retry history)
4. Why automated resolution failed
5. Recommended next action
6. Deadline impact (how this affects the new hire's start date or compliance deadlines)

Escalations without all six elements are rejected and returned to the originating agent for completion.

---

## Approval Gates

### Phase 1 Exit Gate

Before expanding from pilot to full implementation:

- Document processing accuracy > 95% measured over at least 20 onboardings
- Time reduction > 50% vs. manual baseline
- Zero compliance gaps during pilot period
- Stakeholder review of pilot metrics and architecture validation
- Budget approval for Phase 2 infrastructure and integration costs

This gate requires sign-off from: HR leadership, IT leadership, and the project sponsor.

### Access Provisioning Sign-Off

For standard role-based access: automated provisioning is permitted using pre-approved role templates. No human approval needed.

For exceptions to the role template (additional systems, elevated permissions, admin access): the hiring manager must approve the request and the system owner must confirm. Both approvals are logged in the onboarding case record.

For access to regulated systems (financial systems, customer PII stores, production infrastructure): security team approval is required in addition to manager and system owner approval.

### Compliance Verification Gate

Before an onboarding case is marked "complete" (typically Day 90):

- All mandatory documents collected and validated
- All tax forms processed and confirmed by payroll
- Identity verification completed and approved
- All compliance training modules completed
- All access provisioning logged and reconciled against role templates

The Progress Tracker generates the completion checklist. A human (HR generalist or hiring manager) must review and confirm.

---

## Data Handling Requirements

### PII Classification

| Data Element | Classification | Handling |
|-------------|---------------|----------|
| SSN / Tax ID | Restricted | Encrypted at rest, tokenized in logs, access limited to Document Processor and payroll integration |
| Government ID images | Restricted | Encrypted at rest, deleted after verification, never stored in logs or messages |
| Bank account details | Restricted | Encrypted at rest, tokenized in transit, routed only to payroll system |
| Medical / benefits info | Confidential | Encrypted at rest, access limited to benefits enrollment integration |
| Home address, phone, DOB | Confidential | Encrypted at rest, available to HR and IT provisioning |
| Emergency contacts | Internal | Encrypted at rest, stored in HR system |
| Name, role, department | Internal | Available to all agents for task routing |

### Encryption Requirements

- Data in transit: TLS 1.2 or higher for all inter-system communication
- Data at rest: AES-256 or equivalent for all PII storage
- Inter-agent messages: use tokenized references (case ID, document ID, employee ID) rather than PII values
- API keys and credentials: stored in a secrets manager, never in code or configuration files

### Access Controls

- Each agent accesses only the data it needs for its specific function
- The Document Processor accesses document content; other agents access only document metadata (type, status, deadline)
- The IT Provisioning Coordinator accesses employee role and department data; it does not access tax forms or ID documents
- The Progress Tracker accesses milestone statuses and aggregate metrics; it does not access PII or document content
- All data access is logged with agent identity, timestamp, data element accessed, and purpose

---

## Audit Trail Requirements

### What Gets Logged

Every significant action in the system must be logged:

- **Document actions:** collection request sent, document submitted, validation attempted (pass/fail with reason), document processed, document deleted (retention expiry)
- **Access grants:** account created (which system, which permissions), permission modified, access revoked
- **Identity verification:** verification initiated, result (verified/needs_review/failed), human reviewer decision
- **Escalations:** escalation created, assigned to whom, response received, resolution
- **Training:** path assigned, module enrolled, module completed, deadline extended (with approver)
- **Orchestrator decisions:** case created, task dispatched, dependency resolved, case status changed, case completed

### Log Format

Each log entry includes:

- Timestamp (UTC)
- Agent ID (which agent performed the action)
- Onboarding case ID
- Action type
- Action details
- Result (success/failure/pending)
- Correlation ID (links related actions across agents)

### Log Retention

- Audit logs for active onboarding cases: retained for the life of the case plus 1 year
- Audit logs for completed cases: retained for 3 years minimum (align with employment record retention)
- PII-containing log entries: must not exist. If PII appears in a log entry, it is a bug and must be fixed immediately.
`;
