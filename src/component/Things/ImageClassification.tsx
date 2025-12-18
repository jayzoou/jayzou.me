
import { useEffect, useRef, useState } from 'react'
import defaultImg from './img/cat.jpg'

type Result = {
	label: string
	confidence: number
}


const ImageClassification = () => {
	const imgRef = useRef<HTMLImageElement | null>(null)
	const [preview, setPreview] = useState<string | null>(defaultImg)
	const [results, setResults] = useState<Result[] | null>(null)
	const [loadingModel, setLoadingModel] = useState(false)
	const [modelReady, setModelReady] = useState(false)
	const classifierRef = useRef<any>(null)

	useEffect(() => {
		let mounted = true
		;(async () => {
			setLoadingModel(true)
			try {
				const ml5Module = await import('ml5')
				const ml5 = (ml5Module as any).default || ml5Module
				// load MobileNet classifier
				const classifier = await ml5.imageClassifier('MobileNet')
				if (!mounted) return
				classifierRef.current = classifier
				setModelReady(true)
			} catch (err) {
				// ignore: user will see no classification
				console.error('ml5 load error', err)
			} finally {
				setLoadingModel(false)
			}
		})()
		return () => {
			mounted = false
		}
	}, [])

	useEffect(() => {
		// handled by separate effects and onLoad handler
		return
	}, [preview, modelReady])

	// reusable classify function
	const classifyImage = async (img: HTMLImageElement) => {
		if (!classifierRef.current) {
			console.warn('classifier not ready')
			return
		}
		setResults(null)
		try {
			console.log('classify: running on', img.src)
			const res = await classifierRef.current.classify(img)
			console.log('classify: result', res)
			const parsed: Result[] = (res || []).map((r: any) => ({
				label: r.label,
				confidence: r.confidence,
			}))
			setResults(parsed)
		} catch (err) {
			console.error('classify error', err)
			setResults(null)
		}
	}

	// when preview changes: if image already loaded + model ready, classify; otherwise rely on img onLoad
	useEffect(() => {
		if (!preview) return
		const img = imgRef.current
		if (!img) return
		if (modelReady && img.complete && img.naturalWidth > 0) {
			classifyImage(img)
		}
	}, [preview])

	// when model becomes ready, if preview image already loaded classify it
	useEffect(() => {
		if (!modelReady) return
		const img = imgRef.current
		if (!img) return
		if (preview && img.complete && img.naturalWidth > 0) {
			classifyImage(img)
		}
	}, [modelReady])

	const handleFiles = (file?: File) => {
		if (!file) return
		const url = URL.createObjectURL(file)
		setPreview((prev) => {
			if (prev && prev.startsWith && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
			return url
		})
		setResults(null)
	}

	const onDrop: React.DragEventHandler = (e) => {
		e.preventDefault()
		const file = e.dataTransfer.files && e.dataTransfer.files[0]
		if (file) handleFiles(file)
	}

	const onDragOver: React.DragEventHandler = (e) => {
		e.preventDefault()
	}

	const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const file = e.target.files && e.target.files[0]
		if (file) handleFiles(file)
	}

	return (
		<div>
			<div
				onDrop={onDrop}
				onDragOver={onDragOver}
				className="border-dashed border-2 border-slate-300 rounded p-4 text-center"
				style={{ cursor: 'pointer' }}
			>
				<p>拖拽图片到此处，或点击选择图片进行识别</p>
				<input
					type="file"
					accept="image/*"
					onChange={onFileChange}
					style={{ marginTop: 8 }}
				/>
				<div style={{ marginTop: 12 }}>
					{loadingModel ? <small>模型加载中…</small> : <small>模型已就绪</small>}
				</div>
			</div>

			{preview && (
				<div className="mt-4">
					<img
						ref={imgRef}
						src={preview}
						alt="preview"
						style={{ width: '50%', maxWidth: '100%', display: 'block', margin: '0 auto' }}
						onLoad={() => imgRef.current && classifyImage(imgRef.current)}
					/>
					<div className="mt-2">
						{results === null ? (
							<div>识别中…</div>
						) : results.length === 0 ? (
							<div>未检测到结果</div>
						) : (
							<ul>
								{results.map((r, i) => (
									<li key={i}>
										{r.label} — {(r.confidence * 100).toFixed(2)}%
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default ImageClassification
