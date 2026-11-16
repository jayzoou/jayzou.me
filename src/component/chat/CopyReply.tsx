import { useEffect, useRef, useState } from 'react'

const CopyReply = ({ text }: { text: string }) => {
  const [label, setLabel] = useState('复制回复')
  const mounted = useRef(true)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; clearTimeout(timer.current) } }, [])
  return <button className="copy-reply" type="button" onClick={() => {
    void navigator.clipboard.writeText(text).then(() => {
      if (!mounted.current) return
      setLabel('已复制回复')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setLabel('复制回复'), 2000)
    }).catch(() => { if (mounted.current) setLabel('复制失败，请选择文本') })
  }}>{label}</button>
}
export default CopyReply
