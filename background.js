// Este script se ejecuta en segundo plano
chrome.runtime.onInstalled.addListener(() => {
  console.log('FilmAffinity Search Extension instalada');
  
  // Limpiar menús existentes primero
  chrome.contextMenus.removeAll(() => {
    // Crear el menú contextual para cuando hay texto seleccionado
    chrome.contextMenus.create({
      id: "filmaffinity-search-selection",
      title: "FilmAffinity Search : %s",
      contexts: ["selection"]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error creando menú contextual para selección:', chrome.runtime.lastError);
      } else {
        console.log('Menú contextual para selección creado exitosamente');
      }
    });
    
    // Crear el menú contextual para cuando no hay texto seleccionado
    chrome.contextMenus.create({
      id: "filmaffinity-search-default",
      title: "FilmAffinity Search : The Fisher King",
      contexts: ["page", "link", "image"]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error creando menú contextual por defecto:', chrome.runtime.lastError);
      } else {
        console.log('Menú contextual por defecto creado exitosamente');
      }
    });
  });
});

// Manejar cuando se hace clic en el icono de la extensión
chrome.action.onClicked.addListener((tab) => {
  console.log('Icono de extensión clickeado en pestaña:', tab.url);
});

// Manejar clics en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Menú contextual clickeado:', info.menuItemId);
  
  if (info.menuItemId === "filmaffinity-search-selection" || info.menuItemId === "filmaffinity-search-default") {
    let searchQuery = "";
    
    // Si hay texto seleccionado, usarlo
    if (info.selectionText && info.selectionText.trim()) {
      searchQuery = info.selectionText.trim();
      console.log('Usando texto seleccionado:', searchQuery);
    } else {
      // Si no hay texto seleccionado, usar valor por defecto
      searchQuery = "The Fisher King";
      console.log('Usando texto por defecto:', searchQuery);
    }
    
    // Construir la URL de búsqueda de FilmAffinity (versión móvil)
    const filmAffinitySearchUrl = `https://m.filmaffinity.com/es/search.php?stext=${encodeURIComponent(searchQuery)}`;
    
    // Abrir nueva pestaña con la búsqueda
    chrome.tabs.create({
      url: filmAffinitySearchUrl,
      active: true
    }).then((newTab) => {
      console.log('Pestaña creada exitosamente:', newTab.id);
      console.log('Búsqueda desde menú contextual:', searchQuery);
    }).catch((error) => {
      console.error('Error creando pestaña:', error);
    });
  }
});

// Opcional: Escuchar cuando se crean nuevas pestañas
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url && tab.url.includes('filmaffinity.com')) {
    console.log('Nueva pestaña de FilmAffinity creada:', tab.url);
  }
}); 