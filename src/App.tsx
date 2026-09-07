import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ChiSiamo from './pages/ChiSiamo'
import TorneiGiochi from './pages/TorneiGiochi'
import Sponsor from './pages/Sponsor'
import Blog from './pages/Blog'
import Contatti from './pages/Contatti'
import AreaSoci from './pages/AreaSoci'
import ItaliaCampione2030 from './pages/ItaliaCampione2030'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/tornei-giochi" element={<TorneiGiochi />} />
        <Route path="/sponsor" element={<Sponsor />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="/area-soci" element={<AreaSoci />} />
        <Route path="/italia-campione-2030" element={<ItaliaCampione2030 />} />
      </Route>
    </Routes>
  )
}
