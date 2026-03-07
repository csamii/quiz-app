import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Settings from './components/Settings';
import Quiz from './components/Quiz';
import Correction from './components/Correction';
import Results from './components/Results';

function App() {

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/correction" element={<Correction/>} />
          <Route path="/results" element={<Results/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
