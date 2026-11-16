// Browser-only boundary: keep model loading separate from page rendering.
export async function createImageClassifier() {
  const { default: ml5 } = await import('ml5')
  const classifier = ml5.imageClassifier('MobileNet')
  await classifier.ready
  return classifier
}
