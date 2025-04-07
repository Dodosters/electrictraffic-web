/* Улучшенная версия скрипта для корректной работы dropdown menu с Bootstrap в React */
(function() {
  // Функция инициализации dropdown
  function initDropdowns() {
    console.log('Initializing dropdowns...');
    
    // Находим все dropdown toggles
    var dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Для каждого toggle добавляем обработчик
    dropdownToggles.forEach(function(toggle) {
      // Удаляем старый обработчик, чтобы избежать дублирования
      toggle.removeEventListener('click', toggleDropdown);
      
      // Добавляем новый обработчик
      toggle.addEventListener('click', toggleDropdown);
    });
  }

  // Функция обработчик клика по dropdown-toggle
  function toggleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Находим ближайший dropdown
    var dropdown = this.closest('.dropdown');
    
    // Закрываем все другие открытые dropdown
    document.querySelectorAll('.dropdown.show').forEach(function(openDropdown) {
      if (openDropdown !== dropdown) {
        openDropdown.classList.remove('show');
        var openToggle = openDropdown.querySelector('.dropdown-toggle');
        if (openToggle) openToggle.setAttribute('aria-expanded', 'false');
        var openMenu = openDropdown.querySelector('.dropdown-menu');
        if (openMenu) openMenu.classList.remove('show');
      }
    });
    
    // Переключаем класс show
    dropdown.classList.toggle('show');
    this.setAttribute('aria-expanded', dropdown.classList.contains('show'));
    
    // Показываем/скрываем dropdown menu
    var dropdownMenu = dropdown.querySelector('.dropdown-menu');
    if (dropdownMenu) dropdownMenu.classList.toggle('show');
  }

  // Обработчик для закрытия dropdown при клике вне
  function closeDropdownsOnOutsideClick(e) {
    var isDropdownClick = false;
    
    // Проверяем, был ли клик внутри любого dropdown
    document.querySelectorAll('.dropdown').forEach(function(dropdown) {
      if (dropdown.contains(e.target)) {
        isDropdownClick = true;
      }
    });
    
    // Если клик был вне dropdown, закрываем все открытые dropdown
    if (!isDropdownClick) {
      document.querySelectorAll('.dropdown.show').forEach(function(dropdown) {
        dropdown.classList.remove('show');
        var toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        var menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
      });
    }
  }

  // Инициализация при загрузке страницы
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    initDropdowns();
    document.removeEventListener('click', closeDropdownsOnOutsideClick);
    document.addEventListener('click', closeDropdownsOnOutsideClick);
  });

  // Важно! Добавляем повторную инициализацию через интервал
  // для поддержки динамически добавленных компонентов в React
  var initInterval = setInterval(initDropdowns, 2000);
  
  // Останавливаем интервал после 30 секунд для экономии ресурсов
  setTimeout(function() {
    clearInterval(initInterval);
  }, 30000);
  
  // Также добавляем обработчик для повторной инициализации при изменении DOM,
  // чтобы обрабатывать новые элементы, добавленные после загрузки страницы
  var observer = new MutationObserver(function(mutations) {
    // Проверяем, затрагивают ли изменения dropdown элементы
    var shouldReinitialize = mutations.some(function(mutation) {
      return Array.from(mutation.addedNodes).some(function(node) {
        return node.nodeType === 1 && (
          node.classList?.contains('dropdown') || 
          node.querySelector?.('.dropdown') ||
          node.classList?.contains('dropdown-toggle') || 
          node.querySelector?.('.dropdown-toggle')
        );
      });
    });
    
    if (shouldReinitialize) {
      console.log('DOM changed, reinitializing dropdowns');
      initDropdowns();
    }
  });
  
  // Настраиваем наблюдатель за изменениями в DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
