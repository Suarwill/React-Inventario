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
        <button className="main-button-z"> Depósitos </button>
        <button className="main-button-z"> Inventarios </button>
        <button className="main-button-z"> Tareas Pendientes </button>
      </div>

      <div className="zonal-content">
        <div className='display-izq'>
          <h3> Cumplimiento de Verificaciones </h3>

          <table>
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Egaña 1</td>
                <td>100 %</td>
              </tr>
              <tr>
                <td>Egaña 2</td>
                <td>100 %</td>
              </tr>
              <tr>
                <td>Egaña 3</td>
                <td>Con diferencias</td>
              </tr>
              <tr>
                <td>Egaña 4</td>
                <td>Aún no realiza</td>
              </tr>
            </tbody>
          </table>

        </div>

        <div className='display-central'>

          <div className='box-central-superior'>
            <div className='box-finance'>
              <h3> Depósitos </h3>
              <div className="finance-table">

                <table>
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
                </table>

                <table>
                  <thead>
                    <tr>
                      <th>Ayer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>$ 308.000</td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>

            <div className='box-inventory'>
              <h3> Inventarios </h3>
              <div className="inventory-chart">
                {renderPieChart([
                  { value: 15, color: 'red', label: 'No Realizado' },
                  { value: 25, color: 'yellow', label: 'En Proceso' },
                  { value: 60, color: 'limegreen', label: 'Realizado' },
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
          <div className="map-chart"> 
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Comunas_de_Santiago_%282005%29.svg/500px-Comunas_de_Santiago_%282005%29.svg.png" alt="Mapa de módulos" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zonal;
