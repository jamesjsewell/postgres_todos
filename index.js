function renderTodo(todoData) {
  const { id } = todoData;
  const todosContainer = document.getElementById(
    !todoData.done ? 'todos-in-progress-container' : 'todos-done-container'
  );
  const todoTemplate = `
  <div id="todo-${id}-contents" class="todo-contents u-full-width">
      <div class="todo-title-wrapper">
          <div>
              <h5>${todoData.title}</h5>
          </div>
          <div class="todo-edit-buttons-wrapper">
            <button id="todo-${id}-delete-button" todo="${id}" class="todo-delete-button" ><i class="material-icons">delete</i></button>
            <button id="todo-${id}-edit-button" todo="${id}" class="todo-edit-button u-pull-right"><i class="material-icons">create</i></button>
          </div>
      </div>
      <div class="row">
          <div class="twelve columns">
              <p>${todoData.body}</h5>
          </div>
      
      </div>
      <div class="row">
          <div class="twelve columns">
              <label for="todo-${id}-complete-toggle">done</label>
              <input id="todo-${id}-complete-toggle" todo="${id}" type="checkbox" ${
    todoData.done ? 'checked' : ''
  } />
          </div>
      </div>
  </div>
  <form id="todo-${id}-edit-form" todo="${id}" class="edit-todo-form hide">
      <input name="title" type="text" placeholder="title" value="${
        todoData.title
      }"/>
      <select placeholder="category">
          <option value="" disabled selected>select category</option>
      </select>
      <textarea name="description" placeholder="description">${
        todoData.body
      }</textarea>
      <div class="edit-todo-actions-wrapper">
          <button id="todo-${id}-cancel-edit" class="cancel-edit-todo" type="submit">cancel</button>
          <button class="save-edit-todo button-primary" type="submit">save</button>
      </div>
  </form>`;

  function eventListeners() {
    document
      .getElementById(`todo-${id}-edit-button`)
      .addEventListener('click', editTodo);

    document
      .getElementById(`todo-${id}-delete-button`)
      .addEventListener('click', deleteTodo);

    document
      .getElementById(`todo-${id}-complete-toggle`)
      .addEventListener('click', completeTodo);
  }

  const existingTodo = document.getElementById(`todo-${id}`);
  if (existingTodo) {
    existingTodo.innerHTML = todoTemplate;
    eventListeners();
    return;
  }

  const newTodo = document.createElement('div');
  newTodo.setAttribute('id', `todo-${id}`);
  newTodo.className = 'todo';
  newTodo.innerHTML = todoTemplate;

  todosContainer.prepend(newTodo);
  eventListeners();
}

function completeTodo(e) {
  const id = e.currentTarget.getAttributeNode('todo').value;
  fetch(`http://localhost:3000/api/todos/${id}`, {
    headers: { 'Content-type': 'application/json' },
    method: 'put',
    body: JSON.stringify({ done: e.currentTarget.checked ? true : false })
  })
    .then(res => res.json())
    .then(updatedTodo => {
      const todo = document.getElementById(`todo-${id}`);
      if (!updatedTodo || !updatedTodo.done) {
        document.getElementById('todos-in-progress-container').prepend(todo);
        return;
      }
      document.getElementById('todos-done-container').prepend(todo);
    });
}

function deleteTodo(e) {
  const id = e.currentTarget.getAttributeNode('todo').value;
  fetch(`http://localhost:3000/api/todos/${id}`, {
    method: 'delete'
  })
    .then(res => res.json())
    .then(deletedTodo => {
      if (!deletedTodo) return;
      document.getElementById(`todo-${deletedTodo.id}`).remove();
    });
}

function editTodo(e) {
  const id = e.currentTarget.getAttributeNode('todo').value;
  function showEditForm() {
    document.getElementById(`todo-${id}-contents`).classList.add('hide');
    document.getElementById(`todo-${id}-edit-form`).classList.remove('hide');
  }

  function hideEditForm() {
    document.getElementById(`todo-${id}-contents`).classList.remove('hide');
    document.getElementById(`todo-${id}-edit-form`).classList.add('hide');
  }

  showEditForm();

  const cancelEditButton = document.getElementById(`todo-${id}-cancel-edit`);

  cancelEditButton.addEventListener('click', e => {
    document
      .getElementById(`todo-${id}-edit-button`)
      .addEventListener('click', editTodo);
    hideEditForm();
  });
  const editForm = document.getElementById(`todo-${id}-edit-form`);
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = editForm.title.value;
    const description = editForm.description.value;

    fetch(
      `http://localhost:3000/api/todos/${
        editForm.getAttributeNode('todo').value
      }`,
      {
        headers: { 'Content-type': 'application/json' },
        method: 'put',
        body: JSON.stringify({ title, body: description })
      }
    )
      .then(res => res.json())
      .then(updatedTodo => {
        renderTodo(updatedTodo);
      });
  });
}

function addTodo(e) {
  e.preventDefault();
  const title = e.target.title.value;
  const description = e.target.description.value;
  fetch('http://localhost:3000/api/todos', {
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ title, body: description })
  })
    .then(res => res.json())
    .then(todo => {
      renderTodo(todo);
    });
}

document.getElementById('todo-form').addEventListener('submit', addTodo);

// routing

function renderCategoriesPage() {
  document.getElementById('todos-container').className = 'hide';
}

function renderTodos() {
  fetch('http://localhost:3000/api/todos')
    .then(res => res.json())
    .then(todos => {
      if (!todos.length) {
        document.getElementById('todos-in-progress-container').innerHTML = '';
        document.getElementById('todos-done-container').innerHTML = '';
        return;
      }
      for (let i = 1; i < todos.length; i++) {
        const todo = todos[i];
        renderTodo(todo);
      }
    });
}

function renderTodosPage() {
  document.getElementById('todos-container').className = '';
  renderTodos();
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
