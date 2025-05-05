const Projects = () => {
  return (
    <div className="prose m-auto">
      <h1 className="text-center">Projects</h1>
      <div className="flex flex-col gap-4">
        <a href="https://github.com/jayzoou/vite-react-static" target="_blank">
        <div className="w-60 rounded-lg p-4 my-4 bg-black:08 hover:bg-black:20 text-white">
          <div className="text-6">vite-react-static</div>
          <div className="text-4">retact 18+ SSG</div>
        </div>
        </a>
      </div>
    </div>
  )
}

export default Projects
