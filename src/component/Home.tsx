import ChatWorkspace from './chat/ChatWorkspace'

const Home = () => {
  return (
    <div className="ai-home">
      <div className="home-intro"><p className="home-eyebrow">PERSONAL NOTES & EXPERIMENTS</p><h1>Jay Zou<span> / 数字会客厅</span></h1><p>写下所学，也让知识可以被对话。</p></div>
      <ChatWorkspace />
    </div>
  )
}

export default Home
