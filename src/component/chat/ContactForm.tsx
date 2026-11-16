import { useEffect, useRef, useState } from 'react'
import { apiUrl } from '../../lib/ai/client'
import { contactSchema } from '../../lib/ai/contracts'

const ContactForm = () => {
  const request = useRef<AbortController | null>(null)
  const identity = useRef({ payload: '', key: '' })
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => () => request.current?.abort(), [])
  return <form className="ai-card contact-form" onSubmit={event => {
    event.preventDefault()
    if (busy || submitted) return
    const form = new FormData(event.currentTarget)
    const parsed = contactSchema.safeParse(Object.fromEntries(form))
    if (!parsed.success) { setStatus('请填写姓名、有效邮箱和至少 5 个字的留言。'); return }
    const payload = JSON.stringify(parsed.data)
    if (identity.current.payload !== payload) identity.current = { payload, key: crypto.randomUUID() }
    const controller = new AbortController()
    request.current = controller
    setBusy(true)
    setStatus('正在模拟提交…')
    void fetch(apiUrl('/api/contact'), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': identity.current.key }, body: payload, signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error('提交失败'); await response.json(); if (!controller.signal.aborted) { setSubmitted(true); setStatus('模拟提交成功，未发送邮件或机器人通知。') } })
      .catch(() => { if (!controller.signal.aborted) setStatus('提交失败，请稍后重试。') })
      .finally(() => { if (!controller.signal.aborted) setBusy(false) })
  }}>
    <strong>联系 Jay</strong>
    <p>演示表单，内容不会投递。</p>
    <label>姓名<input name="name" required maxLength={80} autoComplete="name" /></label>
    <label>邮箱<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
    <label>留言<textarea name="message" required minLength={5} maxLength={2000} rows={3} /></label>
    <button type="submit" disabled={busy || submitted}>{submitted ? '模拟已提交' : busy ? '提交中…' : '模拟提交'}</button>
    <p role="status">{status}</p>
  </form>
}
export default ContactForm
