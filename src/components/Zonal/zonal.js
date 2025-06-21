import React from 'react';
import Navbar from "../Navbar/Navbar";
import "./zonal.css";

const Zonal = () => {
    const sector = localStorage.getItem("sector");
    
    return  (
        <div className="zonal-container">
            <Navbar sector={sector}/>  
            <div className="zonal-header">
                <button className="main-button-z"> Verificaciones </button>
                <button className="main-button-z"> Inventarios </button>
                <button className="main-button-z"> Depositos </button>
                <button className="main-button-z"> Tareas Pendientes </button>
            </div>
            <div className="zonal-content">
                <div className='display-izq'>
                    <h3> Cumplimiento de Verificaciones </h3>

                </div>
                <div className='display-central'>
                    <div className='box-central-superior'>
                        <div className='box-finance'>
                            <h3> Depósitos </h3>

                        </div>
                        <div className='box-inventory'>
                            <h3> Inventarios </h3>
                            
                        </div>
                    </div>
                    <div className='box-tareas'>
                        <h3> Tareas Pendientes </h3>
                    </div>
                </div>
                <div className='display-der'>
                    <h3> Mapa de módulos </h3>

                </div>

            </div>
        </div>
    );
};

export default Zonal;