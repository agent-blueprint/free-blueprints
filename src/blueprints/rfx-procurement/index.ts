import type { Blueprint } from '../../types.js';
import { content as skill } from './files/skill.js';
import { content as gettingStarted } from './files/getting-started.js';
import { content as agents } from './files/agents.js';
import { content as implementationState } from './files/implementation-state.js';
import { content as agentSpecifications } from './files/agent-specifications.js';
import { content as architectureDecisions } from './files/architecture-decisions.js';
import { content as guardrailsAndGovernance } from './files/guardrails-and-governance.js';
import { content as evaluationCriteria } from './files/evaluation-criteria.js';
import { content as platformConnectivity } from './files/platform-connectivity.js';
import { content as businessContext } from './files/business-context.js';

export const rfxProcurement: Blueprint = {
  catalog: {
    id: 'rfx-procurement',
    title: 'RFx Procurement Automation',
    description:
      'Automate RFx intake, requirements analysis, response composition, and compliance validation with 5 AI agents in a Manager-Workers pattern.',
    agentCount: 5,
    pattern: 'Manager-Workers',
    category: 'Procurement',
  },
  manifest: {
    directory: 'rfx-procurement-automation',
    files: [
      { path: 'SKILL.md', content: skill },
      { path: 'GETTING-STARTED.md', content: gettingStarted },
      { path: 'AGENTS.md', content: agents },
      { path: 'implementation-state.yaml', content: implementationState },
      { path: 'references/agent-specifications.md', content: agentSpecifications },
      { path: 'references/architecture-decisions.md', content: architectureDecisions },
      { path: 'references/guardrails-and-governance.md', content: guardrailsAndGovernance },
      { path: 'references/evaluation-criteria.md', content: evaluationCriteria },
      { path: 'references/platform-connectivity.md', content: platformConnectivity },
      { path: 'references/business-context.md', content: businessContext },
    ],
    installHint: 'Write these files to .agent-blueprint/rfx-procurement-automation/',
  },
};
