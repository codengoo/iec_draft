/**
 * MCP Server factory.
 *
 * Call `createMcpServer(payload)` to get a configured `McpServer` instance
 * with all job tools registered.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Payload } from 'payload'

import { registerJobTools } from './tools/jobs'

const SERVER_NAME = 'iec-payload-mcp'
const SERVER_VERSION = '1.0.0'

export function createMcpServer(payload: Payload): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: {
        tools: {},
      },
    },
  )

  registerJobTools(server, payload)

  return server
}
