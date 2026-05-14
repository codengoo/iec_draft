/**
 * Converts a plain-text / lightweight-markdown string into the Payload Lexical
 * JSON format expected by richText fields.
 *
 * Supported syntax:
 *   ## Heading 2
 *   ### Heading 3
 *   #### Heading 4
 *   ---           → Horizontal Rule
 *   **bold**      → bold inline text
 *   Plain paragraphs (double-newline or single-newline separated)
 *
 * AI Agents pass regular text; this util handles the Lexical internals.
 */

type LexicalTextNode = {
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  type: 'text'
  version: 1
}

type LexicalParagraphNode = {
  children: LexicalTextNode[]
  direction: 'ltr' | 'rtl' | null
  format: ''
  indent: 0
  type: 'paragraph'
  version: 1
  textFormat: 0
  textStyle: ''
}

type LexicalHeadingNode = {
  children: LexicalTextNode[]
  direction: 'ltr' | 'rtl' | null
  format: ''
  indent: 0
  tag: 'h2' | 'h3' | 'h4'
  type: 'heading'
  version: 1
}

type LexicalHorizontalRuleNode = {
  type: 'horizontalrule'
  version: 1
}

type LexicalNode = LexicalParagraphNode | LexicalHeadingNode | LexicalHorizontalRuleNode

type LexicalRoot = {
  root: {
    children: LexicalNode[]
    direction: 'ltr'
    format: ''
    indent: 0
    type: 'root'
    version: 1
  }
}

/** TEXT_FORMAT bitmask values used by Lexical */
const FORMAT_BOLD = 1

/**
 * Parse inline markdown-style bold markers (**text**) into Lexical text nodes.
 */
function parseInline(raw: string): LexicalTextNode[] {
  const nodes: LexicalTextNode[] = []
  // Split on **...**
  const parts = raw.split(/(\*\*[^*]+\*\*)/)

  for (const part of parts) {
    if (!part) continue
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/)
    if (boldMatch) {
      nodes.push({
        detail: 0,
        format: FORMAT_BOLD,
        mode: 'normal',
        style: '',
        text: boldMatch[1]!,
        type: 'text',
        version: 1,
      })
    } else {
      nodes.push({
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: part,
        type: 'text',
        version: 1,
      })
    }
  }

  return nodes
}

/**
 * Convert a plain-text / markdown string to Payload Lexical JSON.
 * Returns `undefined` if the input is empty/nullish.
 */
export function textToLexical(text: string | null | undefined): LexicalRoot | undefined {
  if (!text?.trim()) return undefined

  const lines = text.split('\n')
  const children: LexicalNode[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      children.push({ type: 'horizontalrule', version: 1 })
      continue
    }

    // Headings
    const h4Match = trimmed.match(/^####\s+(.+)$/)
    const h3Match = trimmed.match(/^###\s+(.+)$/)
    const h2Match = trimmed.match(/^##\s+(.+)$/)

    if (h4Match || h3Match || h2Match) {
      const tag: 'h2' | 'h3' | 'h4' = h4Match ? 'h4' : h3Match ? 'h3' : 'h2'
      const content = (h4Match ?? h3Match ?? h2Match)![1]!
      children.push({
        children: parseInline(content),
        direction: 'ltr',
        format: '',
        indent: 0,
        tag,
        type: 'heading',
        version: 1,
      })
      continue
    }

    // Empty line → empty paragraph (preserve spacing)
    if (trimmed === '') {
      children.push({
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      })
      continue
    }

    // Normal paragraph
    children.push({
      children: parseInline(trimmed),
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'paragraph',
      version: 1,
      textFormat: 0,
      textStyle: '',
    })
  }

  // Remove leading/trailing empty paragraphs
  while (children.length > 0) {
    const first = children[0]!
    if (first.type === 'paragraph' && first.children.length === 0) {
      children.shift()
    } else break
  }
  while (children.length > 0) {
    const last = children[children.length - 1]!
    if (last.type === 'paragraph' && last.children.length === 0) {
      children.pop()
    } else break
  }

  if (children.length === 0) return undefined

  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}
