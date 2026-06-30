import './App.css'
import { useState, useCallback } from 'react'
import BootScreen from './components/os/BootScreen'
import Desktop from './components/os/Desktop'
import MobileView from './components/mobile/MobileView'
import useIsMobile from './hooks/useIsMobile'

function App() {
  const [booted, setBooted] = useState(false)
  const isMobile = useIsMobile()

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  // Mobile: skip boot screen, render scrollable mobile view directly
  if (isMobile) return <MobileView />

  // Desktop: boot screen → desktop OS environment
  return (
    <>
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      {booted && <Desktop />}
    </>
  )
}

export default App
