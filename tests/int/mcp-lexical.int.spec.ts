/**
 * Unit tests for the textToLexical utility.
 *
 * This is a pure function — no database or Payload setup is required.
 */
import { describe, expect, it } from 'vitest'

import { textToLexical } from '@/mcp/utils/lexical.js'

// ─── Helper types ─────────────────────────────────────────────────────────────
type AnyNode = Record<string, unknown>

function getChildren(result: ReturnType<typeof textToLexical>) {
  return result!.root.children as AnyNode[]
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('textToLexical', () => {
  // ── Null / empty inputs ────────────────────────────────────────────────────

  it('returns undefined for an empty string', () => {
    expect(textToLexical('')).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(textToLexical(null)).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(textToLexical(undefined)).toBeUndefined()
  })

  it('returns undefined for whitespace-only string', () => {
    expect(textToLexical('   ')).toBeUndefined()
  })

  // ── Root metadata ──────────────────────────────────────────────────────────

  it('returns a valid Lexical root node', () => {
    const result = textToLexical('hello')
    expect(result).toBeDefined()
    expect(result!.root.type).toBe('root')
    expect(result!.root.version).toBe(1)
    expect(result!.root.direction).toBe('ltr')
  })

  // ── Paragraph ─────────────────────────────────────────────────────────────

  it('converts a plain text line to a paragraph node', () => {
    const result = textToLexical('Hello world')
    const nodes = getChildren(result)
    expect(nodes).toHaveLength(1)
    expect(nodes[0]!.type).toBe('paragraph')
    const textNodes = nodes[0]!.children as AnyNode[]
    expect(textNodes[0]!.text).toBe('Hello world')
    expect(textNodes[0]!.format).toBe(0)
  })

  it('creates an empty paragraph for an empty line', () => {
    const result = textToLexical('first\n\nsecond')
    const nodes = getChildren(result)
    // "first", empty line, "second"
    expect(nodes).toHaveLength(3)
    expect(nodes[1]!.type).toBe('paragraph')
    expect((nodes[1]!.children as AnyNode[]).length).toBe(0)
  })

  // ── Headings ──────────────────────────────────────────────────────────────

  it('converts ## to an h2 heading node', () => {
    const result = textToLexical('## My Heading')
    const node = getChildren(result)[0]!
    expect(node.type).toBe('heading')
    expect(node.tag).toBe('h2')
    const textNodes = node.children as AnyNode[]
    expect(textNodes[0]!.text).toBe('My Heading')
  })

  it('converts ### to an h3 heading node', () => {
    const result = textToLexical('### Sub Heading')
    const node = getChildren(result)[0]!
    expect(node.type).toBe('heading')
    expect(node.tag).toBe('h3')
    expect((node.children as AnyNode[])[0]!.text).toBe('Sub Heading')
  })

  it('converts #### to an h4 heading node', () => {
    const result = textToLexical('#### Level Four')
    const node = getChildren(result)[0]!
    expect(node.type).toBe('heading')
    expect(node.tag).toBe('h4')
  })

  // ── Horizontal rule ───────────────────────────────────────────────────────

  it('converts --- to a horizontalrule node', () => {
    const result = textToLexical('---')
    const node = getChildren(result)[0]!
    expect(node.type).toBe('horizontalrule')
    expect(node.version).toBe(1)
  })

  it('converts multiple dashes (----) to a horizontalrule node', () => {
    const result = textToLexical('----')
    const node = getChildren(result)[0]!
    expect(node.type).toBe('horizontalrule')
  })

  // ── Bold inline ───────────────────────────────────────────────────────────

  it('converts **bold** to a bold text node with format=1', () => {
    const result = textToLexical('**important**')
    const para = getChildren(result)[0]!
    const textNodes = para.children as AnyNode[]
    expect(textNodes).toHaveLength(1)
    expect(textNodes[0]!.text).toBe('important')
    expect(textNodes[0]!.format).toBe(1)
  })

  it('parses mixed inline: normal + bold + normal', () => {
    const result = textToLexical('Hello **world** today')
    const para = getChildren(result)[0]!
    const textNodes = para.children as AnyNode[]
    expect(textNodes).toHaveLength(3)
    expect(textNodes[0]!.text).toBe('Hello ')
    expect(textNodes[0]!.format).toBe(0)
    expect(textNodes[1]!.text).toBe('world')
    expect(textNodes[1]!.format).toBe(1)
    expect(textNodes[2]!.text).toBe(' today')
    expect(textNodes[2]!.format).toBe(0)
  })

  it('parses bold at start of line', () => {
    const result = textToLexical('**Leading** bold text')
    const para = getChildren(result)[0]!
    const textNodes = para.children as AnyNode[]
    expect(textNodes[0]!.text).toBe('Leading')
    expect(textNodes[0]!.format).toBe(1)
  })

  it('parses bold at end of line', () => {
    const result = textToLexical('Text ending **bold**')
    const para = getChildren(result)[0]!
    const textNodes = para.children as AnyNode[]
    expect(textNodes[textNodes.length - 1]!.text).toBe('bold')
    expect(textNodes[textNodes.length - 1]!.format).toBe(1)
  })

  // ── Multiline / mixed ─────────────────────────────────────────────────────

  it('produces the correct node sequence for markdown-style input', () => {
    const text = '## Title\nSome text\n---\n### Sub\nMore text'
    const nodes = getChildren(textToLexical(text))
    expect(nodes).toHaveLength(5)
    expect(nodes[0]!.type).toBe('heading') // ## Title
    expect(nodes[1]!.type).toBe('paragraph') // Some text
    expect(nodes[2]!.type).toBe('horizontalrule') // ---
    expect(nodes[3]!.type).toBe('heading') // ### Sub
    expect(nodes[4]!.type).toBe('paragraph') // More text
  })

  it('handles heading with bold inline', () => {
    const result = textToLexical('## **Bold** Title')
    const heading = getChildren(result)[0]!
    expect(heading.type).toBe('heading')
    expect(heading.tag).toBe('h2')
    const textNodes = heading.children as AnyNode[]
    expect(textNodes[0]!.text).toBe('Bold')
    expect(textNodes[0]!.format).toBe(1)
  })

  it('preserves a single line of plain text as-is', () => {
    const text = 'Join our team to build world-class software.'
    const result = textToLexical(text)
    const para = getChildren(result)[0]!
    expect((para.children as AnyNode[])[0]!.text).toBe(text)
  })
})
