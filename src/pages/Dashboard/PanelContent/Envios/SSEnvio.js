import React, { useState } from "react";
import axiosInstance from '../../../../components/axiosConfig';
import './Envios.css';

const SSEnvio = () => {
    const [rows, setRows] = useState([{ codigo: '', cantidad: 1, descripcion: '', estatus: '' }]);
    const [tableData, setTableData] = useState({
        antiguos: [],
        vigente: [],
        nuevo: [],
    });

    const handleCodigoChange = async (index, codigoInput) => {
        const codigoUpperCase = codigoInput.trim().toUpperCase();
        const updatedRows = [...rows];
        updatedRows[index].codigo = codigoUpperCase;
        setRows(updatedRows);

        if (codigoUpperCase.length >= 5) {
            try {
                const response = await axiosInstance.get(`/api/product/search/${codigoUpperCase}`);
                updatedRows[index].descripcion = response.data.descripcion || 'Descripción no encontrada';
                updatedRows[index].estatus = response.data.estatus || 'Sin estatus';
                setRows(updatedRows);
            } catch (error) {
                console.error('Error al buscar el código:', error);
                alert('Error al buscar el código. Verifique la conexión o el código ingresado.');
            }
        }
    };

    const handleCantidadChange = (index, cantidad) => {
        const updatedRows = [...rows];
        updatedRows[index].cantidad = cantidad;
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, { codigo: '', cantidad: 1, descripcion: '', estatus: '' }]);
    };

    const removeRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleClasificar = () => {
        const updatedTableData = { ...tableData };

        rows.forEach((row) => {
            if (!row.codigo || !row.descripcion || !row.estatus) {
                alert(`Por favor, complete todos los campos para el código: ${row.codigo}`);
                return;
            }

            let tipo = '';
            if (row.estatus === 'ANTIGUO') {
                tipo = 'antiguos';
            } else if (row.estatus === 'VIGENTE') {
                tipo = 'vigente';
            } else if (row.estatus === 'NUEVO') {
                tipo = 'nuevo';
            } else {
                alert(`Estatus no válido para el código: ${row.codigo}`);
                return;
            }

            updatedTableData[tipo] = [...updatedTableData[tipo], { ...row }];
        });

        setTableData(updatedTableData);
        setRows([{ codigo: '', cantidad: 1, descripcion: '', estatus: '' }]); // Resetear filas
    };

    const getEstatusClass = (estatus) => {
        if (estatus === 'ANTIGUO') return 'estatus-grey';
        if (estatus === 'VIGENTE') return 'estatus-green';
        if (estatus === 'NUEVO') return 'estatus-blue';
        return '';
    };

    return (
        <div className="panel-overlay">
            <h2>Clasificación de Sobrestock</h2>

            {/* Ingreso de datos */}
            <div className="input-section">
                <table className="table">
                    <thead>
                        <tr>
                            <th> - </th>
                            <th>Código</th>
                            <th>Cantidad</th>
                            <th>Descripción</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <button className="remove-row-button" onClick={() => removeRow(index)}> - </button>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.codigo}
                                        onChange={(e) => handleCodigoChange(index, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.cantidad}
                                        min="1"
                                        max="999"
                                        onChange={(e) => handleCantidadChange(index, parseInt(e.target.value, 10))}
                                    />
                                </td>
                                <td>
                                    <div className="readonly-cell">{row.descripcion}</div>
                                </td>
                                <td>
                                    <div className={`readonly-cell ${getEstatusClass(row.estatus)}`}>{row.estatus}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="add-button" onClick={addRow}>Agregar Fila</button>
                <button className="submit-button" onClick={handleClasificar}>Clasificar</button>
            </div>

            {/* Tablas clasificadas */}
            <div className="tables-section">
                {tableData.antiguos.length > 0 && (
                    <div id="tabla-antiguos">
                        <h3>Antiguos</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Cantidad</th>
                                    <th>Descripción</th>
                                    <th>Estatus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.antiguos.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.codigo}</td>
                                        <td>{row.cantidad}</td>
                                        <td>{row.descripcion}</td>
                                        <td className={getEstatusClass(row.estatus)}>{row.estatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tableData.vigente.length > 0 && (
                    <div id="tabla-vigente">
                        <h3>Vigente</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Cantidad</th>
                                    <th>Descripción</th>
                                    <th>Estatus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.vigente.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.codigo}</td>
                                        <td>{row.cantidad}</td>
                                        <td>{row.descripcion}</td>
                                        <td className={getEstatusClass(row.estatus)}>{row.estatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tableData.nuevo.length > 0 && (
                    <div id="tabla-nuevo">
                        <h3>Nuevo</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Cantidad</th>
                                    <th>Descripción</th>
                                    <th>Estatus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.nuevo.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.codigo}</td>
                                        <td>{row.cantidad}</td>
                                        <td>{row.descripcion}</td>
                                        <td className={getEstatusClass(row.estatus)}>{row.estatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SSEnvio;