export const content = `# Business Context

The business problem, current state pain points, and target outcomes for Employee Onboarding Automation.

---

## The Onboarding Challenge

Employee onboarding sits at the intersection of HR, IT, legal, and operations. It touches more systems and more people than almost any other recurring business process. And it happens every time someone is hired, which for growing companies means constantly.

The fundamental challenge: onboarding requires coordinating dozens of tasks across multiple departments, each with different systems, different timelines, and different owners. No single person or team has visibility into the full picture. Things fall through the cracks because the process depends on manual handoffs, tribal knowledge, and individual diligence.

**Scale makes it worse, not better.** A company hiring 10 people per quarter can handle onboarding with spreadsheets and personal attention. A company hiring 50 or 100 cannot. The process that worked at 200 employees breaks at 500 and is unmanageable at 2,000.

---

## Current State Pain Points

These are the problems that exist in most organizations before automation. Not all will apply to every company, but most companies experience at least three of the five.

### Manual Checklists

Onboarding tasks are tracked in spreadsheets, wikis, or email threads. Each new hire gets a copy of the checklist. Someone (HR generalist, hiring manager, or office coordinator) manually checks off items as they are completed. Items get missed. Different people follow different versions of the checklist. There is no real-time visibility into where things stand.

### Tribal Knowledge

"Ask Sarah in IT to set up the VPN" and "Make sure you CC finance on the laptop request." Critical process steps live in people's heads, not in systems. When those people are on vacation, busy, or leave the company, steps get skipped. New HR team members take months to learn all the informal procedures.

### Delayed Provisioning

IT provisioning is the most common bottleneck. Account creation requires tickets to multiple teams. Hardware procurement has lead times. Software licenses require budget approval. The result: new hires show up on Day 1 and cannot log in, do not have a laptop, or do not have access to the tools they need. They sit idle while IT catches up. First impressions are terrible.

### Inconsistent Experience

Onboarding quality varies wildly depending on who handles it. Some hiring managers plan structured first weeks with introductions, training, and mentorship. Others hand the new hire a laptop and say "let me know if you have questions." This inconsistency affects retention: employees who have a poor onboarding experience are 2x more likely to look for a new job within the first year.

### Compliance Risk

Tax forms, I-9 verification, mandatory training, and policy acknowledgments have legal deadlines. Manual processes miss them because:

- Reminders are sent by people who forget
- Tracking is in spreadsheets that nobody updates
- Responsibility is split across HR, legal, and hiring managers with no clear owner
- The consequences of missing a deadline are invisible until an audit surfaces them

---

## Impact of Poor Onboarding

### Employee Turnover

Employees who report a negative onboarding experience are 2x more likely to seek a new opportunity within 12 months. At an average replacement cost of 50-200% of annual salary (depending on role seniority), this is the most expensive consequence of bad onboarding.

### Time-to-Productive

The longer it takes a new hire to get fully set up and trained, the longer the company waits for return on its hiring investment. For technical roles with 3-6 month ramp times, even a 2-week delay in onboarding has measurable productivity impact.

### Compliance Exposure

Missed I-9 deadlines: fines range from $252 to $2,507 per violation for first offenses (US). Missed tax form processing: payroll errors and IRS penalties. Missed mandatory training: liability exposure for harassment, safety, and data privacy incidents.

### Manager and HR Burden

Every hour a hiring manager spends chasing IT tickets, filling out forms, and sending reminder emails is an hour they are not spending on their actual job. HR generalists managing 20+ concurrent onboardings spend the majority of their time on administrative coordination rather than strategic work.

---

## Industry Benchmarks

These are representative benchmarks from published HR research. Use them as reference points, not absolute targets.

| Metric | Typical | Good | Best-in-Class |
|--------|---------|------|---------------|
| Time to full productivity | 8-12 weeks | 4-8 weeks | 2-4 weeks |
| Onboarding satisfaction (NPS) | 10-30 | 30-50 | 50-80 |
| Day 1 IT readiness | 40-60% | 70-85% | 90-99% |
| Compliance completion within 30 days | 65-80% | 85-95% | 98-100% |
| First-year voluntary turnover | 20-30% | 12-18% | 5-10% |
| HR hours per onboarding | 10-20 hours | 5-10 hours | 2-4 hours |

Sources vary by industry and company size. Measure your own baseline before comparing to benchmarks.

---

## Target Outcomes

What the automated system should achieve, expressed as improvements over the current manual process.

### Primary Outcomes

1. **Reduce time-to-productive by 30% or more.** Parallel execution of provisioning, document collection, and training eliminates the sequential bottlenecks that delay manual onboarding.

2. **Achieve 100% compliance completion within 30 days.** Automated tracking with escalation ensures no compliance item is forgotten or delayed past its deadline.

3. **Deliver Day 1 readiness for 95%+ of new hires.** Automated IT provisioning triggered immediately on hire confirmation means accounts, hardware, and software are ready before the employee arrives.

4. **Eliminate manual tracking overhead.** HR generalists and hiring managers stop spending time on spreadsheets, reminder emails, and status check meetings. The system tracks everything and reports proactively.

### Secondary Outcomes

5. **Consistent experience regardless of location, department, or manager.** Every new hire goes through the same structured, complete onboarding process. Quality does not depend on individual diligence.

6. **Onboarding NPS above 60.** A smooth, fast onboarding experience is one of the strongest signals a new hire receives about the company's competence and culture.

7. **Reusable patterns for offboarding and transfers.** The orchestration pattern, integration infrastructure, and agent architecture built for onboarding directly apply to employee offboarding (reverse provisioning) and internal transfers (delta provisioning).
`;
