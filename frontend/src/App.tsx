import './App.css'
import Navbar from './components/Navbar.tsx'
import Homepage from './pages/Homepage.tsx'
function App() {

  return (
    <>
      <Navbar/>
      <Homepage/>
      <div className='border-screen'/>   
    </>
  )
}

export default App
