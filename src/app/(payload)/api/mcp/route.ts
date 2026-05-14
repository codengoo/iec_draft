/**
 * MCP HTTP endpoint — Streamable HTTP transport (stateless per-request).
 *
 * Endpoint: POST|GET|DELETE /api/mcp
 *
 * Authentication: Authorization: Bearer <MCP_API_KEY>
 *
 * Every request creates a fresh McpServer + transport instance.
 * No session state is persisted; each AI Agent turn is self-contained.
 *
 * CORS is open for all origins (endpoint is key-protected).
 */
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import config from '@payload-config'
import { getPayload } from 'payload'

import { createMcpServer } from '../../../../mcp/server'

// ─── CORS headers ────────────────────────────────────────────────────────────
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, mcp-session-id, Last-Event-ID, mcp-protocol-version',
  'Access-Control-Expose-Headers': 'mcp-session-id, mcp-protocol-version',
}

function corsResponse(status: number, body?: BodyInit | null): Response {
  return new Response(body ?? null, { status, headers: CORS_HEADERS })
}

// ─── Auth guard ───────────────────────────────────────────────────────────────
function isAuthorized(request: Request): boolean {
  const apiKey = process.env.MCP_API_KEY
  if (!apiKey) return false // key not configured → deny all

  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  return token === apiKey
}

// ─── Core handler ─────────────────────────────────────────────────────────────
async function handleMcp(request: Request): Promise<Response> {
  if (!isAuthorized(request)) {
    return corsResponse(
      401,
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32001, message: 'Unauthorized' },
        id: null,
      }),
    )
  }

  const payload = await getPayload({ config })
  const server = createMcpServer(payload)
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — fresh instance per request
    enableJsonResponse: true, // return JSON directly; avoids SSE stream being closed by finally block
  })

  await server.connect(transport)

  let mcpResponse: Response
  try {
    mcpResponse = await transport.handleRequest(request)
  } finally {
    // Clean up after response is ready (transport is stateless)
    transport.close().catch(() => {})
    server.close().catch(() => {})
  }

  // Merge MCP response headers with CORS headers
  const headers = new Headers(mcpResponse.headers)
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value)
  }

  return new Response(mcpResponse.body, {
    status: mcpResponse.status,
    statusText: mcpResponse.statusText,
    headers,
  })
}

// ─── Route exports ────────────────────────────────────────────────────────────

export async function OPTIONS(): Promise<Response> {
  return corsResponse(204)
}

export async function POST(request: Request): Promise<Response> {
  return handleMcp(request)
}

export async function GET(request: Request): Promise<Response> {
  return handleMcp(request)
}

export async function DELETE(request: Request): Promise<Response> {
  return handleMcp(request)
}
