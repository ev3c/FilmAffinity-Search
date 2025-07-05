document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  
  // Función para obtener el texto seleccionado de la pestaña activa
  async function getSelectedText() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.id) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            return window.getSelection().toString().trim();
          }
        });
        
        if (results && results[0] && results[0].result) {
          return results[0].result;
        }
      }
    } catch (error) {
      console.log('No se pudo obtener el texto seleccionado:', error);
    }
    return null;
  }
  
  // Inicializar el input con texto seleccionado o valor por defecto
  getSelectedText().then(selectedText => {
    if (selectedText) {
      searchInput.value = selectedText;
    }
    // Si no hay texto seleccionado, mantiene "The Fisher King" del HTML
  });
  
  searchButton.addEventListener('click', function() {
    // Obtener el valor del input
    const searchQuery = searchInput.value.trim();
    
    // Validar que no esté vacío
    if (!searchQuery) {
      alert('Por favor, introduce el título de una película');
      searchInput.focus();
      return;
    }
    
    // Construir la URL de búsqueda de FilmAffinity (versión móvil)
    const filmAffinitySearchUrl = `https://m.filmaffinity.com/es/search.php?stext=${encodeURIComponent(searchQuery)}`;
    
    // Abrir nueva pestaña con la búsqueda
    chrome.tabs.create({
      url: filmAffinitySearchUrl,
      active: true
    }, function(tab) {
      console.log('Pestaña creada con ID:', tab.id);
      console.log('Buscando:', searchQuery);
    });
    
    // Cerrar el popup después de abrir la búsqueda
    window.close();
  });
  
  // Permitir buscar presionando Enter
  searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      searchButton.click();
    }
  });
}); 