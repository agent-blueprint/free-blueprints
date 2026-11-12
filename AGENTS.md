# AGENTS.md

Free public MCP server for generic AI agent blueprints. No auth, no signup.

## Commands

```bash
npm run build    # TypeScript build
npm run dev      # Watch mode
npm run deploy   # Deploy to Cloudflare Workers
```

## Architecture

- `src/server.ts` — McpServer factory with 2 tools (list_blueprints, get_blueprint)
- `src/types.ts` — BlueprintManifest, BlueprintFile interfaces
- `src/blueprints/` — Blueprint content as TS string exports
- `src/transports/stdio.ts` — npm/CLI entry point (StdioServerTransport)
- `src/transports/worker.ts` — Cloudflare Workers entry point (Streamable HTTP)

## Adding a Blueprint

1. Create `src/blueprints/{slug}/` with `index.ts` and `files/` directory
2. Export each file as a string from `files/*.ts`
3. Register in `src/blueprints/index.ts` catalog
4. Build and test: `npm run build && echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_blueprints","arguments":{}}}' | node dist/transports/stdio.js`

## Output Format

`get_blueprint` must return the same JSON schema as the paid server's `download_blueprint`:
```json
{
  "directory": "slug",
  "files": [{"path": "SKILL.md", "content": "..."}],
  "installHint": "Write these files to .agent-blueprint/slug/"
}
```
