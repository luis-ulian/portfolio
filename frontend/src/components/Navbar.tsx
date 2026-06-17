import { useState } from  'react'
import '../styles/Navbar.css'
const Navbar = () => {
    const [active, setActive] = useState<number>(0)
    const [selectBar, setSelectBar] = useState<boolean>(false)
    const scrollToSection = (id: string) => {
        const section = document.getElementById(id)
        if(section){
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
        }
    }
  return (
    <>
        <header className='container'>
            <div className="logo">
                <p>LU</p>
            </div>
            <button className='hamburguer'
                onClick={() => {
                    setSelectBar(true)
                }}></button>
            <ul className={ selectBar ? 'active' : 'links'}>
                <li><a className={ active === 0 ? "active" : "" }
                    onClick={() => {setActive(0); setSelectBar(false);
                    scrollToSection("hero");}}
                    >Início</a></li>
                <li><a className={ active === 1 ? "active" : "" }
                    onClick={() => {setActive(1); setSelectBar(false);
                    scrollToSection("about");}}
                    >Sobre</a></li>
                <li><a className={ active === 2 ? "active" : "" }
                    onClick={() => {setActive(2); setSelectBar(false);
                    scrollToSection("projects");}}
                    >Projetos</a></li>
                <li><a className={ active === 3 ? "active" : "" }
                    onClick={() => {setActive(3); setSelectBar(false);
                    scrollToSection("skills");}}
                    >Skills</a></li>
                <li><a className={ active === 4 ? "active" : "" }
                    onClick={() => {setActive(4); setSelectBar(false);
                    scrollToSection("timeline");}}
                    >Timeline</a></li>
            </ul>        
            <div className='download-button'>
                <button className='button'>Download CV</button>
            </div>    
        </header>
    </>
  )
}

export default Navbar