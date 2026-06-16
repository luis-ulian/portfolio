import { useState, useEffect } from  'react'
import '../styles/Navbar.css'
const Navbar = () => {
    const [active, setActive] = useState<number>(0)
    const [selectBar, setSelectBar] = useState<boolean>(false)
  return (
    <>
        <div className='container'>
            <div className="logo">
                <p>LU</p>
            </div>
            <button className='hamburguer'
                onClick={() => {
                    setSelectBar(true)
                }}></button>
            <ul className={ selectBar ? 'active' : 'links'}>
                <li><a className={ active === 0 ? "active" : "" }
                    onClick={() => {setActive(0); setSelectBar(false);}}
                    >Início</a></li>
                <li><a className={ active === 1 ? "active" : "" }
                    onClick={() => {setActive(1); setSelectBar(false);}}
                    >Sobre</a></li>
                <li><a className={ active === 2 ? "active" : "" }
                    onClick={() => {setActive(2); setSelectBar(false);}}
                    >Projetos</a></li>
                <li><a className={ active === 3 ? "active" : "" }
                    onClick={() => {setActive(3); setSelectBar(false);}}
                    >Skills</a></li>
                <li><a className={ active === 4 ? "active" : "" }
                    onClick={() => {setActive(4); setSelectBar(false);}}
                    >Timeline</a></li>
            </ul>        
            <div className='download-button'>
                <button className='button'>Download CV</button>
            </div>    
        </div>
    </>
  )
}

export default Navbar