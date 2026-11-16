import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { validateUIMessages } from 'ai'
import { z } from 'zod'
import { createChatTransport, messageSchemas } from '../../lib/ai/client'
import type { Artifact, PortfolioMessage } from '../../lib/ai/contracts'
import ToolCard from './ToolCard'
import CopyReply from './CopyReply'

const ArtifactPanel = lazy(() => import('../artifact/ArtifactPanel'))
const StreamingMarkdown = lazy(() => import('./StreamingMarkdown'))
const storageKey = 'jay-ai-chat-v1'
const savedSchema = z.object({ version: z.literal(1), messages: z.array(z.unknown()).max(40) })
const prompts = ['介绍一下你的技术背景', '有哪些关于闭包的文章？', '写一个防抖组件 Demo', '如何联系你？']

const ChatWorkspace = () => {
  const transport = useMemo(() => createChatTransport(), [])
  const { messages, setMessages, sendMessage, status, stop, error, clearError, regenerate } = useChat<PortfolioMessage>({ transport, throttle: 40, ...messageSchemas })
  const [ready, setReady] = useState(false)
  const [input, setInput] = useState('')
  const [artifact, setArtifact] = useState<Artifact | null>(null)
  const [notice, setNotice] = useState('')
  const [resetting, setResetting] = useState(false)
  const log = useRef<HTMLDivElement>(null)
  const follow = useRef(true)
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const raw = sessionStorage.getItem(storageKey)
        if (raw && raw.length < 200_000) {
          const saved = savedSchema.parse(JSON.parse(raw))
          const validated = await validateUIMessages<PortfolioMessage>({ messages: saved.messages, ...messageSchemas })
          if (!cancelled) setMessages(validated)
        }
      } catch { /* Storage may be unavailable or contain a previous contract. */ }
      if (!cancelled) setReady(true)
    })()
    return () => { cancelled = true; void stop() }
  }, [setMessages, stop])

  useEffect(() => {
    if (!ready || busy || resetting) return
    try { sessionStorage.setItem(storageKey, JSON.stringify({ version: 1, messages: messages.slice(-40) })) } catch { /* Chat remains usable without storage. */ }
  }, [messages, ready, busy, resetting])

  useEffect(() => {
    if (follow.current && log.current) log.current.scrollTop = log.current.scrollHeight
  }, [messages, status])

  const submit = (text: string) => {
    if (!ready || busy || resetting || !text.trim()) return
    follow.current = true
    setNotice('')
    clearError()
    setInput('')
    void sendMessage({ text: text.trim() })
  }
  return <section className="chat-workspace" aria-label="Jay 的数字助手">
    <div className="chat-toolbar"><span className="chat-mode"><span />演示模式 · 基于公开资料</span><button type="button" disabled={!ready || resetting} onClick={() => {
      setResetting(true)
      void stop().then(() => { setMessages([]); clearError(); setArtifact(null); setNotice('新对话已开始'); setInput('') }).finally(() => setResetting(false))
    }}>新对话</button></div>
    {!messages.length && <div className="chat-welcome"><span className="chat-orbit" aria-hidden="true">✦</span><h2>从一个问题，认识 Jay。</h2><p>了解公开简历，查找博客中的知识，或者运行一个小 Demo。</p></div>}
    <div className={`chat-log${messages.length ? ' has-messages' : ''}`} ref={log} role="log" aria-label="对话记录" aria-live="off" onScroll={() => {
      const element = log.current
      if (element) follow.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80
    }}>
      {messages.map(message => <article key={message.id} className={`chat-message chat-message-${message.role}`} aria-label={message.role === 'user' ? '你的消息' : '助手回复'}>
        <span className="chat-speaker">{message.role === 'user' ? '你' : 'Jay 的助手'}</span>
        {message.parts.map((part, index) => part.type === 'text' ? <Suspense key={index} fallback={<p>{part.text}</p>}><StreamingMarkdown text={part.text} /></Suspense> : <ToolCard key={index} part={part} onArtifact={setArtifact} />)}
        {message.role === 'assistant' && !busy && <CopyReply text={message.parts.filter(part => part.type === 'text').map(part => part.text).join('\n')} />}
      </article>)}
      {busy && <p role="status" className="chat-muted">{status === 'submitted' ? '正在连接助手…' : '正在回复…'}</p>}
    </div>
    {!messages.length && <div className="chat-prompts">{prompts.map(prompt => <button type="button" disabled={!ready || busy} key={prompt} onClick={() => submit(prompt)}>{prompt} <span aria-hidden="true">↗</span></button>)}</div>}
    {error && <div className="chat-error" role="alert">连接失败或回复中断，请确认 API 服务已启动。<button type="button" disabled={busy} onClick={() => { clearError(); void regenerate() }}>重试回复</button></div>}
    <form className="chat-composer" onSubmit={event => { event.preventDefault(); submit(input) }}>
      <label className="sr-only" htmlFor="chat-input">向 Jay 的助手提问</label>
      <textarea id="chat-input" value={input} onChange={event => setInput(event.target.value)} placeholder="问问我的经历，或搜索一篇博客…" rows={2} maxLength={2000} disabled={!ready || resetting} onKeyDown={event => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); submit(input) }
      }} />
      <div className="chat-composer-footer"><small>{input.length}/2000 · Shift + Enter 换行</small>{busy ? <button type="button" onClick={() => { void stop(); setNotice('已停止回复，可继续提问。') }}>停止生成</button> : <button type="submit" disabled={!ready || resetting || !input.trim()}>发送 <span aria-hidden="true">↑</span></button>}</div>
    </form>
    <p className="chat-disclaimer">当前为模拟回复与关键词检索。履历以已公开资料为准，联系表单不会实际投递。</p>
    <span className="sr-only" role="status">{notice}</span>
    {artifact && <Suspense fallback={<p role="status">正在打开 Demo…</p>}><ArtifactPanel artifact={artifact} onClose={() => setArtifact(null)} /></Suspense>}
  </section>
}
export default ChatWorkspace
