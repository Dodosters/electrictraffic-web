/* Для корректной работы dropdown menu с Bootstrap */
document.addEventListener('DOMContentLoaded', function() {
  // Находим все dropdown toggles
  var dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  // Для каждого toggle добавляем обработчик
  dropdownToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Находим ближайший dropdown
      var dropdown = this.closest('.dropdown');
      
      // Закрываем все другие открытые dropdown
      document.querySelectorAll('.dropdown.show').forEach(function(openDropdown) {
        if (openDropdown !== dropdown) {
          openDropdown.classList.remove('show');
          openDropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
          openDropdown.querySelector('.dropdown-menu').classList.remove('show');
        }
      });
      
      // Переключаем класс show
      dropdown.classList.toggle('show');
      this.setAttribute('aria-expanded', dropdown.classList.contains('show'));
      
      // Показываем/скрываем dropdown menu
      var dropdownMenu = dropdown.querySelector('.dropdown-menu');
      dropdownMenu.classList.toggle('show');
    });
  });
  
  // Закрытие dropdown при клике вне его
  document.addEventListener('click', function(e) {
    var isDropdownClick = false;
    
    // Проверяем, был ли клик внутри любого dropdown
    dropdownToggles.forEach(function(toggle) {
      var dropdown = toggle.closest('.dropdown');
      if (dropdown.contains(e.target)) {
        isDropdownClick = true;
      }
    });
    
    // Если клик был вне dropdown, закрываем все открытые dropdown
    if (!isDropdownClick) {
      document.querySelectorAll('.dropdown.show').forEach(function(dropdown) {
        dropdown.classList.remove('show');
        dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
        dropdown.querySelector('.dropdown-menu').classList.remove('show');
      });
    }
  });
});
