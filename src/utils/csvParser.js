/**
 * Утилита для обработки CSV-файлов с почасовыми данными потребления
 */

/**
 * Функция для правильного разбора строки CSV с учетом кавычек
 * @param {string} line - строка CSV
 * @param {string} delimiter - разделитель
 * @returns {Array} - массив значений
 */
function parseCSVLine(line, delimiter = ',') {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Добавляем последнее значение
  result.push(current);
  
  return result;
}

/**
 * Парсит CSV-файл с почасовыми данными потребления
 * @param {string} csvText - содержимое CSV-файла
 * @returns {Object} - структурированные данные по дням и часам
 */
export const parseHourlyConsumptionData = (csvText) => {
  // Разбиваем на строки и удаляем пустые
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
  // Проверяем, какой разделитель используется
  let delimiter = ';';
  if (lines[0] && lines[0].includes(',') && !lines[0].includes(';')) {
    delimiter = ',';
  }
  
  console.log('Определенный разделитель:', delimiter);
  
  // Анализируем первые строки для определения формата
  let format = 'unknown';
  if (lines[0].startsWith('1,2,3,4,5,6,7,8,9,10') || lines[0].startsWith('1;2;3;4;5;6;7;8;9;10')) {
    format = 'hourly_confirmation';
    console.log('Обнаружен формат "Подтверждение_почасового_расчета"');
  }
  
  // Для формата "Подтверждение_почасового_расчета" используем фиксированные индексы
  const dateIdx = 0;   // Первая колонка - дата (MM/DD/YYYY)
  const hourIdx = 2;   // Третья колонка - час (0-23)
  const consumptionIdx = 9;  // Десятая колонка - потребление
  
  console.log('Используемые индексы колонок:', { dateIdx, hourIdx, consumptionIdx });
  
  const daysMap = new Map(); // день -> {час -> потребление}
  
  // Пропускаем первую строку, если это заголовок
  const startLine = (format === 'hourly_confirmation') ? 1 : 0;
  
  // Для отладки покажем первые несколько строк
  console.log('Примеры данных:');
  for (let i = startLine; i < Math.min(startLine + 3, lines.length); i++) {
    const line = lines[i];
    // Используем специальный парсер CSV для учета кавычек
    const columns = parseCSVLine(line, delimiter);
    console.log(`Строка ${i}: `, columns);
    
    if (columns.length <= Math.max(dateIdx, hourIdx, consumptionIdx)) {
      console.log(`  - Пропущена: недостаточно колонок`);
      continue;
    }
    
    let date = columns[dateIdx].trim();
    let hour = columns[hourIdx].trim();
    let consumption = columns[consumptionIdx] ? columns[consumptionIdx].trim() : '0';
    
    // Удаляем кавычки
    consumption = consumption.replace(/"/g, '');
    
    // Заменяем запятую на точку в числах
    consumption = consumption.replace(',', '.');
    
    console.log(`  - Обработано: Дата=${date}, Час=${hour}, Потребление=${consumption}`);
  }
  
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];
    const columns = parseCSVLine(line, delimiter);
    
    if (columns.length <= Math.max(dateIdx, hourIdx, consumptionIdx)) {
      continue; // Пропускаем строки с недостаточным количеством столбцов
    }
    
    let date = columns[dateIdx].trim();
    // Для формата "Подтверждение почасового расчета" преобразуем формат даты
    if (format === 'hourly_confirmation' && date.match(/^\d+\/\d+\/\d+$/)) {
      // Преобразуем из MM/DD/YYYY в DD.MM.YYYY
      const parts = date.split('/');
      if (parts.length === 3) {
        date = `${parts[1]}.${parts[0]}.${parts[2]}`;
      }
    }
    
    let hour = columns[hourIdx].trim();
    let consumption = columns[consumptionIdx] ? columns[consumptionIdx].trim() : '0';
    
    // Удаляем кавычки
    consumption = consumption.replace(/"/g, '');
    
    // Заменяем запятую на точку в числах
    consumption = consumption.replace(',', '.');
    
    // Если час или потребление не число - пропускаем
    if (isNaN(hour) || isNaN(consumption)) {
      continue;
    }
    
    // Преобразуем в число
    hour = parseInt(hour);
    consumption = parseFloat(consumption);
    
    // Для файла "Подтверждение почасового расчета" часы начинаются с 0, преобразуем в 1-24
    if (format === 'hourly_confirmation') {
      hour = hour + 1; // Преобразуем 0-23 в 1-24
    }
    
    // Проверяем валидность часа
    if (hour < 1 || hour > 24) {
      continue;
    }
    
    // Добавляем в структуру данных
    if (!daysMap.has(date)) {
      daysMap.set(date, new Map());
    }
    
    daysMap.get(date).set(hour, consumption);
  }
  
  // Превращаем Map в обычные объекты для возврата
  const result = {
    days: [],
    hoursData: {}
  };
  
  // Сортируем дни
  const sortedDays = Array.from(daysMap.keys()).sort();
  result.days = sortedDays;
  
  // Заполняем почасовые данные
  for (const day of sortedDays) {
    const hourMap = daysMap.get(day);
    result.hoursData[day] = {};
    
    for (let hour = 1; hour <= 24; hour++) {
      result.hoursData[day][hour] = hourMap.has(hour) ? hourMap.get(hour) : 0;
    }
  }
  
  // Выводим итоговую статистику
  console.log(`Обработано ${result.days.length} дней с данными потребления`);
  if (result.days.length > 0) {
    const sampleDay = result.days[0];
    console.log(`Пример данных для дня ${sampleDay}:`, result.hoursData[sampleDay]);
  }
  
  return result;
};

/**
 * Преобразует данные потребления в формат, ожидаемый API
 * @param {Object} parsedData - данные, полученные из parseHourlyConsumptionData
 * @returns {string} - CSV строка для отправки в API
 */
export const convertToApiFormat = (parsedData) => {
  if (!parsedData || !parsedData.days || parsedData.days.length === 0) {
    return '';
  }
  
  // Создаем строки CSV
  const csvRows = [];
  
  // Заголовок 
  csvRows.push('Дата;Час;Потребление');
  
  // Данные
  for (const day of parsedData.days) {
    for (let hour = 1; hour <= 24; hour++) {
      const consumption = parsedData.hoursData[day][hour];
      if (consumption > 0) {
        // Заменяем точку на запятую для русскоязычного формата CSV
        csvRows.push(`${day};${hour};${consumption.toString().replace('.', ',')}`);
      }
    }
  }
  
  return csvRows.join('\n');
};