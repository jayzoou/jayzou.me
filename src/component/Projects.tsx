const Projects = () => {
  return (
    <div className="m-auto">
      <h1 className="text-center">Projects</h1>
      <div className="flex flex-row flex-wrap gap-4 pl-10 pr-10 justify-center">
        <div className="w-full sm:w-1/3 md:w-1/4 pl-4 pr-4 rounded-lg my-4 bg-black:08 hover:bg-black:20 text-white">
          <a className="block pt-4 pb-4" href="https://github.com/jayzoou/vite-react-static" target="_blank" rel="noopener noreferrer">
            <div className="text-6">vite-react-static</div>
            <div className="text-3 mt-3">react 18+ SSG</div>
          </a>
        </div>
        <div className="w-full sm:w-1/3 md:w-1/4 pl-4 pr-4 rounded-lg my-4 bg-black:08 hover:bg-black:20 text-white">
          <a className="block pt-4 pb-4" href="https://www.npmjs.com/package/mcp-optimizer" target="_blank" rel="noopener noreferrer">
            <div className="text-6">MCP Optimizer</div>
            <div className="text-3 mt-3">A minimal scaffold that runs Lighthouse to produce performance reports.</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Projects
