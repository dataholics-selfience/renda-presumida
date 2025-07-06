import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ResultsPage from './components/ResultsPage';
import { RendaResultType } from './types';

function App() {
  const [currentResult, setCurrentResult] = useState<RendaResultType | null>(null);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Layout onResultReady={setCurrentResult} />} 
        />
        <Route 
          path="/results" 
          element={<ResultsPage result={currentResult} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;