/* Для корректной работы dropdown menu */
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
    dropdownToggles.forEach(function(toggle) {
      var dropdown = toggle.closest('.dropdown');
      if (dropdown.classList.contains('show') && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
        dropdown.querySelector('.dropdown-menu').classList.remove('show');
      }
    });
  });
});
