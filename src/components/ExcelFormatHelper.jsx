import React from 'react';

const ExcelFormatHelper = () => {
  // Sample data structure that matches the expected Excel format
  const sampleData = [
    { date: '01.04.2023', hour: 0, value: 45.2 },
    { date: '01.04.2023', hour: 1, value: 40.8 },
    { date: '01.04.2023', hour: 2, value: 38.5 },
    { date: '01.04.2023', hour: 23, value: 52.1 },
    { date: '02.04.2023', hour: 0, value: 44.7 },
    { date: '02.04.2023', hour: 1, value: 41.3 },
  ];

  // Generate a sample CSV content that would work with the backend
  const generateSampleCsv = () => {
    const headers = 'Date;Some Column;Hour;Another Column;kWh\n';
    const rows = sampleData.map(row => 
      `${row.date};Value;${row.hour};Value;${row.value}`
    ).join('\n');
    
    return headers + rows;
  };

  // Function to download the sample CSV
  const downloadSampleCsv = () => {
    const csvContent = generateSampleCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_electricity_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card p-3 mt-2 mb-4">
      <h5 className="card-title">Формат файла для анализа</h5>
      
      <div className="alert alert-info mb-3">
        <h6 className="alert-heading">Важно</h6>
        <p className="mb-0">
          Для корректной работы анализа необходимо загрузить Excel файл (.xlsx, .xls) с почасовыми данными 
          о потреблении электроэнергии в определенном формате.
        </p>
      </div>
      
      <p>Ваш Excel файл должен содержать следующие ключевые столбцы:</p>
      
      <div className="mb-3">
        <ul>
          <li>Столбец с датой (например, "01.04.2023" или "1-Apr-2023")</li>
          <li>Столбец с номером часа (от 0 до 23)</li>
          <li>Столбец с потреблением электроэнергии в кВтч</li>
        </ul>
      </div>
      
      <p>Пример структуры данных:</p>
      
      <div className="table-responsive mb-3">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Номер часа</th>
              <th>Потребление (кВтч)</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.hour}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="text-muted">
        В файле могут присутствовать и другие столбцы, но обязательно должны быть столбцы с датой, 
        номером часа и потреблением электроэнергии.
      </p>
      
      <div className="mt-3">
        <button 
          className="btn btn-outline-primary" 
          onClick={downloadSampleCsv}
        >
          <i className="bi bi-download me-2"></i>
          Скачать пример CSV файла
        </button>
      </div>
    </div>
  );
};

export default ExcelFormatHelper;
