import GraphView from './components/GraphView'
import { GraphProvider } from './contexts/GraphContext'

const App = () => {

  return (
    <GraphProvider>
        <GraphView />
    </GraphProvider>
  )
}

export default App
