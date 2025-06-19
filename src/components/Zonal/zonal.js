import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./zonal.css";
import Navbar from "../Navbar/Navbar";

const Zonal = () => {
    const navigate = useNavigate();
    const sector = localStorage.getItem("sector");
    
    return  (
        <div className="zonal-container">
            <Navbar sector={sector}/>  
            <div className="zonal-header">
                <h1>Panel de {sector}</h1>
                <button className="logout-button" onClick={() => {
                    localStorage.removeItem("username");
                    navigate("/");
                }}>Cerrar Sesión</button>
            </div>
            <div className="zonal-content">
                <h2>Bienvenido al Panel Zonal</h2>
            </div>
        </div>
    );
};

export default Zonal;