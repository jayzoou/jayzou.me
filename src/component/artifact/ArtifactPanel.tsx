import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Artifact } from '../../lib/ai/contracts'

const SandboxRuntime = lazy(() => import('./SandboxRuntime'))
class SandboxBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <p role="alert">沙盒加载失败，可以关闭后重试。代码仍可查看。</p> : this.props.children }
}

const ArtifactPanel = ({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const [run, setRun] = useState(false)
  const [code, setCode] = useState(artifact.files['/App.tsx'])
  useEffect(() => {
    const previous = document.activeElement
    dialog.current?.showModal()
    return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus() }
  }, [])
  return <dialog className="artifact-dialog" ref={dialog} aria-label={artifact.title} onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="artifact-heading"><div><strong>{artifact.title}</strong><p>预设示例 · 在独立沙盒中运行</p></div><button type="button" onClick={onClose} aria-label="关闭 Demo">关闭 ×</button></div>
    {!run && <><label htmlFor="artifact-code">React 源码</label><textarea className="artifact-code" id="artifact-code" spellCheck={false} value={code} onChange={event => setCode(event.target.value)} /><button type="button" onClick={() => setRun(true)}>运行预览</button></>}
    {run && <SandboxBoundary><Suspense fallback={<p role="status">正在加载编辑器与运行环境…</p>}><SandboxRuntime files={{ ...artifact.files, '/App.tsx': code }} /></Suspense></SandboxBoundary>}
  </dialog>
}
export default ArtifactPanel
