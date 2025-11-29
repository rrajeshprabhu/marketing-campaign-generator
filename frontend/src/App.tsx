import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GeneratePage from './pages/GeneratePage'
import GenerateFromUrlPage from './pages/GenerateFromUrlPage'
import CampaignsPage from './pages/CampaignsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="generate" element={<GeneratePage />} />
          <Route path="generate-from-url" element={<GenerateFromUrlPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
