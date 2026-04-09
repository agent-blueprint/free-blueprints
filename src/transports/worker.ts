import {
  WebStandardStreamableHTTPServerTransport,
} from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createServer } from '../server.js';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(
        JSON.stringify({
          name: 'agent-blueprint-free',
          status: 'ok',
          tools: ['list_blueprints', 'get_blueprint'],
          docs: 'https://github.com/agent-blueprint/free-blueprints',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // MCP endpoint
    if (request.method === 'POST' && url.pathname === '/mcp') {
      const server = createServer();

      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // Stateless — no session tracking
      });

      await server.connect(transport);
      return transport.handleRequest(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
