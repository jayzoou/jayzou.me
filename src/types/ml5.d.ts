// Minimal contract for the ml5 1.3 API used by this project.
// imageClassifier returns an instance; await its ready promise before classifying.
declare module 'ml5' {
  export interface ClassificationResult {
    label: string
    confidence: number
  }

  export interface ImageClassifier {
    ready: Promise<unknown>
    classify(image: HTMLImageElement): Promise<ClassificationResult[]>
  }

  const ml5: {
    imageClassifier(model: 'MobileNet'): ImageClassifier
  }
  export default ml5
}
