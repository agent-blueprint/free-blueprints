export const content = `# Agent Specifications

Detailed specifications for all five agents in the Employee Onboarding Automation system.

---

## Agent 1: Onboarding Orchestrator

- **Role:** Coordinates the full onboarding lifecycle from new-hire event to Day 90 completion
- **Type:** Manager
- **Phase:** 1

### Responsibilities

- Receive new-hire events from the HR system and create onboarding cases
- Decompose each onboarding into tasks and assign them to the appropriate worker agents
- Manage task dependencies (e.g., account creation must precede application access provisioning)
- Track milestone completion and enforce deadline compliance
- Escalate blockers to human stakeholders when automated resolution fails

### Tools

**\`create_onboarding_case\`**
Creates a new onboarding case record when a new-hire event is received. Accepts employee details (name, role, department, start date, employment type) and returns a case ID with the full task breakdown. The task breakdown is generated based on the role and department, pulling from a configurable template that defines which documents, systems, training modules, and milestones apply.

**\`assign_task\`**
Dispatches a specific task to a worker agent. Accepts the case ID, target agent, task type, priority, deadline, and any prerequisite task IDs that must be completed first. Returns a task ID and acknowledgment. The orchestrator tracks all dispatched tasks and their states.

**\`check_milestone_status\`**
Queries the current status of an onboarding case or a specific milestone within it. Returns completion percentage, outstanding tasks, overdue items, and any active blockers. Used both for internal orchestration logic and for responding to status queries from humans.

**\`escalate_blocker\`**
Creates an escalation record when a task is blocked and cannot be resolved automatically. Accepts the case ID, blocked task, reason, attempts made, and recommended action. Routes the escalation to the appropriate human (hiring manager, HR generalist, IT admin, or security team) based on the task type and escalation rules.

### Input

- New-hire event: employee name, email, role title, department, start date, employment type (full-time, contractor, intern), reporting manager, office location
- Onboarding template configuration: role-to-task mappings, department-specific requirements, compliance requirements by jurisdiction

### Output

- Onboarding case record with full task graph
- Task assignments dispatched to workers
- Escalation records for blocked items
- Completion report at Day 30, Day 60, and Day 90

### Escalation Conditions

- Any worker reports a task failure after exhausting retries
- A compliance-critical task is overdue by more than 4 hours
- A new hire's start date is less than 48 hours away and required tasks are incomplete
- A human approval request has been pending for more than 24 hours

### Success Metrics

- 100% of new hires have an onboarding case created within 1 hour of HR system event
- 95% of tasks dispatched to workers within 2 hours of case creation
- Zero onboarding cases with unresolved blockers at the new hire's start date

---

## Agent 2: Document Processor

- **Role:** Collects, validates, and processes all required new-hire documentation
- **Type:** Worker
- **Phase:** 1

### Responsibilities

- Send document collection requests to new hires (tax forms, ID documents, emergency contacts, benefits enrollment, NDAs)
- Validate submitted documents for completeness, correctness, and compliance
- Process tax form data (W-4, state withholding, I-9) and route to payroll
- Coordinate identity verification with the appropriate verification service
- Track document deadlines and send reminders for outstanding items

### Tools

**\`collect_document\`**
Initiates document collection for a specific document type. Accepts the case ID, document type (e.g., W-4, I-9, NDA, benefits_enrollment, emergency_contact), employee email, and deadline. Generates a collection request via the configured channel (email with e-signature link, portal upload, or form). Returns a collection request ID and tracking URL.

**\`validate_document\`**
Validates a submitted document against its type-specific rules. For tax forms: checks all required fields are populated, validates SSN format, verifies withholding elections are internally consistent. For ID documents: checks document type is acceptable, verifies it is not expired, confirms name matches HR record. For NDAs and agreements: verifies signature is present and date is valid. Returns validation status (valid, invalid, needs_review) with specific issues if invalid.

**\`process_tax_forms\`**
Extracts structured data from validated tax forms and routes them to the payroll system. Accepts the case ID and document ID. Parses W-4 data (filing status, dependents, additional withholding), state withholding elections, and direct deposit information. Returns a processing confirmation with the payroll system record ID.

**\`verify_identity\`**
Initiates identity verification by comparing submitted ID documents against the employee's HR record. Checks name match, photo verification readiness, and document authenticity indicators. Returns a verification status (verified, needs_human_review, failed). Any status other than "verified" triggers escalation to a human reviewer. This tool never makes a final identity determination autonomously.

### Input

- Task assignment from Orchestrator: case ID, document type, employee details, deadline
- Submitted documents from new hires (PDFs, images, form data)

### Output

- Document validation results (per document)
- Processed tax form data routed to payroll
- Identity verification status
- Collection status report: which documents are complete, pending, overdue

### Escalation Conditions

- Identity verification returns "needs_human_review" or "failed"
- A document fails validation three times (possible data entry issue requiring human help)
- A compliance-critical document (I-9, tax forms) is not submitted within 72 hours of start date
- Submitted document contains PII that does not match HR record (potential fraud indicator)

### Success Metrics

- > 98% first-pass document validation accuracy (valid documents accepted, invalid rejected)
- Average time from collection request to completed document < 48 hours
- Zero compliance deadline misses for tax and identity documents

---

## Agent 3: IT Provisioning Coordinator

- **Role:** Provisions all technology resources for new hires
- **Type:** Worker
- **Phase:** 2

### Responsibilities

- Create user accounts in directory services and business applications
- Assign and track hardware (laptop, monitors, peripherals) through procurement and shipping
- Configure software licenses based on role and department requirements
- Set up access permissions according to the principle of least privilege
- Verify Day 1 readiness: all accounts active, hardware delivered, VPN configured

### Tools

**\`provision_account\`**
Creates a user account in the specified system. Accepts the case ID, system name (e.g., directory_service, email, chat, code_repository, project_management), employee details, and role-based access template. Creates the account, sets a temporary password or SSO configuration, and returns account creation confirmation with the username and provisioning status. Idempotent: if the account already exists, returns the existing account details.

**\`assign_hardware\`**
Initiates hardware assignment for a new hire. Accepts the case ID, hardware type (laptop, monitor, keyboard, headset), specifications (based on role template), shipping address, and required-by date. Creates a procurement or inventory request, tracks shipping, and returns a hardware assignment ID with estimated delivery date. For remote employees, coordinates shipping. For office employees, coordinates desk setup.

**\`configure_access_permissions\`**
Sets up access permissions for a provisioned account. Accepts the case ID, account ID, permission set (derived from role and department templates), and any additional access requests approved by the hiring manager. Applies permissions following the principle of least privilege. Returns the permission configuration and any permissions that require additional approval (e.g., access to restricted repositories, financial systems, or admin panels).

**\`setup_software_licenses\`**
Assigns software licenses from the organization's license pool. Accepts the case ID, employee ID, and list of required software (derived from role template). Checks license availability, assigns licenses, and triggers installation or access provisioning. Returns assignment status per software title, including any licenses that are unavailable and need procurement.

### Input

- Task assignment from Orchestrator: case ID, employee details, role, department, start date, office location, remote/hybrid/onsite status
- Role-based provisioning templates: which systems, hardware, software, and permissions each role requires

### Output

- Account creation confirmations (per system)
- Hardware assignment tracking (with delivery status)
- Permission configuration report
- Software license assignment status
- Day 1 readiness checklist (all items green/yellow/red)

### Escalation Conditions

- Hardware cannot be delivered by start date (stock unavailable, shipping delay)
- License pool is exhausted for a required software title
- Access permission request requires security team approval and has been pending > 12 hours
- Account creation fails due to naming conflict or policy violation

### Success Metrics

- > 95% of new hires have all accounts, hardware, and software ready on Day 1
- Average provisioning time from task assignment to completion < 24 hours
- Zero unauthorized access grants (every permission traces to a role template or approved exception)

---

## Agent 4: Training Curriculum Assembler

- **Role:** Builds personalized training paths for each new hire
- **Type:** Worker
- **Phase:** 2

### Responsibilities

- Generate a role-specific, department-aware training path for each new hire
- Include mandatory compliance training (security awareness, anti-harassment, data privacy) with hard deadlines
- Add role-specific technical training based on the tools and systems the hire will use
- Include department-specific onboarding content (team norms, processes, key contacts)
- Assign training modules in the learning management system and track completion

### Tools

**\`build_training_path\`**
Generates a personalized training path for a new hire. Accepts the case ID, role, department, seniority level, and any prior training records (for experienced hires or internal transfers). Combines mandatory compliance modules, role-specific technical modules, and department-specific orientation content into an ordered path with deadlines. Returns the full training path with module IDs, titles, durations, deadlines, and sequencing dependencies.

**\`assign_modules\`**
Assigns specific training modules to an employee in the learning management system. Accepts the case ID, employee ID, module IDs, and deadlines. Creates the enrollment records and sends the employee a notification with their training schedule. Returns assignment confirmations per module. Idempotent: re-assigning an already-assigned module returns the existing enrollment.

**\`customize_curriculum\`**
Adjusts a training path based on additional context. Accepts the case ID, the existing training path, and modification parameters (skip modules the hire has already completed elsewhere, add modules for a specific project they are joining, adjust deadlines based on part-time schedule). Returns the updated training path. Used when the hiring manager or HR provides customization requests after the initial path is generated.

### Input

- Task assignment from Orchestrator: case ID, employee details, role, department, seniority, start date
- Training catalog: available modules with metadata (category, duration, prerequisites, compliance flag)
- Department training requirements: team-specific modules and recommended resources
- Employee prior training records (if available)

### Output

- Personalized training path with module sequencing and deadlines
- LMS enrollment confirmations
- Training completion status (updated as employee progresses)

### Escalation Conditions

- A required compliance module is not available in the LMS (content needs to be created or updated)
- An employee has not started mandatory compliance training within 7 days of start date
- A hiring manager requests training customization that conflicts with compliance requirements

### Success Metrics

- 100% of new hires have a training path assigned within 24 hours of start date
- > 85% employee satisfaction score for training relevance (measured at Day 30 survey)
- 100% compliance training completion within 30 days

---

## Agent 5: Progress Tracker

- **Role:** Monitors onboarding progress, identifies risks, and reports status
- **Type:** Worker
- **Phase:** 2

### Responsibilities

- Monitor all onboarding milestones across active cases and flag items that are behind schedule
- Generate status reports for HR, hiring managers, and leadership
- Identify at-risk onboardings based on completion velocity, blocker patterns, and deadline proximity
- Trigger automated reminders to new hires, managers, and approvers for pending actions
- Calculate and report onboarding metrics (time-to-productive, completion rates, satisfaction scores)

### Tools

**\`generate_status_report\`**
Generates an onboarding status report scoped to a specific audience. Accepts a report type (individual_case, department_summary, organization_overview), scope parameters (case ID, department, date range), and format (structured_data, narrative). For individual cases: shows task completion, outstanding items, blockers, and timeline. For department summaries: shows active onboardings, completion rates, and common blockers. For organization overviews: shows aggregate metrics, trends, and at-risk cases.

**\`identify_at_risk_onboards\`**
Scans active onboarding cases and flags those at risk of missing deadlines or falling behind. Risk indicators include: tasks overdue by more than 24 hours, compliance deadlines within 48 hours with incomplete requirements, start date approaching with critical tasks incomplete, and repeated escalations on the same case. Returns a prioritized list of at-risk cases with risk reasons and recommended actions.

**\`send_reminder\`**
Sends a targeted reminder to a specific person about a pending onboarding action. Accepts the case ID, recipient (new hire, hiring manager, approver, IT admin), action needed, and urgency level. Selects the appropriate channel (email, chat message, or both based on urgency). Tracks reminder history to avoid excessive notifications (maximum 2 reminders per action per 48-hour period).

**\`calculate_completion_metrics\`**
Computes onboarding performance metrics across completed cases. Accepts a date range and optional filters (department, role, office location). Calculates: average time-to-productive, document completion speed, IT provisioning speed, training completion rate, overall onboarding NPS, and compliance completion rate. Returns metrics with trend data (comparison to previous period) and breakdowns by filter dimensions.

### Input

- Read access to all onboarding case records managed by the Orchestrator
- Milestone completion events from all worker agents
- Employee survey responses (Day 30 satisfaction survey)

### Output

- Status reports (per case, per department, organization-wide)
- At-risk case alerts with recommended actions
- Reminder notifications to pending action owners
- Onboarding performance dashboards and trend data

### Escalation Conditions

- An at-risk case has been flagged for more than 48 hours with no progress
- Organization-wide metrics drop below threshold (e.g., Day 1 readiness falls below 90%)
- A pattern of repeated blockers indicates a systemic issue (e.g., a specific integration failing for multiple hires)

### Success Metrics

- At-risk cases identified at least 48 hours before deadline (early warning accuracy)
- > 90% of reminders result in action within 24 hours
- Onboarding metrics reports delivered on schedule with zero data accuracy issues
`;
