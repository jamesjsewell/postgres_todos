function addTodo(e) {
  e.preventDefault();
  const title = e.target.title.value;
  const description = e.target.description.value;
  fetch('http://localhost:3000/api/todos', {
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ title, body: description })
  }).then(res => {
    console.log(res);
  });
}

function updateTodo() {}

function deleteTodo() {}

document.getElementById('todo-form').addEventListener('submit', addTodo);

// routing

function renderCategoriesPage() {
  document.getElementById('todos-container').className = 'hide';
}

function renderTodosPage() {
  document.getElementById('todos-container').className = '';
}

function router() {
  if (window.location.hash === '#categories') {
    renderCategoriesPage();
    return;
  }

  if (window.location.hash === '#todos') {
    renderTodosPage();
  }
}
router();
window.addEventListener('hashchange', router, false);
