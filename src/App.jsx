import './App.css'
import GifClockWidget from './components/widgets/GifClockWidget'

function App() {
  return (
    <div className="desktop-container">
      {/* Right-side widget: GIF placeholder + date/time */}
      <GifClockWidget />
    </div>
  )
}

export default App
