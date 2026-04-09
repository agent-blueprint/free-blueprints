export const content = `# Agent Specifications

Detailed specifications for all 5 agents in the RFx Procurement Automation system. Each entry defines the agent's role, tools, data contracts, escalation conditions, and success metrics.

---

## 1. RFx Orchestrator

- **Role:** Manager
- **Type:** Orchestrator
- **Phase:** 1

### Responsibilities

- Accept incoming RFx documents and classify them by type (RFP, RFQ, RFI).
- Create and maintain a tracking record for each RFx through its full lifecycle.
- Route tasks to the appropriate worker agents based on the current stage of processing.
- Enforce approval gates at configured checkpoints (e.g., before response submission).
- Monitor task completion, enforce timeouts, and handle retries and escalations.

### Tools

#### assign_rfx_task

Assigns a specific task to a worker agent. Creates a task record linked to the RFx tracking record.

- **Inputs:** \`rfx_id\` (string), \`target_agent\` (string, one of: requirements_analyzer, content_library_matcher, response_composer, compliance_validator), \`task_type\` (string, e.g., "extract_requirements", "match_content", "compose_response", "validate_compliance"), \`payload\` (object, task-specific data including relevant document content or prior stage outputs).
- **Outputs:** \`task_id\` (string), \`status\` ("assigned"), \`assigned_at\` (ISO-8601 timestamp).

#### check_completion_status

Checks the current status of all tasks for a given RFx.

- **Inputs:** \`rfx_id\` (string).
- **Outputs:** \`rfx_id\` (string), \`overall_status\` (string: "intake", "requirements_extracted", "content_matched", "response_drafted", "compliance_validated", "pending_approval", "submitted", "failed"), \`tasks\` (array of objects with \`task_id\`, \`agent\`, \`status\`, \`completed_at\`, \`error\` if applicable).

#### enforce_approval_gate

Triggers a human approval checkpoint. Pauses processing until approval is received or the request is rejected.

- **Inputs:** \`rfx_id\` (string), \`gate_type\` (string: "phase1_exit", "response_review", "final_submission"), \`artifacts\` (array of objects describing what the approver should review, each with \`type\` and \`content_reference\`).
- **Outputs:** \`gate_id\` (string), \`status\` ("pending_approval"), \`approvers\` (array of strings, stakeholder identifiers), \`requested_at\` (ISO-8601 timestamp).

#### notify_stakeholders

Sends a notification to relevant stakeholders about RFx status changes, approaching deadlines, or required actions.

- **Inputs:** \`rfx_id\` (string), \`notification_type\` (string: "status_update", "deadline_warning", "approval_required", "escalation"), \`recipients\` (array of strings), \`message\` (string).
- **Outputs:** \`notification_id\` (string), \`sent_at\` (ISO-8601 timestamp), \`delivery_status\` (string).

### Input Contract

The Orchestrator receives raw RFx documents (PDF, DOCX, or plain text) along with metadata: \`source_channel\` (where the document came from), \`received_at\` (timestamp), \`submitting_organization\` (if known), and \`priority\` (optional override).

### Output Contract

The Orchestrator produces a complete RFx tracking record including: classification, extracted requirements (from Requirements Analyzer), matched content (from Content Library Matcher), draft responses (from Response Composer), compliance report (from Compliance Validator), approval status, and audit log of all actions taken.

### Escalation Conditions

- Any worker fails twice on the same task.
- A deadline conflict is detected (submission deadline is within 48 hours and processing is incomplete).
- An approval gate is rejected by a reviewer.
- The RFx document cannot be classified (unknown format or type).

### Success Metrics

- **Routing accuracy:** > 95% of tasks assigned to the correct worker on the first attempt.
- **End-to-end cycle time:** Total processing time from intake to draft-ready is measurable and decreasing over time.
- **Zero dropped RFx documents:** Every document that enters the system has a tracking record and reaches a terminal state.

---

## 2. Requirements Analyzer

- **Role:** Worker
- **Type:** Specialist
- **Phase:** 1

### Responsibilities

- Parse RFx documents in multiple formats (PDF, DOCX, plain text) into structured content.
- Extract individual requirements from document text, including nested and conditional requirements.
- Categorize each requirement as mandatory, scored, or informational.
- Identify all deadlines, milestones, and time-bound constraints.
- Flag ambiguous or contradictory requirements for human review.

### Tools

#### parse_rfx_document

Converts a raw RFx document into structured sections and paragraphs for downstream processing.

- **Inputs:** \`document_content\` (string or binary reference), \`document_format\` (string: "pdf", "docx", "txt", "html"), \`document_type\` (string: "rfp", "rfq", "rfi" if known, or "unknown").
- **Outputs:** \`parsed_document\` (object with \`sections\` array, each containing \`section_number\`, \`title\`, \`content\`, \`subsections\`), \`metadata\` (object with \`page_count\`, \`word_count\`, \`detected_type\`, \`issuing_organization\`), \`parse_confidence\` (number 0-1).

#### extract_requirements

Identifies and extracts individual requirements from parsed document sections.

- **Inputs:** \`parsed_sections\` (array of section objects from parse_rfx_document output), \`extraction_rules\` (optional object with custom keyword patterns or section hints).
- **Outputs:** \`requirements\` (array of objects, each with \`requirement_id\`, \`text\`, \`source_section\`, \`source_page\`, \`keywords\` array, \`confidence\` score 0-1).

#### categorize_requirements

Classifies extracted requirements by type and priority.

- **Inputs:** \`requirements\` (array of requirement objects from extract_requirements output).
- **Outputs:** \`categorized_requirements\` (array of objects extending each requirement with \`category\` (string: "mandatory", "scored", "informational"), \`priority\` (string: "critical", "high", "medium", "low"), \`evaluation_weight\` (number, if stated in the document), \`categorization_confidence\` (number 0-1)).

#### identify_deadlines

Extracts all time-bound constraints from the document.

- **Inputs:** \`parsed_document\` (object from parse_rfx_document), \`reference_date\` (ISO-8601, typically the document receipt date for calculating relative deadlines).
- **Outputs:** \`deadlines\` (array of objects, each with \`deadline_type\` (string: "submission", "questions_due", "site_visit", "notification", "other"), \`date\` (ISO-8601), \`description\` (string), \`source_section\` (string), \`is_mandatory\` (boolean)).

### Input Contract

Receives a raw RFx document (content or reference) and its format. May also receive optional extraction hints from the Orchestrator based on the document type classification.

### Output Contract

Returns structured data: parsed document sections, extracted and categorized requirements, and identified deadlines. All outputs include confidence scores. Requirements with confidence below 0.7 are flagged for human review.

### Escalation Conditions

- Document parse confidence falls below 0.6 (heavily formatted, scanned image, or corrupted file).
- More than 20% of extracted requirements have categorization confidence below 0.7.
- Contradictory requirements detected (e.g., two mutually exclusive mandatory conditions).
- Document contains embedded files or references to external documents that cannot be resolved.

### Success Metrics

- **Extraction recall:** > 95% of requirements identified compared to human baseline.
- **Categorization accuracy:** > 90% of requirements correctly categorized (mandatory/scored/informational).
- **Deadline identification:** 100% of submission deadlines correctly extracted.

---

## 3. Content Library Matcher

- **Role:** Worker
- **Type:** Specialist
- **Phase:** 2

### Responsibilities

- Search organizational knowledge bases for content relevant to each extracted requirement.
- Score the relevance of matched content against specific requirement text.
- Identify content gaps where no existing material adequately addresses a requirement.
- Track content freshness and flag stale matches that may need SME review.

### Tools

#### search_knowledge_base

Performs semantic and keyword search across configured content repositories.

- **Inputs:** \`query\` (string, the requirement text or a derived search query), \`filters\` (optional object with \`content_type\` array, \`max_age_days\` number, \`source_repository\` string), \`max_results\` (number, default 10).
- **Outputs:** \`results\` (array of objects, each with \`content_id\`, \`title\`, \`snippet\` (relevant excerpt), \`source\` (repository name and path), \`last_updated\` (ISO-8601), \`content_type\` (string: "previous_response", "policy_document", "technical_spec", "marketing_material")).

#### score_content_relevance

Evaluates how well a piece of content addresses a specific requirement.

- **Inputs:** \`requirement\` (object with \`requirement_id\`, \`text\`, \`category\`), \`content_candidates\` (array of content objects from search results).
- **Outputs:** \`scored_matches\` (array of objects, each with \`content_id\`, \`relevance_score\` (number 0-100), \`coverage_assessment\` (string: "full", "partial", "tangential"), \`reuse_recommendation\` (string: "use_as_is", "adapt", "reference_only"), \`staleness_flag\` (boolean, true if content is older than 12 months)).

#### identify_content_gaps

Analyzes the set of requirements against available content matches to find gaps.

- **Inputs:** \`requirements\` (array of categorized requirement objects), \`matches\` (array of scored match results, keyed by requirement_id).
- **Outputs:** \`gaps\` (array of objects, each with \`requirement_id\`, \`gap_type\` (string: "no_match", "low_relevance", "stale_only", "partial_coverage"), \`recommended_action\` (string: "generate_new", "request_sme_input", "adapt_partial_match"), \`priority\` (string based on requirement category and evaluation weight)).

### Input Contract

Receives categorized requirements from the Requirements Analyzer (via the Orchestrator). Needs access to configured knowledge base endpoints.

### Output Contract

Returns a mapping of requirements to content matches with relevance scores, plus a gap analysis identifying requirements that need original content or SME input.

### Escalation Conditions

- Knowledge base connection fails or returns errors.
- More than 50% of mandatory requirements have no match above relevance score 60.
- Content freshness check reveals the majority of top matches are older than 18 months.

### Success Metrics

- **Average relevance score:** > 80% for top match per requirement.
- **Gap identification accuracy:** > 90% agreement with human assessment of content coverage.
- **Search latency:** < 5 seconds per requirement query.

---

## 4. Response Composer

- **Role:** Worker
- **Type:** Specialist
- **Phase:** 2

### Responsibilities

- Assemble draft responses from matched content, adapting tone and structure to match the RFx requirements.
- Generate new content for requirements where no adequate existing content was found.
- Maintain consistent formatting, voice, and structure across all response sections.
- Flag all generated (non-reused) content for mandatory SME review.

### Tools

#### assemble_response_draft

Combines matched content into a structured response for a set of requirements.

- **Inputs:** \`requirements\` (array of requirement objects with their matched content), \`response_structure\` (object defining section order, numbering scheme, and formatting rules from the RFx), \`tone_guidelines\` (optional object with \`formality_level\`, \`voice\`, \`prohibited_terms\`).
- **Outputs:** \`draft_response\` (object with \`sections\` array, each containing \`section_id\`, \`requirement_ids\` addressed, \`content\` (assembled text), \`content_sources\` (array of content_ids used), \`is_generated\` (boolean, false for reused content), \`confidence\` (number 0-1)).

#### generate_gap_content

Creates original content for requirements where no suitable existing content was found.

- **Inputs:** \`requirement\` (object with full requirement details), \`context\` (object with \`organization_profile\` if available, \`related_content\` array of tangentially relevant matches, \`gap_type\` from Content Library Matcher).
- **Outputs:** \`generated_content\` (object with \`text\`, \`confidence\` (number 0-1), \`requires_sme_review\` (always true for generated content), \`review_notes\` (string describing what the SME should verify), \`sources_referenced\` (array of content_ids used as context)).

#### format_response_document

Applies formatting rules from the RFx to the assembled draft.

- **Inputs:** \`draft_sections\` (array of section objects from assemble_response_draft), \`formatting_rules\` (object with \`page_limit\`, \`font_requirements\`, \`margin_requirements\`, \`section_numbering_scheme\`, \`required_appendices\`).
- **Outputs:** \`formatted_document\` (object with \`sections\` array with formatting applied, \`total_pages\` (estimated), \`formatting_warnings\` (array of strings describing any rule violations, e.g., "Section 3 exceeds recommended length by 200 words")).

### Input Contract

Receives requirement-to-content mappings and gap analysis from the Content Library Matcher (via Orchestrator). Also receives formatting rules extracted by the Requirements Analyzer.

### Output Contract

Returns a complete draft response document with clear tracking of which content is reused vs. generated. All generated content is flagged for SME review. Formatting warnings are included for any rule violations.

### Escalation Conditions

- More than 30% of the response consists of generated (non-reused) content. This indicates a significant knowledge base gap.
- Formatting rules cannot be satisfied (e.g., response exceeds page limit even after condensing).
- Contradictory formatting requirements are detected.

### Success Metrics

- **Response completeness:** 100% of mandatory requirements have a corresponding response section.
- **Content reuse rate:** > 60% of response content sourced from existing library (higher is better, indicates library health).
- **Formatting compliance:** Zero formatting rule violations in final output.

---

## 5. Compliance Validator

- **Role:** Worker
- **Type:** Specialist
- **Phase:** 2

### Responsibilities

- Cross-check every response section against the full set of mandatory requirements.
- Validate that formatting rules (page limits, font, margins, section structure) are met.
- Flag incomplete, non-responsive, or ambiguous response sections.
- Produce a compliance report summarizing pass/fail status for every requirement and formatting rule.

### Tools

#### validate_mandatory_requirements

Checks that every mandatory requirement has a corresponding response that substantively addresses it.

- **Inputs:** \`mandatory_requirements\` (array of requirement objects where category is "mandatory"), \`response_sections\` (array of draft response sections with their addressed requirement_ids).
- **Outputs:** \`validation_results\` (array of objects, each with \`requirement_id\`, \`status\` (string: "addressed", "partially_addressed", "not_addressed", "non_responsive"), \`matched_section_id\` (string or null), \`assessment_notes\` (string describing any concerns), \`confidence\` (number 0-1)).

#### check_formatting_rules

Validates the formatted document against all formatting requirements specified in the RFx.

- **Inputs:** \`formatted_document\` (object from Response Composer), \`formatting_rules\` (object with all extracted formatting requirements).
- **Outputs:** \`formatting_compliance\` (object with \`overall_status\` (string: "compliant", "non_compliant", "warnings"), \`checks\` (array of objects, each with \`rule\` (string), \`status\` (string: "pass", "fail", "warning"), \`details\` (string))).

#### flag_incomplete_sections

Identifies response sections that are incomplete, vague, or non-responsive to their target requirements.

- **Inputs:** \`response_sections\` (array of draft response sections), \`requirements\` (array of all requirements with categories).
- **Outputs:** \`flags\` (array of objects, each with \`section_id\`, \`requirement_id\`, \`flag_type\` (string: "incomplete", "vague", "non_responsive", "placeholder_detected", "unsubstantiated_claim"), \`severity\` (string: "blocking", "warning"), \`description\` (string), \`recommended_action\` (string)).

### Input Contract

Receives the formatted draft response from the Response Composer (via Orchestrator), the full set of categorized requirements from the Requirements Analyzer, and the formatting rules.

### Output Contract

Returns a comprehensive compliance report with: per-requirement validation status, formatting compliance results, and flagged sections with severity and recommended actions. Any "blocking" flags prevent the response from proceeding to human approval without remediation.

### Escalation Conditions

- Any mandatory requirement has status "not_addressed."
- Formatting compliance overall status is "non_compliant" and cannot be remediated automatically.
- More than 3 sections flagged as "non_responsive."

### Success Metrics

- **Compliance check accuracy:** > 98% agreement with human compliance review.
- **False negative rate:** < 1% (missed compliance issues that a human reviewer catches).
- **Validation throughput:** Complete validation of a full RFx response in under 10 minutes.
`;
