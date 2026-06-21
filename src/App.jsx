import './App.css'
import { useState, useCallback } from 'react'
import BootScreen from './components/os/BootScreen'
import Desktop from './components/os/Desktop'

function App() {
  const [booted, setBooted] = useState(false)

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <>
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      {booted && <Desktop />}
    </>
  )
}

export default App
