# Free AI Agent Blueprints (MCP Server)

Pre-built AI agent blueprints for common business processes. No signup, no API key, no token.

Any MCP-compatible coding agent can discover and consume these blueprints immediately.

## Available Blueprints

| Blueprint | Agents | Pattern | Description |
|-----------|--------|---------|-------------|
| RFx Procurement Automation | 5 | Manager-Workers | Automate RFx intake, requirements analysis, response composition, and compliance validation |
| Employee Onboarding | 5 | Manager-Workers | Automate document processing, IT provisioning, training assembly, and progress tracking |

## Usage

### Claude Code / Cursor (stdio)

```bash
npm install -g @agent-blueprint/free-blueprints
```

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "free-blueprints": {
      "command": "free-blueprints-mcp"
    }
  }
}
```

Then ask your agent: "List available blueprints and deploy the RFx procurement one."

### Remote (Streamable HTTP)

For Managed Agents, AI Control Tower, or any HTTP MCP client:

```
https://free-blueprints-mcp.agentblueprint.workers.dev/mcp
```

## Tools

### `list_blueprints`

Returns the catalog of available free blueprints.

### `get_blueprint`

Returns a full blueprint by ID as a JSON manifest with all files ready to write to disk.

**Parameters:**
- `blueprintId` (string, required) — Blueprint ID from `list_blueprints`

## What you get

Each blueprint includes:
- **SKILL.md** — Overview with frontmatter metadata
- **GETTING-STARTED.md** — Step-by-step implementation guide
- **AGENTS.md** — Universal agent sync rules
- **implementation-state.yaml** — Progress tracking template
- **Reference docs** — Agent specs, architecture decisions, guardrails, evaluation criteria, platform connectivity, business context

## Want a custom blueprint?

These free blueprints cover generic business processes. For blueprints tailored to your company (your systems, your data, your org structure, your financials), visit [agentblueprint.ai](https://app.agentblueprint.ai).

## License

MIT
