export const content = `schema_version: "1.0"
overall_status: not_started

platform:
  name: TBD
  version: TBD
  environment: TBD

agents:
  - name: Onboarding Orchestrator
    type: manager
    status: not_started
    phase: 1
    tools_implemented: []
    integrations_connected: []
    tests_passing: false
    notes: ""

  - name: Document Processor
    type: worker
    status: not_started
    phase: 1
    tools_implemented: []
    integrations_connected: []
    tests_passing: false
    notes: ""

  - name: IT Provisioning Coordinator
    type: worker
    status: not_started
    phase: 2
    tools_implemented: []
    integrations_connected: []
    tests_passing: false
    notes: ""

  - name: Training Curriculum Assembler
    type: worker
    status: not_started
    phase: 2
    tools_implemented: []
    integrations_connected: []
    tests_passing: false
    notes: ""

  - name: Progress Tracker
    type: worker
    status: not_started
    phase: 2
    tools_implemented: []
    integrations_connected: []
    tests_passing: false
    notes: ""

pilot:
  status: not_started
  start_date: TBD
  end_date: TBD
  decision_gate:
    document_accuracy: null
    time_reduction: null
    compliance_gaps: null
    critical_errors: null
  stakeholder_signoff: false

full_implementation:
  status: not_started
  start_date: TBD
  end_date: TBD

integrations:
  - name: HR System (new-hire event trigger)
    status: not_started
    notes: ""
  - name: Document Management (e-signature, storage)
    status: not_started
    notes: ""
  - name: Identity Management (directory, SSO)
    status: not_started
    notes: ""
  - name: IT Service Management (tickets, assets)
    status: not_started
    notes: ""
  - name: Learning Management System
    status: not_started
    notes: ""
  - name: Communication Channels (email, chat)
    status: not_started
    notes: ""
`;
