import React, { useState } from 'react';
import './styles/UploadExcel.css';  // Importando o arquivo CSS

const UploadExcel = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [graphImage, setGraphImage] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Por favor, selecione um arquivo antes de enviar.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadResponse = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (uploadResponse.ok) {
                const data = await uploadResponse.json();
                setColumns(data.columns);
                setData(data.data);
                setMessage('Upload realizado com sucesso!');
            } else {
                setMessage('Erro ao fazer o upload.');
                return;
            }

            const plotResponse = await fetch('http://localhost:5000/plot', {
                method: 'POST',
                body: formData,
            });

            if (plotResponse.ok) {
                const plotData = await plotResponse.json();
                setGraphImage(`data:image/png;base64,${plotData.image}`);
            } else {
                setMessage('Erro ao gerar o gráfico.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Erro ao conectar com o backend.');
        }
    };

    return (
        <div className="upload-container">
            <h1>Upload de Arquivo Excel</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Enviar</button>
            {message && <p>{message}</p>}
            {graphImage && (
                <div>
                    <h2>Gráfico Gerado</h2>
                    <img src={graphImage} alt="Gráfico Gerado" style={{ width: '300px', margin: '10px' }} />
                </div>
            )}
            {data.length > 0 && (
                <div className="table-container">
                    <h2>Tabela de Dados</h2>
                    <table className="data-table">
                        <thead>
                            <tr>
                                {columns.map((column, index) => (
                                    <th key={index}>{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex}>{row[column]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UploadExcel;
