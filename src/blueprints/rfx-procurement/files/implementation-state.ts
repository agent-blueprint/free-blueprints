export const content = `schema_version: "1.0"
overall_status: not_started

platform:
  name: TBD
  version: TBD
  environment: TBD

phases:
  phase_1:
    status: not_started
    started_at:
    completed_at:
    decision_gate_passed: false
    notes:

  phase_2:
    status: not_started
    started_at:
    completed_at:
    notes:

agents:
  - name: RFx Orchestrator
    role: manager
    status: not_started
    phase: 1
    platform_entity_id:
    platform_entity_type:
    tools_implemented: []
    integration_endpoints: []
    notes:

  - name: Requirements Analyzer
    role: worker
    status: not_started
    phase: 1
    platform_entity_id:
    platform_entity_type:
    tools_implemented: []
    integration_endpoints: []
    notes:

  - name: Content Library Matcher
    role: worker
    status: not_started
    phase: 2
    platform_entity_id:
    platform_entity_type:
    tools_implemented: []
    integration_endpoints: []
    notes:

  - name: Response Composer
    role: worker
    status: not_started
    phase: 2
    platform_entity_id:
    platform_entity_type:
    tools_implemented: []
    integration_endpoints: []
    notes:

  - name: Compliance Validator
    role: worker
    status: not_started
    phase: 2
    platform_entity_id:
    platform_entity_type:
    tools_implemented: []
    integration_endpoints: []
    notes:

integrations:
  document_intake:
    status: not_started
    channel:
    endpoint:
    notes:

  knowledge_base:
    status: not_started
    system:
    endpoint:
    notes:

  notifications:
    status: not_started
    channel:
    endpoint:
    notes:

  output_destination:
    status: not_started
    system:
    endpoint:
    notes:

metrics:
  requirements_extraction_accuracy:
    target: "> 90% recall, > 85% precision"
    actual:
    measured_at:

  processing_time_reduction:
    target: "> 40%"
    actual:
    measured_at:

  mandatory_requirements_missed:
    target: "0"
    actual:
    measured_at:

  content_match_relevance:
    target: "> 80% average"
    actual:
    measured_at:

  compliance_check_accuracy:
    target: "> 98%"
    actual:
    measured_at:

deviations: []
`;
