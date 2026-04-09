export const content = `# Platform Connectivity

Integration patterns for connecting the RFx Procurement Automation system to organizational infrastructure. All patterns are vendor-agnostic. Adapt them to your specific platforms and tools.

---

## Document Intake

The system needs at least one channel for receiving RFx documents. Most organizations will configure multiple channels.

### Email Parsing

- **Pattern:** Monitor a dedicated mailbox (e.g., rfx@company.com or proposals@company.com) for incoming RFx documents.
- **What to extract:** Attachments (the RFx document itself), sender information (issuing organization), subject line (often contains RFx reference number), body text (may contain submission instructions or context not in the attached document).
- **Implementation notes:** Filter for relevant emails using subject line patterns, sender domains, or attachment types. Forward non-RFx emails to the appropriate team rather than discarding them. Parse both PDF and DOCX attachments. Handle multi-part emails where the RFx is split across multiple attachments.
- **Error handling:** If an attachment cannot be parsed, create the tracking record anyway and escalate for manual document retrieval.

### Shared Drive Monitoring

- **Pattern:** Watch a designated folder on a shared drive or cloud storage service for new RFx documents.
- **What to extract:** The document file, folder path (may indicate category or priority), file metadata (creation date, last modified by).
- **Implementation notes:** Use file system events or polling (polling interval: configurable, default 15 minutes). Support subfolder structures where teams organize by RFx type or deadline. Handle duplicate detection (same document uploaded twice).
- **Error handling:** If a file is locked or in use, retry after a configurable delay. If a file format is unsupported, create the tracking record and escalate.

### Procurement Portal API

- **Pattern:** Integrate with the organization's procurement system or a third-party procurement portal via API.
- **What to extract:** RFx document, metadata (reference number, issuing organization, category, deadline), status updates.
- **Implementation notes:** API integration varies significantly by portal. Common patterns include REST APIs with webhook notifications for new RFx documents, or periodic polling of a "new opportunities" endpoint. Map portal-specific fields to the standard RFx tracking record schema.
- **Error handling:** Implement retry with exponential backoff for API failures. Cache the last-seen document list to avoid reprocessing on reconnection.

---

## Knowledge Base Integration

The Content Library Matcher needs read access to organizational content repositories. The quality of content matching depends directly on the breadth and freshness of accessible content.

### Content Repositories

Typical sources include:

- **Document management systems.** Previous RFx responses, policy documents, technical specifications, capability statements. These are usually the highest-value sources.
- **Wiki/collaboration platforms.** Product documentation, process descriptions, team knowledge articles. Useful for informational requirements.
- **File systems/cloud storage.** Unstructured content in shared drives. Lower quality but may contain unique material not captured elsewhere.

### Search Integration Patterns

- **Direct API integration.** If the content repository has a search API, query it directly. This is the simplest approach and leverages the repository's existing indexing.
- **Index and search.** Periodically crawl content repositories and build a search index (full-text, semantic, or both). This provides more control over search quality but requires maintaining the index.
- **Vector database.** For semantic matching, embed content chunks into a vector database and use similarity search. This produces the highest-quality relevance scores but requires an embedding pipeline and vector storage.

### Content Preparation

- Index content at the paragraph or section level, not the document level. A 50-page previous response should be searchable by individual answers, not as a single blob.
- Include metadata with each content chunk: source document, section, author, last updated date, and content type.
- Establish a freshness policy. Content older than a configurable threshold (default: 12 months) should be flagged as potentially stale when matched.

---

## Notification Channels

The system needs to notify stakeholders about status changes, approaching deadlines, required approvals, and escalations.

### Email Notifications

- **Use for:** Approval requests, escalation alerts, weekly status digests.
- **Implementation:** Send structured emails with clear subject lines indicating the action required. Include deep links to the RFx tracking record where applicable.

### Chat/Messaging Integration

- **Use for:** Real-time alerts (deadline warnings, task completions, escalations), quick status updates.
- **Implementation:** Post to a dedicated channel for RFx automation updates. Use threading to group messages by RFx. Include actionable buttons or links where the platform supports them.

### In-Platform Notifications

- **Use for:** If the system has a web interface or dashboard, use in-platform notifications for status updates, task assignments, and approval queues.
- **Implementation:** Combine a notification badge/counter with a notification feed. Allow users to configure their notification preferences (which events, which channels).

### Notification Priority

| Event | Channel | Priority |
|-------|---------|----------|
| New RFx received | Chat + Email | Normal |
| Approval required | Email + Chat | High |
| Deadline warning (7 days) | Chat | Normal |
| Deadline warning (3 days) | Email + Chat | High |
| Deadline warning (1 day) | Email + Chat + Phone/SMS | Critical |
| Escalation | Email + Chat | High |
| Processing complete | Chat | Normal |

---

## Output Destinations

### Response Documents

- **Primary output:** Formatted draft response documents (DOCX, PDF, or platform-native format).
- **Delivery:** To a designated output folder, document management system, or directly into the procurement portal's response interface.
- **Versioning:** Each draft revision is saved as a new version. The system does not overwrite previous drafts.

### Audit Logs

- **Destination:** Centralized logging system, SIEM, or dedicated audit database.
- **Format:** Structured JSON log entries (see guardrails-and-governance.md for schema).
- **Retention:** Per organizational policy, minimum 7 years for audit logs.

### Analytics and Reporting

- **Metrics data:** Processing times, accuracy scores, content reuse rates, and stakeholder satisfaction scores feed into a reporting dashboard or data warehouse.
- **Format:** Structured data suitable for BI tools (CSV export, API endpoint, or direct database integration).
- **Frequency:** Metrics are captured per RFx. Aggregated reports are generated on demand or on a scheduled basis (weekly/monthly).

---

## Authentication Patterns

### Service Accounts

- Each integration point uses a dedicated service account with minimum required permissions.
- Service accounts for document intake: read access to the intake channel, write access to the tracking system.
- Service accounts for knowledge base: read-only access to content repositories.
- Service accounts for notifications: send permissions on configured channels.
- Service accounts for output: write access to output destinations.

### OAuth / Token-Based Authentication

- For API integrations (procurement portals, collaboration platforms, cloud storage), use OAuth 2.0 with client credentials flow for server-to-server communication.
- Store tokens securely (encrypted at rest, never in source code or logs).
- Implement token refresh before expiration. Do not wait for a 401 response to refresh.

### API Keys

- For simpler integrations that use API key authentication, rotate keys on a regular schedule (minimum quarterly).
- Scope API keys to the minimum required permissions.
- Monitor API key usage for anomalous patterns.

---

## Common Integration Checklist

Use this checklist when setting up integrations for the system:

- [ ] Document intake channel configured and tested (at least one channel)
- [ ] Knowledge base connected with content indexed at section/paragraph level
- [ ] Notification channel configured and tested (at least email)
- [ ] Output destination configured and write access verified
- [ ] Service accounts created with minimum required permissions
- [ ] Authentication credentials stored securely
- [ ] Error handling and retry logic tested for each integration
- [ ] Monitoring and alerting configured for integration health
- [ ] Backup intake procedure documented (manual fallback if automation fails)
`;
