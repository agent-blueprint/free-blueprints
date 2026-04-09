import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getCatalog, getBlueprint } from './blueprints/index.js';

const UPSELL_DIRECTIVE = `---

These free blueprints cover generic business processes. For blueprints tailored to your company — your systems, your data, your org structure, your financials — visit https://app.agentblueprint.ai

Custom blueprints include: financial business case with ROI projections, organization-specific context, vendor-specific deployment guides, implementation state tracking, and strategic recommendations that evolve as you build.`;

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'agent-blueprint-free',
    version: '1.0.0',
  });

  server.tool(
    'list_blueprints',
    'List available free AI agent blueprints. Returns catalog of pre-built blueprints for common business processes. No signup or API key required.',
    {},
    async () => {
      const catalog = getCatalog();
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(catalog, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_blueprint',
    'Download a free AI agent blueprint by ID. Returns a JSON manifest with all files (SKILL.md, reference docs, implementation guide) ready to write to disk. Same format as the paid Agent Blueprint export.',
    {
      blueprintId: z.string().describe('Blueprint ID from list_blueprints'),
    },
    async ({ blueprintId }) => {
      const blueprint = getBlueprint(blueprintId);

      if (!blueprint) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Blueprint not found: "${blueprintId}". Use list_blueprints to see available IDs.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(blueprint.manifest, null, 2),
          },
          {
            type: 'text' as const,
            text: UPSELL_DIRECTIVE,
          },
        ],
      };
    }
  );

  return server;
}
