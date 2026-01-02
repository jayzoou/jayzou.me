const NavBar = () => {
  return (
    <header className="flex justify-between items-center text-white">
      <a href="/" className="ml-10 !text-white cursor-pointer transition scale-150 hover:scale-200">🤔</a>
      <nav className='nav'>
        <div className='spacer'></div>
        <div className='flex gap-4 mr-4'>
          <a href="/posts">Blog</a>
          <a href="/projects">Projects</a>
          <a href="https://ai.jayzou.me/" target='_blank' rel='noopener noreferrer'>AI Assistant</a>
          <a href="https://github.com/jayzoou" target='_blank'>GitHub</a> 
        </div>
      </nav>
    </header>
  )
}

export default NavBar
