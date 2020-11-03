import './assets/styles/tailwind.css'
import './assets/styles/icofont.css'
import { useState } from 'react'
import Navbar from './components/Navbar'
import GraphView from './components/GraphView'
import Footer from './components/Footer'

function App() {

  const [state, setState] = useState({
    username: '',
    select: false
  })

  function handleInputChange(value) {
    setState({ ...state, username: value})
  }

  function handleSelectChange(value) {
    setState({ ...state, select: value })
  }

  return (
    <div className='bg-gradient-to-b from-light1 to-primary' style={{ width: '100vw', height: '100vh' }}>
      <Navbar onInputChange={handleInputChange} onSelectChange={handleSelectChange} />
      <GraphView username={state.username} select={state.select}/>
      <Footer />
    </div>
  )
}

export default App
