const Projects = () => {
  return (
    <div className="m-auto">
      <h1 className="text-center">Projects</h1>
      <div className="flex flex-col gap-4 pl-10 pr-10">
        <div className="w-50 pl-4 pr-4 rounded-lg my-4 bg-black:08 hover:bg-black:20 text-white">
          <a className="block pt-4 pb-4" href="https://github.com/jayzoou/vite-react-static" target="_blank">
            <div className="text-6">vite-react-static</div>
            <div className="text-4">react 18+ SSG</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Projects
