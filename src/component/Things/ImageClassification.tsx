
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
		if (file) {
			handleFiles(file)
			setSelectedFileName(file.name)
		}
	}

	const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

	return (
		<div>
			<div
				onDrop={onDrop}
				onDragOver={onDragOver}
				className="border-dashed border-2 border-slate-300 rounded p-4 text-center"
				style={{ cursor: 'pointer' }}
			>
				<p>Drag the image here, or click to select the image for recognition.</p>
						<div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
							<label htmlFor="image-input" className="inline-block px-4 py-2 rounded bg-gray-700 text-white cursor-pointer">Select the picture</label>
							<input id="image-input" type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
							<span className="text-sm text-gray-400">{selectedFileName ? selectedFileName : 'No picture selected'}</span>
						</div>
				<div style={{ marginTop: 12 }}>
					{loadingModel ? <small>Loading model…</small> : <small>Model ready</small>}
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
							<div>Recognizing…</div>
						) : results.length === 0 ? (
							<div>No results detected</div>
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
