import React from 'react';
import Navbar from "../Navbar/Navbar";
import "./zonal.css";

const Zonal = () => {
  const sector = localStorage.getItem("sector");

  const renderPieChart = (segments) => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    let cumulativeAngle = 0;
  
    return (
      <svg viewBox="0 20 200 200" className="pie-chart">
        {segments.map((segment, i) => {
          const angle = (segment.value / 100) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;
          cumulativeAngle = endAngle;
  
          // Path coordinates
          const startRadians = (Math.PI * startAngle) / 180;
          const endRadians = (Math.PI * endAngle) / 180;
  
          const x1 = centerX + radius * Math.cos(startRadians);
          const y1 = centerY + radius * Math.sin(startRadians);
          const x2 = centerX + radius * Math.cos(endRadians);
          const y2 = centerY + radius * Math.sin(endRadians);
  
          const largeArc = angle > 180 ? 1 : 0;
  
          // Arc path
          const d = `
            M ${centerX},${centerY}
            L ${x1},${y1}
            A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}
            Z
          `;
  
          // Etiqueta: centro del arco
          const labelAngle = (startAngle + endAngle) / 2;
          const labelRadians = (Math.PI * labelAngle) / 180;
          const labelRadius = radius * 0.6;
          const labelX = centerX + labelRadius * Math.cos(labelRadians);
          const labelY = centerY + labelRadius * Math.sin(labelRadians);
  
          return (
            <g key={i}>
              <path d={d} fill={segment.color} />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000"
                fontSize="10"
                fontWeight="bold"
              >
                {`${segment.label} ${segment.value}%`}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };  

  return (
    <div className="zonal-container">
      <Navbar sector={sector}/>  
      <div className="zonal-header">
        <button className="main-button-z"> Verificaciones </button>
        <button className="main-button-z"> Inventarios </button>
        <button className="main-button-z"> Depósitos </button>
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
              <div className="finance-table">
                <thead>
                  <tr>
                    <th>Ultimos 7 días</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>$ 2.230.500</td>
                  </tr>
                </tbody>
              </div>
            </div>

            <div className='box-inventory'>
              <h3> Inventarios </h3>
              <div className="inventory-chart">
                {renderPieChart([
                  { value: 15, color: 'steelblue', label: 'No Realizado' },
                  { value: 25, color: 'firebrick', label: 'En Proceso' },
                  { value: 60, color: 'green', label: 'Realizado' },
                ])}
              </div>
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
