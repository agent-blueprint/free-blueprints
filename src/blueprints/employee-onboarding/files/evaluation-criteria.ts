export const content = `# Evaluation Criteria

Specific metrics, targets, and measurement methodologies for validating the Employee Onboarding Automation system.

---

## Document Processing Accuracy

**Target:** > 98% first-pass completion rate

**Definition:** The percentage of submitted documents that are correctly validated on the first attempt without requiring human intervention or resubmission.

**Measurement methodology:**
- Numerator: documents that pass validation on first submission and require no subsequent correction
- Denominator: total documents submitted
- Measurement period: rolling 30 days
- Exclude: documents rejected due to genuinely incorrect submissions by the new hire (wrong form, missing signature). Count only system errors (valid document incorrectly rejected, invalid document incorrectly accepted).

**Baseline:** Measure the current manual process error rate before automation. Typical manual processes see 15-25% of documents requiring follow-up due to missing fields, wrong forms, or processing errors.

---

## Time-to-Productive

**Target:** > 30% reduction vs. manual baseline

**Definition:** The elapsed time from a new hire's official start date to the date they have all accounts, access, equipment, training, and documentation complete. "Productive" means no outstanding onboarding blockers preventing the hire from doing their job.

**Measurement methodology:**
- Start: employee's official start date in the HR system
- End: date when the onboarding case reaches "complete" status (all tasks resolved, compliance verified)
- Compare: average time-to-productive for automated onboardings vs. average for the last 6 months of manual onboardings
- Segment by: role type, department, office location, remote vs. onsite (these variables significantly affect onboarding complexity)

**Baseline:** Survey hiring managers and HR to establish the current average. Typical ranges: 1-2 weeks for simple roles, 3-6 weeks for complex technical roles.

---

## IT Provisioning Speed (Day 1 Readiness)

**Target:** > 95% of new hires have all IT resources ready on Day 1

**Definition:** On the new hire's first day, they can log in to all required systems, their hardware is physically present (or shipped for remote), and their software is installed or accessible.

**Measurement methodology:**
- Check each new hire's IT provisioning status at 9 AM on their start date
- "Ready" means: all accounts active, all permissions applied, hardware delivered, software licenses assigned
- "Not ready" means: any IT provisioning task still incomplete
- Report the percentage of new hires at "ready" status

**Breakdown tracking:**
- Account creation readiness (target: 99%)
- Hardware delivery readiness (target: 90%, lower due to shipping variability)
- Software license assignment (target: 98%)
- Access permissions applied (target: 97%)

**Baseline:** Audit the last 20 onboardings. For each, check how many had all IT resources on Day 1. Typical baseline: 40-60%.

---

## Training Path Relevance

**Target:** > 85% employee satisfaction score

**Definition:** New hires rate the relevance and usefulness of their assigned training path. Measured via survey at Day 30.

**Measurement methodology:**
- Survey question: "How relevant was your assigned training to your actual role?" (1-5 scale)
- Survey question: "Did your training prepare you for your day-to-day work?" (1-5 scale)
- Survey question: "Was anything missing from your training that you needed?" (free text)
- Score = average of the two numerical questions, converted to percentage (e.g., 4.3/5 = 86%)
- Minimum sample size: 15 completed surveys before reporting the metric

**Segmentation:** Break down by department and role to identify where training paths need improvement. A low score in one department may indicate missing department-specific content, not a system-wide problem.

**Baseline:** If the organization currently surveys onboarding satisfaction, use that. If not, the first cohort of automated onboardings becomes the baseline for future comparison.

---

## Compliance Completion Rate

**Target:** 100% within first 30 days

**Definition:** All mandatory compliance training modules and required documentation completed within 30 calendar days of the hire's start date.

**Measurement methodology:**
- For each new hire, check completion status of all compliance-flagged items at Day 30
- Compliance items include: anti-harassment training, security awareness training, data privacy training, I-9 completion, tax form processing, NDA execution
- 100% means every hire completed every required compliance item. One missed item for one hire means the target is not met.
- Track which specific items are most commonly delayed to identify systemic issues

**Escalation trigger:** If any compliance item is incomplete at Day 20, the Progress Tracker escalates to the hiring manager and HR. This gives 10 days of buffer before the hard deadline.

**Baseline:** Pull the last 6 months of compliance training records. Calculate the percentage completed within 30 days. Typical baseline: 70-85%.

---

## Onboarding NPS

**Target:** > 60

**Definition:** Net Promoter Score measuring new hire satisfaction with the overall onboarding experience.

**Measurement methodology:**
- Survey question at Day 30: "How likely are you to recommend this company's onboarding experience to a friend joining the company?" (0-10 scale)
- NPS = % Promoters (9-10) minus % Detractors (0-6)
- Minimum sample size: 20 responses before reporting
- Also collect: "What was the best part of your onboarding?" and "What would you improve?" (free text)

**Interpretation:** NPS is a lagging indicator that reflects the overall experience, not just the automation. A high NPS with low training relevance scores, for example, suggests the automation is working well but training content needs attention.

**Baseline:** If the organization tracks onboarding NPS, use the current number. Industry benchmarks: average onboarding NPS is 20-40. Top performers reach 60-80.

---

## Operational Metrics (Non-Target, Track for Diagnostics)

These metrics do not have pass/fail targets but should be tracked to diagnose issues and optimize the system:

- **Average tasks per onboarding case:** Tracks complexity. Rising numbers may indicate scope creep or unnecessary tasks.
- **Escalation rate:** Percentage of tasks that require human escalation. Should decrease over time as the system handles more edge cases.
- **Reminder-to-action conversion rate:** Percentage of reminders that result in the recipient completing the action. Low rates indicate reminder fatigue or poor targeting.
- **Agent processing time per task:** How long each agent takes to complete its tasks. Identifies bottlenecks.
- **Integration error rate:** Percentage of API calls to external systems that fail. Identifies unreliable integrations.
`;
