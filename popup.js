document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  const shareIcon = document.querySelector('.share-icon');
  
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
    
    // Seleccionar todo el texto en el campo de búsqueda para facilitar la edición
    searchInput.select();
    searchInput.focus();
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
  
  // Función para compartir la extensión por Gmail
  shareIcon.addEventListener('click', function() {
    const subject = 'FilmAffinity Search Extension';
    const body = `Te paso una extensión de Chrome/Edge que uso siempre: FilmAffinity Search Extension.
Sirve para buscar pelis, actores, directores, etc. en FilmAffinity al instante desde el navegador. 
¡Muy útil! 🍿✨

Just sharing a Chrome/Edge extension I love: FilmAffinity Search Extension.
It lets you search movies, actors, directors, etc. in FilmAffinity right from your browser. 
Super useful! 🎥💻

@https://chromewebstore.google.com/detail/afckaolgijpbnomcfpgedfgkibclaehb?utm_source=item-share-cb`;
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    chrome.tabs.create({
      url: gmailUrl,
      active: true
    });
  });
}); 