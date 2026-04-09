export const content = `# Evaluation Criteria

Specific metrics, targets, and measurement methodologies for validating the RFx Procurement Automation system. Use these to determine whether the system is performing acceptably and to identify areas for improvement.

---

## 1. Requirements Extraction Accuracy

**Target:** > 95% recall, > 90% precision

**What it measures:** The Requirements Analyzer's ability to identify all real requirements in an RFx document (recall) without flagging non-requirements as requirements (precision).

**Measurement methodology:**

1. Select 10 representative RFx documents spanning different types (RFP, RFQ, RFI), industries, and complexity levels.
2. Have two human annotators independently identify all requirements in each document. Resolve disagreements to produce a gold-standard annotation set.
3. Run each document through the Requirements Analyzer.
4. Calculate recall: (requirements correctly extracted / total requirements in gold standard) x 100.
5. Calculate precision: (requirements correctly extracted / total items the analyzer identified as requirements) x 100.
6. Report both metrics per document and as an aggregate across the test set.

**Frequency:** Measured during Phase 1 pilot, then monthly during production operation.

---

## 2. Requirements Categorization Accuracy

**Target:** > 90% accuracy

**What it measures:** Whether the Requirements Analyzer correctly classifies requirements as mandatory, scored, or informational.

**Measurement methodology:**

1. Using the same gold-standard test set from the extraction accuracy measurement, include human-annotated categories for each requirement.
2. Compare the analyzer's categorization against human annotation.
3. Calculate accuracy: (correctly categorized / total requirements) x 100.
4. Break down errors by type: mandatory misclassified as scored (high severity), scored misclassified as informational (medium severity), informational misclassified as mandatory (low severity, conservative error).

**Frequency:** Measured during Phase 1 pilot, then monthly.

---

## 3. Content Match Relevance Score

**Target:** > 80% average relevance for top match per requirement

**What it measures:** The Content Library Matcher's ability to find content that genuinely addresses each requirement.

**Measurement methodology:**

1. Select 50 requirements across different categories and complexity levels.
2. For each requirement, have a human SME review the top 3 content matches and assign a relevance score (0-100) based on: does this content substantively address the requirement?
3. Compare human relevance scores against the automated relevance scores.
4. Calculate the average automated relevance score for the top match across all 50 requirements.
5. Calculate correlation between human and automated scores to validate the scoring model.

**Frequency:** After Content Library Matcher deployment, then quarterly.

---

## 4. Response Completeness

**Target:** 100% of mandatory requirements addressed

**What it measures:** Whether the final draft response includes a substantive response for every mandatory requirement.

**Measurement methodology:**

1. For each processed RFx, extract the list of mandatory requirements from the Requirements Analyzer output.
2. Map each mandatory requirement to the response sections that address it (using the Compliance Validator output).
3. Have a human reviewer verify the mapping for accuracy.
4. Calculate: (mandatory requirements with a substantive response / total mandatory requirements) x 100.
5. Any score below 100% is a failure. Investigate and remediate each gap.

**Frequency:** Every RFx processed. This is a continuous metric, not a periodic measurement.

---

## 5. Processing Time Reduction

**Target:** > 50% reduction vs. manual baseline

**What it measures:** The end-to-end time savings from automated processing compared to the manual process.

**Measurement methodology:**

1. Establish a manual baseline: time the current manual process for 5 representative RFx documents from intake to draft-ready. Include all activities: document reading, requirements extraction, content searching, response drafting, and internal review.
2. Process the same (or equivalent) documents through the automated system. Measure wall-clock time from document intake to draft-ready (excluding human approval gate wait time).
3. Calculate: ((manual_time - automated_time) / manual_time) x 100.
4. Report per-stage breakdowns (requirements extraction time, content matching time, response composition time, compliance validation time) to identify bottlenecks.

**Frequency:** Measured during Phase 1 pilot (for extraction only), then after full deployment for end-to-end processing.

---

## 6. Compliance Check Accuracy

**Target:** > 98% accuracy

**What it measures:** The Compliance Validator's ability to correctly identify compliance issues and correctly pass compliant sections.

**Measurement methodology:**

1. Select 5 completed RFx responses with known compliance profiles (some fully compliant, some with deliberate issues).
2. Run the Compliance Validator on each.
3. Have a human compliance reviewer independently assess the same responses.
4. Calculate accuracy: (correct compliance assessments / total assessments) x 100.
5. Separately track false negatives (missed compliance issues, the dangerous error) and false positives (flagged non-issues, the annoying error). False negative rate must be < 1%.

**Frequency:** After Compliance Validator deployment, then monthly.

---

## 7. Stakeholder Satisfaction

**Target:** > 4.0 / 5.0

**What it measures:** Whether the humans working with the system (proposal managers, SMEs, leadership) find it useful, trustworthy, and efficient.

**Measurement methodology:**

1. After each RFx is processed (or after a batch of RFx in high-volume periods), send a short survey to stakeholders who interacted with the system.
2. Survey questions (1-5 scale):
   - "The system accurately extracted the RFx requirements."
   - "The matched content was relevant and useful."
   - "The draft response was a good starting point that reduced my effort."
   - "I trust the system's compliance checks."
   - "Overall, the system saved me time on this RFx."
3. Calculate the average across all questions and all respondents.
4. Track trends over time. A declining score indicates a problem even if it remains above the target.

**Frequency:** Per RFx or monthly (whichever is practical given volume).

---

## 8. Content Reuse Rate

**Target:** > 60% of response content sourced from existing knowledge base

**What it measures:** The health of the organizational knowledge base and the effectiveness of the Content Library Matcher.

**Measurement methodology:**

1. For each completed response, calculate the percentage of content that was sourced from the knowledge base (reused) vs. generated new by the Response Composer.
2. Track this metric per RFx and as a rolling average.
3. A declining reuse rate may indicate: the knowledge base is becoming stale, new types of RFx are being received that the library does not cover, or the Content Library Matcher's relevance scoring needs recalibration.

**Frequency:** Every RFx processed. Review trends monthly.

---

## Summary Table

| # | Metric | Target | Phase | Frequency |
|---|--------|--------|-------|-----------|
| 1 | Requirements extraction accuracy | > 95% recall, > 90% precision | 1 | Monthly |
| 2 | Requirements categorization accuracy | > 90% | 1 | Monthly |
| 3 | Content match relevance score | > 80% average | 2 | Quarterly |
| 4 | Response completeness (mandatory) | 100% | 2 | Every RFx |
| 5 | Processing time reduction | > 50% vs. manual | 1+2 | Per phase |
| 6 | Compliance check accuracy | > 98% | 2 | Monthly |
| 7 | Stakeholder satisfaction | > 4.0 / 5.0 | 1+2 | Monthly |
| 8 | Content reuse rate | > 60% | 2 | Every RFx |
`;
