// Mock API service for Etariff

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for businesses (юридические лица)
const businessTariffs = [
  {
    id: 1,
    region: 'Москва',
    provider: 'Мосэнергосбыт',
    tariffTypes: [
      {
        id: 1,
        name: 'Одноставочный',
        rate: 7.5,
        unit: 'руб/кВтч'
      },
      {
        id: 2,
        name: 'Двухставочный',
        rates: [
          { id: 1, name: 'День', rate: 8.6, unit: 'руб/кВтч' },
          { id: 2, name: 'Ночь', rate: 3.3, unit: 'руб/кВтч' }
        ]
      },
      {
        id: 3,
        name: 'Трехставочный',
        rates: [
          { id: 1, name: 'Пик', rate: 9.7, unit: 'руб/кВтч' },
          { id: 2, name: 'Полупик', rate: 8.1, unit: 'руб/кВтч' },
          { id: 3, name: 'Ночь', rate: 3.3, unit: 'руб/кВтч' }
        ]
      }
    ]
  },
  {
    id: 2,
    region: 'Санкт-Петербург',
    provider: 'Петроэлектросбыт',
    tariffTypes: [
      {
        id: 1,
        name: 'Одноставочный',
        rate: 7.2,
        unit: 'руб/кВтч'
      },
      {
        id: 2,
        name: 'Двухставочный',
        rates: [
          { id: 1, name: 'День', rate: 8.3, unit: 'руб/кВтч' },
          { id: 2, name: 'Ночь', rate: 3.1, unit: 'руб/кВтч' }
        ]
      },
      {
        id: 3,
        name: 'Трехставочный',
        rates: [
          { id: 1, name: 'Пик', rate: 9.4, unit: 'руб/кВтч' },
          { id: 2, name: 'Полупик', rate: 7.8, unit: 'руб/кВтч' },
          { id: 3, name: 'Ночь', rate: 3.1, unit: 'руб/кВтч' }
        ]
      }
    ]
  },
  {
    id: 3,
    region: 'Казань',
    provider: 'Татэнергосбыт',
    tariffTypes: [
      {
        id: 1,
        name: 'Одноставочный',
        rate: 6.8,
        unit: 'руб/кВтч'
      },
      {
        id: 2,
        name: 'Двухставочный',
        rates: [
          { id: 1, name: 'День', rate: 7.9, unit: 'руб/кВтч' },
          { id: 2, name: 'Ночь', rate: 2.9, unit: 'руб/кВтч' }
        ]
      }
    ]
  }
];

// Mock data for individuals (физические лица)
const personalTariffs = [
  {
    id: 1,
    region: 'Москва',
    provider: 'Мосэнергосбыт',
    tariffTypes: [
      {
        id: 1,
        name: 'Одноставочный',
        rate: 5.92,
        unit: 'руб/кВтч'
      },
      {
        id: 2,
        name: 'Двухзонный',
        rates: [
          { id: 1, name: 'День', rate: 6.81, unit: 'руб/кВтч' },
          { id: 2, name: 'Ночь', rate: 2.48, unit: 'руб/кВтч' }
        ]
      },
      {
        id: 3,
        name: 'Трехзонный',
        rates: [
          { id: 1, name: 'Пик', rate: 7.70, unit: 'руб/кВтч' },
          { id: 2, name: 'Полупик', rate: 5.92, unit: 'руб/кВтч' },
          { id: 3, name: 'Ночь', rate: 2.48, unit: 'руб/кВтч' }
        ]
      }
    ]
  },
  {
    id: 2,
    region: 'Санкт-Петербург',
    provider: 'Петроэлектросбыт',
    tariffTypes: [
      {
        id: 1,
        name: 'Одноставочный',
        rate: 5.73,
        unit: 'руб/кВтч'
      },
      {
        id: 2,
        name: 'Двухзонный',
        rates: [
          { id: 1, name: 'День', rate: 6.58, unit: 'руб/кВтч' },
          { id: 2, name: 'Ночь', rate: 2.32, unit: 'руб/кВтч' }
        ]
      }
    ]
  }
];

