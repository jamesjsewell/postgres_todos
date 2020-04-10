
function showLoadingSpinner() {
  document.getElementById('loading-spinner').classList.remove('hide')
}

function hideLoadingSpinner() {
  document.getElementById('loading-spinner').classList.add('hide')
}

function router() {
  if (window.location.hash === '#categories') {
    // this function is in ./public/js/categories.js
    renderCategoriesPage();
    return;
  }

  if (window.location.hash === '#todos') {
    // this function is in ./public/js/todos.js
    renderTodosPage();
  }
}
router();

window.addEventListener('hashchange', router, false);
