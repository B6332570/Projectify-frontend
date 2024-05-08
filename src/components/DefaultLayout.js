import React from 'react'
import "./DefaultLayout.css"
import Navbar from './Navbar'
import Sidebar  from './Sidebar'
import './Navbar.css'; 
import './Sidebar.css';

function DefaultLayout({ children }) {

    return (
        <div className="main theme">
            <div className='bg-[#1b1919f3] drop-shadow-2xl'>
                <Navbar />
                <Sidebar/>
                
            </div>
            <div className="content p-5 ">
             {children}
                
            </div>
        </div>

    )
}

export default DefaultLayout