// Mock data for energy providers
const providers = [
  {
    id: 1,
    name: 'Мосэнергосбыт',
    regions: ['Москва', 'Московская область'],
    website: 'https://www.mosenergosbyt.ru/',
    contacts: {
      phone: '8 (499) 550-9-550',
      email: 'info@mosenergosbyt.ru'
    }
  },
  {
    id: 2,
    name: 'Петроэлектросбыт',
    regions: ['Санкт-Петербург', 'Ленинградская область'],
    website: 'https://pes.spb.ru/',
    contacts: {
      phone: '8 (812) 679-22-22',
      email: 'office@pes.spb.ru'
    }
  },
  {
    id: 3,
    name: 'Татэнергосбыт',
    regions: ['Республика Татарстан', 'Казань'],
    website: 'https://tatenergosbyt.ru/',
    contacts: {
      phone: '8 (843) 567-70-70',
      email: 'contact@tatenergosbyt.ru'
    }
  }
];

// Mock analytics data
const analyticsData = {
  regionalComparison: [
    { region: 'Москва', averageRate: 7.5, change: 5.2 },
    { region: 'Санкт-Петербург', averageRate: 7.2, change: 4.8 },
    { region: 'Казань', averageRate: 6.8, change: 3.9 },
    { region: 'Новосибирск', averageRate: 6.4, change: 4.5 },
    { region: 'Екатеринбург', averageRate: 6.9, change: 5.0 },
    { region: 'Нижний Новгород', averageRate: 6.7, change: 4.2 },
    { region: 'Краснодар', averageRate: 6.3, change: 3.8 },
    { region: 'Владивосток', averageRate: 7.1, change: 5.5 }
  ],
  yearlyTrends: [
    { year: 2018, averageRate: 5.3 },
    { year: 2019, averageRate: 5.7 },
    { year: 2020, averageRate: 6.2 },
    { year: 2021, averageRate: 6.5 },
    { year: 2022, averageRate: 6.9 },
    { year: 2023, averageRate: 7.2 },
    { year: 2024, averageRate: 7.4 },
    { year: 2025, averageRate: 7.8 }
  ],
  forecastData: [
    { year: 2025, quarter: 2, predictedRate: 7.9 },
    { year: 2025, quarter: 3, predictedRate: 8.1 },
    { year: 2025, quarter: 4, predictedRate: 8.2 },
    { year: 2026, quarter: 1, predictedRate: 8.4 },
    { year: 2026, quarter: 2, predictedRate: 8.6 }
  ]
};

// Mock FAQ data
const faqData = [
  {
    id: 1,
    question: 'Как рассчитать стоимость электроэнергии?',
    answer: 'Стоимость электроэнергии рассчитывается путем умножения объема потребленной электроэнергии на тариф. Объем потребления определяется как разница показаний счетчика на конец и начало расчетного периода.'
  },
  {
    id: 2,
    question: 'Какие бывают тарифы на электроэнергию?',
    answer: 'Существуют следующие основные виды тарифов: одноставочный (единый тариф на всё время суток), двухставочный (день/ночь) и трехставочный (пик/полупик/ночь). Выбор тарифа зависит от характера потребления электроэнергии.'
  },
  {
    id: 3,
    question: 'Как часто меняются тарифы на электроэнергию?',
    answer: 'Тарифы на электроэнергию обычно пересматриваются раз в год. В большинстве регионов России изменение тарифов происходит 1 июля.'
  },
  {
    id: 4,
    question: 'Чем отличаются тарифы для юридических и физических лиц?',
    answer: 'Тарифы для юридических лиц обычно выше, чем для физических, и могут включать дополнительные составляющие, такие как плата за мощность. Кроме того, для юридических лиц могут применяться разные тарифы в зависимости от категории напряжения и других параметров.'
  },
  {
    id: 5,
    question: 'Как перейти на другой тариф?',
    answer: 'Для перехода на другой тариф необходимо обратиться в энергосбытовую компанию с соответствующим заявлением. В некоторых случаях может потребоваться замена счетчика, если существующий не поддерживает необходимый режим учета электроэнергии.'
  }
];

