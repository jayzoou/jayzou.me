import { useEffect, useRef, useState } from 'react'
import type { ClassificationResult, ImageClassifier } from 'ml5'
import defaultImg from './img/cat.jpg'

const ImageClassification = () => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [preview, setPreview] = useState(defaultImg)
  const [filename, setFilename] = useState('')
  const [requested, setRequested] = useState(false)
  const [results, setResults] = useState<ClassificationResult[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'classifying' | 'ready' | 'error'>('idle')
  const classifier = useRef<Promise<ImageClassifier> | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview) }, [preview])

  useEffect(() => {
    if (!requested) return
    let cancelled = false
    const image = imgRef.current
    if (!image) return
    void (async () => {
      setStatus('loading')
      setResults(null)
      classifier.current ??= import('../../lib/imageClassifier').then(module => module.createImageClassifier())
      const model = await classifier.current
      await image.decode()
      if (cancelled) return
      setStatus('classifying')
      const next = await model.classify(image)
      if (!cancelled) { setResults(next); setStatus('ready') }
    })().catch(() => {
      if (!cancelled) { classifier.current = null; setStatus('error') }
    })
    return () => { cancelled = true }
  }, [requested, preview, retry])

  const selectFile = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setStatus('error'); return }
    setFilename(file.name)
    setPreview(URL.createObjectURL(file))
    setRequested(true)
  }

  const busy = status === 'loading' || status === 'classifying'
  return <div>
    <div className="image-picker" onDragOver={event => event.preventDefault()} onDrop={event => {
      event.preventDefault()
      selectFile(event.dataTransfer.files[0])
    }}>
      <p>Drag the picture here, or click to select the picture for recognition.</p>
      <div className="image-controls">
        <button type="button" disabled={busy} onClick={() => { setRequested(true); setRetry(value => value + 1) }}>
          {status === 'error' ? '重试识别' : '开始识别'}
        </button>
        <label htmlFor="image-input">Select the picture</label>
        <input className="sr-only" id="image-input" type="file" accept="image/*" onChange={event => selectFile(event.target.files?.[0])} />
        <span>{filename || 'No picture selected'}</span>
      </div>
      <p role="status" className="image-message">{status === 'idle' ? '点击开始识别，或选择一张图片。'
        : status === 'loading' ? 'Loading model…' : status === 'classifying' ? 'Recognizing…'
        : status === 'error' ? '识别失败，请检查图片与网络后重试。' : 'Model ready'}</p>
    </div>
    <img ref={imgRef} src={preview} alt="preview" className="image-preview" />
    {results && <ul>{results.map((result, index) => <li key={index}>{result.label} — {(result.confidence * 100).toFixed(2)}%</li>)}</ul>}
  </div>
}

export default ImageClassification
