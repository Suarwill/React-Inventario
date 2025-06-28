import React, { useState, useRef } from "react";
import axiosInstance from '../../../../components/axiosConfig';
import './Envios.css';

const MermasEnvio = () => {
    const [visibleTables, setVisibleTables] = useState([]);
    const [tableData, setTableData] = useState({
        mermas:     [{ codigo: '', cant: 1, descripcion: '' }],
        nc:         [{ codigo: '', cant: 1, descripcion: '' }],
        eliminados: [{ codigo: '', cant: 1, descripcion: '' }],
    });
    const inputRefs = useRef({});

    const handleShowTable = (tableName) => {
        if (!visibleTables.includes(tableName)) {
            setVisibleTables([...visibleTables, tableName]);
        }
    };

    const handleHideTable = (tableName) => {
        setVisibleTables((prevTables) => prevTables.filter((table) => table !== tableName));
    };

    const handleCodigoChange = (tableName, index, codigo) => {
        const codigoUpperCase = codigo.trim().toUpperCase();

        setTableData((prevData) => {
            const newData = { ...prevData };
            newData[tableName][index] = { ...newData[tableName][index], codigo: codigoUpperCase };
            return newData;
        });

        if (codigoUpperCase.length >= 5) {
            axiosInstance.get(`/api/product/search/${codigoUpperCase}`)
                .then((response) => {
                    const descripcion = response.data.descripcion || 'Descripción no encontrada';
                    setTableData((prevData) => {
                        const newData = { ...prevData };
                        newData[tableName][index] = { ...newData[tableName][index], descripcion };
                        return newData;
                    });
                })
                .catch((error) => {
                    console.error('Error al buscar el código:', error);
                    alert('Error al buscar el código. Verifique la conexión o el código ingresado.');
                });
        }
    };

    const handleCantidadChange = (tableName, index, cantidad) => {
        setTableData((prevData) => {
            const newData = { ...prevData };
            newData[tableName][index] = { ...newData[tableName][index], cant: cantidad };
            return newData;
        });
    };

    const addRow = (tableName) => {
        setTableData((prevData) => {
            const newData = { ...prevData };
            newData[tableName] = [...newData[tableName], { codigo: '', cant: 1, descripcion: '' }];
            return newData;
        });
    };

    const removeRow = (tableName, index) => {
        setTableData((prevData) => {
            const newData = { ...prevData };
            newData[tableName] = newData[tableName].filter((_, i) => i !== index);
            return newData;
        });
    };

    const handleSubmit = async () => {
        // Combinar las tres tablas en una sola
        const combinedData = [
            ...tableData.mermas.map((row) => ({ codigo: row.codigo, cantidad: row.cant, tipo: 'MERMA' })),
            ...tableData.nc.map((row) => ({ codigo: row.codigo, cantidad: row.cant, tipo: 'NC' })),
            ...tableData.eliminados.map((row) => ({ codigo: row.codigo, cantidad: row.cant, tipo: 'ELIMINADO' })),
        ];

        try {
            const response = await axiosInstance.post('/api/movimiento/envio/cargar', combinedData);
            alert('Datos enviados correctamente');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error al enviar los datos. Verifique la conexión o los datos ingresados.');
        }
    };

    return (
        <div className="panel-overlay">
            <h2>Planillas de Mermas</h2>

            <div>
                <button className="add-button" onClick={() => handleShowTable('mermas')}>Agregar Dañados</button>
                <button className="add-button" onClick={() => handleShowTable('nc')}>Agregar Dañados con NC</button>
                <button className="add-button" onClick={() => handleShowTable('eliminados')}>Agregar Eliminados</button>
            </div>

            {visibleTables.includes('mermas') && (
                <div id="tabla-mermas">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="5%">-</th>
                                <th width="15%">Codigo</th>
                                <th width="10%">Cant.</th>
                                <th width="60%">Descripción</th>
                                <th width="15%">Tipo devolucion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.mermas.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <button className="remove-row-button" onClick={() => removeRow('mermas', index)}>-</button>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.codigo}
                                            ref={(el) => (inputRefs.current[`mermas-${index}`] = el)}
                                            onChange={(e) => handleCodigoChange('mermas', index, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.cant}
                                            maxLength="3"
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value, 10);
                                                if (!isNaN(value) && value >= 0 && value <= 999) {
                                                    handleCantidadChange('mermas', index, value);
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>{row.descripcion || 'Sin descripción'}</td>
                                    <td>MERMA</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="add-row-button" onClick={() => addRow('mermas')}>Agregar Fila</button>
                    <button className="cancel-button" onClick={() => handleHideTable('mermas')}>Cerrar Tabla</button>
                </div>
            )}

            {visibleTables.includes('nc') && (
                <div id="tabla-nc">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="5%">-</th>
                                <th width="15%">Codigo</th>
                                <th width="10%">Cant.</th>
                                <th width="60%">Descripción</th>
                                <th width="15%">Tipo devolucion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.nc.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <button className="remove-row-button" onClick={() => removeRow('nc', index)}>-</button>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.codigo}
                                            ref={(el) => (inputRefs.current[`nc-${index}`] = el)}
                                            onChange={(e) => handleCodigoChange('nc', index, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.cant}
                                            maxLength="3" // Limitar la longitud del campo a 3 caracteres
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value, 10);
                                                if (!isNaN(value) && value >= 0 && value <= 999) { // Validar que el valor esté entre 0 y 999
                                                    handleCantidadChange('nc', index, value);
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>{row.descripcion || 'Sin descripción'}</td>
                                    <td>NC</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="add-row-button" onClick={() => addRow('nc')}>Agregar Fila</button>
                    <button className="cancel-button" onClick={() => handleHideTable('nc')}>Cerrar Tabla</button>
                </div>
            )}

            {visibleTables.includes('eliminados') && (
                <div id="tabla-eliminados">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="5%">-</th>
                                <th width="15%">Codigo</th>
                                <th width="10%">Cant.</th>
                                <th width="60%">Descripción</th>
                                <th width="15%">Tipo devolucion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.eliminados.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <button className="remove-row-button" onClick={() => removeRow('eliminados', index)}>-</button>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.codigo}
                                            ref={(el) => (inputRefs.current[`eliminados-${index}`] = el)}
                                            onChange={(e) => handleCodigoChange('eliminados', index, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.cant}
                                            maxLength="3" // Limitar la longitud del campo a 3 caracteres
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value, 10);
                                                if (!isNaN(value) && value >= 0 && value <= 999) { // Validar que el valor esté entre 0 y 999
                                                    handleCantidadChange('eliminados', index, value);
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>{row.descripcion || 'Sin descripción'}</td>
                                    <td>ELIMINADO</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="add-row-button" onClick={() => addRow('eliminados')}>Agregar Fila</button>
                    <button className="cancel-button" onClick={() => handleHideTable('eliminados')}>Cerrar Tabla</button>
                </div>
            )}

            <div>
                <button className="submit-button" onClick={handleSubmit}>Enviar</button>
            </div>
        </div>
    );
};

export default MermasEnvio;