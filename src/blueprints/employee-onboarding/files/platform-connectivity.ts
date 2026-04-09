export const content = `# Platform Connectivity

Integration points and patterns for connecting the Employee Onboarding Automation system to your technology stack. All guidance is vendor-agnostic. Adapt to whatever systems your organization uses.

---

## HR System Integration

**Purpose:** Source of truth for new-hire data. Triggers the onboarding process.

### Required Capabilities

- **New-hire event notification.** The HR system must emit an event (webhook, message queue, or polling-compatible API) when a new hire record is created or a start date is confirmed. This is the trigger for the entire onboarding workflow.
- **Employee data read access.** The Orchestrator needs: employee name, email, role title, department, start date, employment type (full-time, contractor, intern), reporting manager, office location, and remote/hybrid/onsite status.
- **Employee status updates.** The system needs to detect offer rescissions, start date changes, and role changes that affect onboarding tasks already in progress.

### Integration Pattern

Event-driven is preferred. Configure the HR system to emit a webhook on new-hire creation. The Orchestrator subscribes to this event. If webhooks are not available, poll the HR system API for new hires on a 15-minute interval and deduplicate using employee ID.

---

## Identity Management

**Purpose:** User account lifecycle. SSO configuration. Directory group membership.

### Required Capabilities

- **User account creation.** Create accounts in the organization's directory service with appropriate attributes (name, email, department, manager, role).
- **Group membership management.** Add new accounts to the correct security groups and distribution lists based on role and department.
- **SSO provisioning.** Configure single sign-on access for downstream applications.
- **Account status management.** Activate accounts on start date, deactivate if onboarding is cancelled.

### Integration Pattern

Use the directory service's administrative API (SCIM, REST, or platform-specific SDK). The IT Provisioning Coordinator calls this API to create accounts and manage group memberships. Idempotency is critical: the API call to create an account must be safe to retry without creating duplicates. Use the employee's HR system ID as the external identifier for deduplication.

---

## Document Management

**Purpose:** Collect, store, and manage new-hire documents with e-signature support.

### Required Capabilities

- **E-signature workflows.** Send documents (NDAs, offer letters, policy acknowledgments) for electronic signature. Track signature status.
- **Form generation.** Generate pre-filled tax forms and benefits enrollment forms from HR system data.
- **Document upload and storage.** Accept uploaded documents (ID photos, certifications) from new hires via a secure portal or email.
- **Document retrieval.** Retrieve stored documents for validation and processing.
- **Retention management.** Tag documents with retention categories and support automated deletion at expiry.

### Integration Pattern

The Document Processor connects to the e-signature service API for signature workflows and to the document storage API for uploads and retrieval. New hires interact with the e-signature service directly (signing documents) and with a portal or email for uploads. The Document Processor monitors completion events from the e-signature service to trigger validation.

---

## IT Service Management

**Purpose:** Hardware procurement, ticket tracking, and asset management.

### Required Capabilities

- **Ticket creation.** Create provisioning requests (hardware orders, software installation, desk setup) as trackable tickets.
- **Asset assignment.** Record which assets (laptop serial number, monitor, peripherals) are assigned to which employee.
- **Ticket status tracking.** Monitor ticket progress to detect delays and blockers.
- **Catalog item requests.** Submit requests from a service catalog (standard laptop configurations, software bundles) rather than free-form tickets.

### Integration Pattern

The IT Provisioning Coordinator creates tickets or catalog requests via the ITSM API. It polls or subscribes to status updates. For hardware, the pattern is: create a catalog request with specifications and shipping details, then monitor the request through fulfillment stages (ordered, shipped, delivered, configured). For software, the pattern is: submit a license assignment request, then verify the assignment is active.

---

## Learning Management System

**Purpose:** Training course catalog, enrollment, and completion tracking.

### Required Capabilities

- **Course catalog API.** Query available training modules with metadata (category, duration, prerequisites, compliance flag, format).
- **Enrollment management.** Enroll employees in specific courses with deadlines. Modify or cancel enrollments.
- **Completion tracking.** Receive notifications or query completion status for enrolled courses.
- **Training path support.** If the LMS supports learning paths or curricula natively, use that. Otherwise, the Training Curriculum Assembler manages sequencing externally and enrolls modules individually as prerequisites are met.

### Integration Pattern

The Training Curriculum Assembler queries the course catalog to build training paths, then uses the enrollment API to assign modules. Completion events (if the LMS emits them) trigger the Assembler to enroll the next module in the sequence. If the LMS does not emit completion events, poll the completion status API on a 1-hour interval for active enrollments.

---

## Communication Channels

**Purpose:** Notifications, reminders, and status updates to new hires, managers, and HR.

### Required Capabilities

- **Email sending.** Programmatic email for document collection requests, welcome messages, and escalation notifications. Must support HTML templates.
- **Chat messaging.** Programmatic chat messages for reminders, status updates, and quick notifications. Preferred for time-sensitive items.
- **Channel selection logic.** Critical/urgent items use both email and chat. Routine items use the employee's preferred channel if known, defaulting to email.

### Integration Pattern

The system sends notifications through two channels: email API for formal communications and chat API for informal/urgent ones. The Progress Tracker manages reminder frequency (maximum 2 per action per 48-hour period). Each agent sends its own notifications for immediate operational items (e.g., Document Processor sends collection requests). The Progress Tracker handles reminders for overdue items and status reports.

---

## Common Integration Considerations

### Authentication

All integrations should use OAuth 2.0 or API key authentication. Service accounts are preferred over user-impersonation tokens. Store credentials in a secrets manager. Rotate API keys on a quarterly cadence at minimum.

### Rate Limiting

Enterprise APIs enforce rate limits. The system must respect them:

- Implement backoff on 429 responses (rate limit exceeded)
- Batch operations where the API supports it (e.g., creating 5 accounts in one call vs. 5 separate calls)
- Distribute API calls across time rather than bursting (relevant when processing a large cohort of new hires)

### Error Handling

Integration failures are expected. The system handles them through:

- Retry with exponential backoff for transient errors (timeouts, 500s, rate limits)
- Escalation to the Orchestrator for persistent errors (3 consecutive failures)
- Graceful degradation: if a non-critical integration is down (e.g., chat notifications), fall back to email. If a critical integration is down (e.g., HR system), halt new case creation and alert operations.

### Data Mapping

Each integration requires mapping between the onboarding system's data model and the external system's data model. Document these mappings explicitly. Common mapping challenges:

- Role titles in the HR system may not match role templates in the provisioning system
- Department names may differ between HR and directory services
- Employee IDs may be formatted differently across systems

Create a mapping configuration that translates between systems. Do not hard-code mappings in agent logic.
`;