// Mock news data
const newsData = [
  {
    id: 1,
    title: 'Тарифы на электроэнергию вырастут с 1 июля 2025 года',
    date: '2025-04-01',
    summary: 'Федеральная антимонопольная служба утвердила повышение тарифов на электроэнергию с 1 июля 2025 года в среднем на 5%.',
    content: 'Федеральная антимонопольная служба России утвердила повышение тарифов на электроэнергию с 1 июля 2025 года. Согласно постановлению, рост тарифов составит в среднем 5% по сравнению с действующими ставками. При этом в разных регионах повышение может отличаться в зависимости от местных условий и решений региональных энергетических комиссий.\n\nВ Москве ожидается увеличение тарифов на 4.8%, в Санкт-Петербурге — на 5.2%. Наименьший рост планируется в Республике Татарстан — всего 3.9%.\n\nПредставители ФАС отмечают, что повышение тарифов ниже прогнозируемого уровня инфляции и направлено на поддержание инвестиционной активности в электроэнергетике.'
  },
  {
    id: 2,
    title: 'Новые правила расчета платы за электроэнергию для бизнеса',
    date: '2025-03-25',
    summary: 'Министерство энергетики представило новую методику расчета стоимости электроэнергии для предприятий.',
    content: 'Министерство энергетики России разработало и представило новую методику расчета стоимости электроэнергии для предприятий. Согласно документу, с 1 сентября 2025 года вводится новый порядок учета мощности и потребления электроэнергии для юридических лиц.\n\nОсновные изменения касаются предприятий, работающих в часы пиковой нагрузки. Для них вводится дополнительный коэффициент, который будет стимулировать более равномерное потребление электроэнергии в течение суток.\n\nЭксперты отрасли отмечают, что новые правила потенциально могут снизить затраты на электроэнергию для компаний, которые смогут перенести часть производственных процессов на ночное время.'
  },
  {
    id: 3,
    title: 'Запущена государственная программа энергоэффективности',
    date: '2025-03-15',
    summary: 'Правительство России запустило новую программу повышения энергоэффективности для предприятий и населения.',
    content: 'Правительство Российской Федерации запустило новую программу повышения энергоэффективности, рассчитанную на период 2025-2030 годов. Программа предусматривает комплекс мер по снижению энергопотребления как для предприятий, так и для населения.\n\nВ рамках программы предусмотрены субсидии на установку энергосберегающего оборудования, льготные кредиты на модернизацию энергосистем предприятий, а также информационная поддержка населения по вопросам экономии электроэнергии.\n\nПо оценкам Министерства энергетики, реализация программы позволит снизить энергопотребление в стране на 7-10% к 2030 году, что приведет к существенной экономии как для потребителей, так и для всей энергосистемы страны.'
  }
];

