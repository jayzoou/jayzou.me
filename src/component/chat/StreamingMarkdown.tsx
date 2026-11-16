import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import CodeBlock from '../CodeBlock'

const StreamingMarkdown = ({ text }: { text: string }) => <div className="prose chat-markdown">
  <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} skipHtml components={{
    pre: CodeBlock,
    a: ({ href, children }) => <a href={href} rel="noopener noreferrer">{children}</a>,
  }}>{text}</Markdown>
</div>

export default StreamingMarkdown
