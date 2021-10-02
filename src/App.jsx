import GraphView from './components/GraphView'
import TopBar from './components/TopBar'

const App = () => {

  return (
    <div className='flex fixed w-full h-full flex-col bg-secondary font-muli'>
      <TopBar/>
      <GraphView/>
    </div>
  )

}

export default App
