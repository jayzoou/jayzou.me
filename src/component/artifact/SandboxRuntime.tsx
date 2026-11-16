import { Sandpack } from '@codesandbox/sandpack-react'

const SandboxRuntime = ({ files }: { files: Record<string, string> }) => <Sandpack
  template="react-ts" theme="dark" files={files}
  customSetup={{ dependencies: { react: '19.1.2', 'react-dom': '19.1.2' } }}
  options={{ showConsole: true, showNavigator: false, editorHeight: 500 }}
/>
export default SandboxRuntime
