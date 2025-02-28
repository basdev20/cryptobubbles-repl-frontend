import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Chart from './home_page/chart.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Chart />
  // </StrictMode>,
)
