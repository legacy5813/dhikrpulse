import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import DhikrCounter from './pages/DhikrCounter'
import About from './pages/About'

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <Routes>
          <Route path="/" element={<DhikrCounter />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  )
}

export default App