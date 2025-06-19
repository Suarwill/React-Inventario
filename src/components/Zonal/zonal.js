import React from 'react';
import Navbar from "../Navbar/Navbar";
import "./zonal.css";

const Zonal = () => {
    const sector = localStorage.getItem("sector");
    
    return  (
        <div className="zonal-container">
            <Navbar sector={sector}/>  
            <div className="zonal-header">
                <h1>Panel de </h1>
            </div>
            <div className="zonal-content">
                <h2>Bienvenido al Panel Zonal</h2>
            </div>
        </div>
    );
};

export default Zonal;