
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClassificationResult, ImageClassifier } from 'ml5'
import defaultImg from './img/cat.jpg'

const ImageClassification = () => {
	const imgRef = useRef<HTMLImageElement | null>(null)
	const [preview, setPreview] = useState<string | null>(defaultImg)
	const [results, setResults] = useState<ClassificationResult[] | null>(null)
	const [loadingModel, setLoadingModel] = useState(false)
	const [modelReady, setModelReady] = useState(false)
	const classifierRef = useRef<ImageClassifier | null>(null)

	useEffect(() => {
		let mounted = true
		;(async () => {
			setLoadingModel(true)
			try {
				const { default: ml5 } = await import('ml5')
				// load MobileNet classifier
				const classifier = ml5.imageClassifier('MobileNet')
				await classifier.ready
				if (!mounted) return
				classifierRef.current = classifier
				setModelReady(true)
			} catch (err) {
				// ignore: user will see no classification
				console.error('ml5 load error', err)
			} finally {
				if (mounted) setLoadingModel(false)
			}
		})()
		return () => {
			mounted = false
		}
	}, [])

	// reusable classify function
	const classifyImage = useCallback(async (img: HTMLImageElement) => {
		if (!classifierRef.current) {
			console.warn('classifier not ready')
			return
		}
		setResults(null)
		try {
			console.log('classify: running on', img.src)
			const res = await classifierRef.current.classify(img)
			console.log('classify: result', res)
			setResults(res)
		} catch (err) {
			console.error('classify error', err)
			setResults(null)
		}
	}, [])

	// Run once when the preview or model readiness changes; onLoad covers new images.
	useEffect(() => {
		const img = imgRef.current
		if (preview && modelReady && img?.complete && img.naturalWidth > 0) {
			void classifyImage(img)
		}
	}, [preview, modelReady, classifyImage])

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
				<p>Drag the picture here, or click to select the picture for recognition.</p>
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