// API endpoints
export const api = {
  // Business tariffs
  getBusinessTariffs: async () => {
    await delay(500);
    return { success: true, data: businessTariffs };
  },
  
  getBusinessTariffsByRegion: async (region) => {
    await delay(500);
    const tariffs = businessTariffs.filter(tariff => tariff.region === region);
    return { success: true, data: tariffs };
  },
  
  // Personal tariffs
  getPersonalTariffs: async () => {
    await delay(500);
    return { success: true, data: personalTariffs };
  },
  
  getPersonalTariffsByRegion: async (region) => {
    await delay(500);
    const tariffs = personalTariffs.filter(tariff => tariff.region === region);
    return { success: true, data: tariffs };
  },
  
  // Energy providers
  getProviders: async () => {
    await delay(500);
    return { success: true, data: providers };
  },
  
  getProviderById: async (id) => {
    await delay(500);
    const provider = providers.find(provider => provider.id === parseInt(id));
    if (provider) {
      return { success: true, data: provider };
    }
    return { success: false, error: 'Provider not found' };
  },
  
  // Analytics
  getAnalyticsData: async () => {
    await delay(700);
    return { success: true, data: analyticsData };
  },
  
  // Calculator functions
  calculateBusinessElectricityCost: async (params) => {
    await delay(600);
    const { region, tariffType, consumption, period } = params;
    
    // Find the region's tariff data
    const regionTariff = businessTariffs.find(t => t.region === region);
    if (!regionTariff) {
      return { 
        success: false, 
        error: 'Region not found' 
      };
    }
    
    // Find the specific tariff type
    const tariff = regionTariff.tariffTypes.find(t => t.name === tariffType);
    if (!tariff) {
      return { 
        success: false, 
        error: 'Tariff type not found' 
      };
    }
    
    // Calculate cost based on tariff type
    let cost = 0;
    if (tariff.name === 'Одноставочный') {
      cost = consumption * tariff.rate;
    } else if (tariff.name === 'Двухставочный') {
      const dayConsumption = consumption * 0.7; // Assuming 70% consumption during day
      const nightConsumption = consumption * 0.3; // Assuming 30% consumption during night
      
      const dayRate = tariff.rates.find(r => r.name === 'День').rate;
      const nightRate = tariff.rates.find(r => r.name === 'Ночь').rate;
      
      cost = (dayConsumption * dayRate) + (nightConsumption * nightRate);
    } else if (tariff.name === 'Трехставочный') {
      const peakConsumption = consumption * 0.2; // Assuming 20% consumption during peak
      const semiPeakConsumption = consumption * 0.5; // Assuming 50% consumption during semi-peak
      const nightConsumption = consumption * 0.3; // Assuming 30% consumption during night
      
      const peakRate = tariff.rates.find(r => r.name === 'Пик').rate;
      const semiPeakRate = tariff.rates.find(r => r.name === 'Полупик').rate;
      const nightRate = tariff.rates.find(r => r.name === 'Ночь').rate;
      
      cost = (peakConsumption * peakRate) + (semiPeakConsumption * semiPeakRate) + (nightConsumption * nightRate);
    }
    
    return { 
      success: true, 
      data: {
        region,
        tariffType,
        consumption,
        period,
        cost: Math.round(cost * 100) / 100,
        currency: 'руб.'
      } 
    };
  },
  
  calculatePersonalElectricityCost: async (params) => {
    await delay(600);
    const { region, tariffType, consumption, period } = params;
    
    // Find the region's tariff data
    const regionTariff = personalTariffs.find(t => t.region === region);
    if (!regionTariff) {
      return { 
        success: false, 
        error: 'Region not found' 
      };
    }
    
    // Find the specific tariff type
    const tariff = regionTariff.tariffTypes.find(t => t.name === tariffType);
    if (!tariff) {
      return { 
        success: false, 
        error: 'Tariff type not found' 
      };
    }
    
    // Calculate cost based on tariff type
    let cost = 0;
    if (tariff.name === 'Одноставочный') {
      cost = consumption * tariff.rate;
    } else if (tariff.name === 'Двухзонный') {
      const dayConsumption = consumption * 0.7; // Assuming 70% consumption during day
      const nightConsumption = consumption * 0.3; // Assuming 30% consumption during night
      
      const dayRate = tariff.rates.find(r => r.name === 'День').rate;
      const nightRate = tariff.rates.find(r => r.name === 'Ночь').rate;
      
      cost = (dayConsumption * dayRate) + (nightConsumption * nightRate);
    } else if (tariff.name === 'Трехзонный') {
      const peakConsumption = consumption * 0.2; // Assuming 20% consumption during peak
      const semiPeakConsumption = consumption * 0.5; // Assuming 50% consumption during semi-peak
      const nightConsumption = consumption * 0.3; // Assuming 30% consumption during night
      
      const peakRate = tariff.rates.find(r => r.name === 'Пик').rate;
      const semiPeakRate = tariff.rates.find(r => r.name === 'Полупик').rate;
      const nightRate = tariff.rates.find(r => r.name === 'Ночь').rate;
      
      cost = (peakConsumption * peakRate) + (semiPeakConsumption * semiPeakRate) + (nightConsumption * nightRate);
    }
    
    return { 
      success: true, 
      data: {
        region,
        tariffType,
        consumption,
        period,
        cost: Math.round(cost * 100) / 100,
        currency: 'руб.'
      } 
    };
  },
  
  // Новый метод для обработки почасовых данных
  processHourlyConsumption: async (csvData, region = 'Москва') => {
    await delay(800);
    try {
      // Парсим CSV данные
      const rows = csvData.split('\n');
      
      if (rows.length < 2) {
        return { 
          success: false, 
          error: 'Файл не содержит данных' 
        };
      }
      
      // Определяем разделитель (';' или ',')
      let delimiter = ';';
      if (rows[0].includes(',') && !rows[0].includes(';')) {
        delimiter = ',';
      }
      
      console.log(`Используем разделитель: ${delimiter}`);
      
      // Извлекаем заголовки (первая строка)
      const headers = rows[0].split(delimiter);
      console.log('Заголовки:', headers);
      
      // Анализируем первые несколько строк данных для отладки
      console.log('Первые строки данных:');
      for (let i = 1; i < Math.min(5, rows.length); i++) {
        console.log(`Строка ${i}:`, rows[i]);
      }
      
      // Специальная обработка для формата файла Подтверждение_почасового_расчета
      // Судя по логам, в этом формате:
      // - Столбец 0: дата (в формате M/D/YYYY)
      // - Столбец 1: тип дня (Выходной/Рабочий)
      // - Столбец 2: час (0-23)
      // - Столбцы 3-10: разные показатели, включая потребление
      
      console.log('Используем специальный парсер для формата с отдельными строками для каждого часа');
      
      // Создаем структуру данных, где ключ - дата, значение - объект с часами
      const daysMap = new Map();
      
      // Обрабатываем строки данных, начиная со второй (после заголовков)
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Пропускаем пустые строки
        
        const values = rows[i].split(delimiter);
        if (values.length < 3) continue; // Пропускаем строки с недостаточным количеством столбцов
        
        // Извлекаем дату и час
        let dateStr = values[0].trim();
        const hourStr = values[2].trim();
        
        // Преобразуем дату в более читаемый формат
        // Формат M/D/YYYY преобразуем в DD.MM.YYYY
        if (dateStr.match(/^\d+\/\d+\/\d{4}$/)) {
          const [month, day, year] = dateStr.split('/');
          dateStr = `${day}.${month}.${year}`;
        }
        
        // Преобразуем час в число
        let hour = parseInt(hourStr);
        if (isNaN(hour) || hour < 0 || hour > 23) continue;
        
        // Нормализуем час к интервалу 1-24 (вместо 0-23)
        const normalizedHour = hour === 0 ? 24 : hour + 1;
        
        // Определяем, какой столбец содержит потребление
        // По логам похоже, что один из столбцов 4-10 может содержать потребление
        // Для примера возьмем столбец 10 (индекс 9), но это нужно будет уточнить
        const consumptionColumnIndex = 9; // Индекс столбца с потреблением
        
        let consumption = 0;
        if (values.length > consumptionColumnIndex) {
          try {
            // Удаляем кавычки и заменяем запятую на точку для преобразования в число
            const consumptionStr = values[consumptionColumnIndex].replace(/"/g, '').replace(',', '.');
            consumption = parseFloat(consumptionStr) || 0;
          } catch (e) {
            console.error(`Ошибка преобразования значения в число: ${values[consumptionColumnIndex]}`, e);
          }
        }
        
        // Добавляем данные в Map, группируя по дате
        if (!daysMap.has(dateStr)) {
          daysMap.set(dateStr, { date: dateStr, hours: {} });
        }
        
        daysMap.get(dateStr).hours[normalizedHour] = consumption;
      }
      
      // Преобразуем Map в массив для дальнейшей обработки
      const hourlyData = Array.from(daysMap.values());
      
      if (hourlyData.length === 0) {
        return {
          success: false,
          error: 'Не удалось извлечь данные из файла. Пожалуйста, проверьте формат файла или укажите какой столбец содержит потребление.'
        };
      }
      
      console.log(`Обработано дней: ${hourlyData.length}`);
      console.log('Пример данных:', hourlyData[0]);
      
      // Получаем тарифные данные
      const regionTariff = businessTariffs.find(t => t.region === region);
      
      if (!regionTariff) {
        return { 
          success: false, 
          error: 'Регион не найден' 
        };
      }
      
      // Получаем трехставочный тариф для расчета по часам
      const threeZoneTariff = regionTariff.tariffTypes.find(type => type.name === 'Трехставочный');
      
      if (!threeZoneTariff) {
        return { 
          success: false, 
          error: 'Трехставочный тариф не найден для указанного региона' 
        };
      }
      
      // Определяем зоны суток и тарифы
      const hourlyRates = {};
      
      // Пиковые часы (предположим, с 8 до 11 и с 16 до 21)
      const peakHours = [8, 9, 10, 11, 16, 17, 18, 19, 20, 21];
      
      // Ночные часы (с 23 до 7)
      const nightHours = [23, 0, 1, 2, 3, 4, 5, 6, 7];
      
      // Полупиковые - все остальные
      const semiPeakHours = Array.from({length: 24}, (_, i) => i + 1).filter(
        hour => !peakHours.includes(hour) && !nightHours.includes(hour)
      );
      
      // Заполняем почасовые тарифы
      for (let hour = 1; hour <= 24; hour++) {
        if (peakHours.includes(hour)) {
          hourlyRates[hour] = {
            rate: threeZoneTariff.rates.find(r => r.name === 'Пик').rate,
            zone: 'Пик'
          };
        } else if (nightHours.includes(hour)) {
          hourlyRates[hour] = {
            rate: threeZoneTariff.rates.find(r => r.name === 'Ночь').rate,
            zone: 'Ночь'
          };
        } else {
          hourlyRates[hour] = {
            rate: threeZoneTariff.rates.find(r => r.name === 'Полупик').rate,
            zone: 'Полупик'
          };
        }
      }
      
      // Рассчитываем стоимость для каждого дня и часа
      const processedData = hourlyData.map(day => {
        const hoursCost = {};
        let dailyTotal = 0;
        
        for (const [hour, consumption] of Object.entries(day.hours)) {
          const hourRate = hourlyRates[hour] || {
            rate: threeZoneTariff.rates.find(r => r.name === 'Полупик').rate,
            zone: 'Полупик'
          };
          
          const cost = consumption * hourRate.rate;
          
          hoursCost[hour] = {
            consumption,
            rate: hourRate.rate,
            zone: hourRate.zone,
            cost
          };
          
          dailyTotal += cost;
        }
        
        return {
          ...day,
          hoursCost,
          dailyTotal
        };
      });
      
      return {
        success: true,
        data: {
          hourlyData: processedData,
          hourlyRates,
          zoneTariffs: {
            peak: threeZoneTariff.rates.find(r => r.name === 'Пик').rate,
            semiPeak: threeZoneTariff.rates.find(r => r.name === 'Полупик').rate,
            night: threeZoneTariff.rates.find(r => r.name === 'Ночь').rate
          }
        }
      };
    } catch (err) {
      console.error('Ошибка обработки данных:', err);
      return {
        success: false,
        error: 'Ошибка обработки данных: ' + err.message
      };
    }
  },
  
  // FAQ endpoints
  getFAQs: async () => {
    await delay(400);
    return { success: true, data: faqData };
  },
  
  // News endpoints
  getNews: async () => {
    await delay(400);
    return { success: true, data: newsData };
  },
  
  getNewsById: async (id) => {
    await delay(300);
    const news = newsData.find(n => n.id === parseInt(id));
    if (news) {
      return { success: true, data: news };
    }
    return { success: false, error: 'News article not found' };
  }
};
