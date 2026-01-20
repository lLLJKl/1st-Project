/* src/components/Sidebar/Sidebar.js*/

import React from 'react';
import './sidebar.module.css';

const Sidebar =({name, email}) =>{
    return(
    <div className="sidebar-container">
        <div className="text-center mb-4">
            <div className="profile-img-placeholder mx-auto mb-3">
                    <i className="bi bi-person-fill text-secondary" style={{fontSize: '3rem'}}></i>
            </div>

            <h5 className="fw-bold mb-0">{name}</h5>
            <p className="text-muted small">{email}</p>
        </div>
            
        <nav className="nav flex-column border-top">
            <a href="#" className="nav-link py-3 px-4 border-bottom active">내프로필</a>
            <a href="#" className="nav-link py-3 px-4 border-bottom">보안설정</a>
            <a href="#" className="nav-link py-3 px-4 border-bottom">이력관리</a>
           </nav>
    </div>
    );
};


export default Sidebar






