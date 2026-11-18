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
  const textarea = useRef<HTMLTextAreaElement>(null)
  const [showLatest, setShowLatest] = useState(false)
  const follow = useRef(true)
  const focusAfterReset = useRef(false)
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

  useEffect(() => {
    const element = textarea.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`
  }, [input])

  useEffect(() => {
    if (!resetting && focusAfterReset.current) {
      focusAfterReset.current = false
      textarea.current?.focus()
    }
  }, [resetting, messages])

  const scrollToLatest = () => {
    follow.current = true
    setShowLatest(false)
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }

  const submit = (text: string) => {
    if (!ready || busy || resetting || !text.trim()) return
    follow.current = true
    setShowLatest(false)
    textarea.current?.focus()
    setNotice('')
    clearError()
    setInput('')
    void sendMessage({ text: text.trim() })
  }
  return <section className={`chat-workspace${messages.length ? ' is-conversation' : ''}`} aria-label="Jay 的数字助手">
    <div className="chat-toolbar">
      <button className="chat-new" type="button" disabled={!ready || resetting} onClick={() => {
        focusAfterReset.current = true
        setResetting(true)
        void stop().then(() => { setMessages([]); clearError(); setArtifact(null); setNotice('新对话已开始'); setInput(''); scrollToLatest() }).finally(() => setResetting(false))
      }}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7M16 3l5 5M10 14l1-5 7-7 5 5-7 7z" /></svg>新对话</button>
    </div>
    <div className="chat-body">
      {!messages.length && <div className="chat-welcome"><p className="chat-eyebrow">JAY’S DIGITAL SPACE</p></div>}
      <div className={`chat-log${messages.length ? ' has-messages' : ''}`} ref={log} role="log" aria-label="对话记录" aria-live="off" onScroll={() => {
        const element = log.current
        if (element) {
          follow.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80
          setShowLatest(!follow.current)
        }
      }}>
        {messages.map(message => <article key={message.id} className={`chat-message chat-message-${message.role}`} aria-label={message.role === 'user' ? '你的消息' : '助手回复'}>
          <span className="sr-only">{message.role === 'user' ? '你' : 'Jay 的助手'}</span>
          {message.parts.map((part, index) => part.type === 'text' ? message.role === 'user' ? <p className="chat-user-text" key={index}>{part.text}</p> : <Suspense key={index} fallback={<p>{part.text}</p>}><StreamingMarkdown text={part.text} /></Suspense> : <ToolCard key={index} part={part} onArtifact={setArtifact} />)}
          {message.role === 'assistant' && !busy && <CopyReply text={message.parts.filter(part => part.type === 'text').map(part => part.text).join('\n')} />}
        </article>)}
        {busy && <p role="status" className="chat-muted"><span className="chat-thinking" aria-hidden="true" />{status === 'submitted' ? '正在连接助手…' : '正在回复…'}</p>}
      </div>
      {showLatest && <button className="chat-latest" type="button" aria-label="回到最新消息" onClick={scrollToLatest}>↓</button>}
    </div>
    <div className="chat-input-area">
      {error && <div className="chat-error" role="alert">连接失败或回复中断，请稍后重试。<button type="button" disabled={busy} onClick={() => { clearError(); void regenerate() }}>重试回复</button></div>}
      <form className="chat-composer" onSubmit={event => { event.preventDefault(); submit(input) }}>
        <label className="sr-only" htmlFor="chat-input">向 Jay 的助手提问</label>
        <textarea ref={textarea} id="chat-input" value={input} onChange={event => setInput(event.target.value)} placeholder="有什么想了解的？" rows={1} maxLength={2000} disabled={!ready || resetting} aria-describedby="chat-input-hint" onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); submit(input) }
        }} />
        <div className="chat-composer-footer"><small id="chat-input-hint">{input.length > 0 ? `${input.length}/2000 · ` : ''}Enter 发送 · Shift + Enter 换行</small>{busy ? <button className="chat-send" type="button" aria-label="停止生成" title="停止生成" onClick={() => { void stop(); setNotice('已停止回复，可继续提问。') }}><span className="chat-stop-icon" aria-hidden="true" /></button> : <button className="chat-send" type="submit" aria-label="发送" title="发送" disabled={!ready || resetting || !input.trim()}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20V4m-7 7 7-7 7 7" /></svg></button>}</div>
      </form>
      {!messages.length && <div className="chat-prompts">{prompts.map((prompt, index) => <button type="button" disabled={!ready || busy} key={prompt} onClick={() => submit(prompt)}><span aria-hidden="true">{['◈', '⌕', '⌘', '↗'][index]}</span>{prompt}</button>)}</div>}
    </div>
    <span className="sr-only" role="status">{notice}</span>
    {artifact && <Suspense fallback={<p role="status">正在打开 Demo…</p>}><ArtifactPanel artifact={artifact} onClose={() => setArtifact(null)} /></Suspense>}
  </section>
}
export default ChatWorkspace
