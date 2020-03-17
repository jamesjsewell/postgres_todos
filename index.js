function editTodo(e) {
  function showEditForm(i) {
    document.getElementById(`todo-contents-${i}`).classList.add('hide');
    document.getElementById(`edit-todo-form-${i}`).classList.remove('hide');
  }

  function hideEditForm(i) {
    document.getElementById(`todo-contents-${i}`).classList.remove('hide');
    document.getElementById(`edit-todo-form-${i}`).classList.add('hide');
  }
  const todoId = e.currentTarget.getAttributeNode('todo').value;
  showEditForm(todoId);

  const cancelEditButton = document.getElementById(`cancel-edit-${todoId}`);

  cancelEditButton.addEventListener('click', e => {
    document
      .getElementById(`edit-todo-button-${todoId}`)
      .addEventListener('click', editTodo);
    hideEditForm(todoId);
  });
  const editForm = document.getElementById(`edit-todo-form-${todoId}`);
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

function renderTodo(todoData) {
  const { id } = todoData;
  const todosContainer = document.getElementById(
    !todoData.done ? 'todos-in-progress-container' : 'todos-done-container'
  );
  const todoTemplate = `
  <div id="todo-contents-${id}" class="todo-contents">
      <div class="todo-title-wrapper row">
          <div class="nine columns">
              <h5>${todoData.title}</h5>
          </div>
          <div class="three columns">
              <button id="edit-todo-button-${id}" todo="${id}" class="todo-edit-button u-pull-right"><i class="material-icons">create</i></button>
          </div>
      </div>
      <div class="row">
          <div class="twelve columns">
              <p>${todoData.body}</h5>
          </div>
      
      </div>
      <div class="row">
          <div class="twelve columns">
              <label for="todo-complete-toggle">done</label>
              <input id="todo-complete-toggle" type="checkbox" />
          </div>
      </div>
  </div>
  <form id="edit-todo-form-${id}" todo="${id}" class="edit-todo-form hide">
      <input name="title" type="text" placeholder="title" value="${todoData.title}"/>
      <select placeholder="category">
          <option value="" disabled selected>select category</option>
      </select>
      <textarea name="description" placeholder="description">${todoData.body}</textarea>
      <div class="edit-todo-actions-wrapper">
          <button id="cancel-edit-${id}" class="cancel-edit-todo" type="submit">cancel</button>
          <button id="save-edit-${id}" todo="${id}" class="save-edit-todo button-primary" type="submit">save</button>
      </div>
  </form>`;

  const existingTodo = document.getElementById(`todo-${id}`);
  if (existingTodo) {
    existingTodo.innerHTML = todoTemplate;
    document
      .getElementById(`edit-todo-button-${id}`)
      .addEventListener('click', editTodo);
    return;
  }

  const newTodo = document.createElement('div');
  newTodo.setAttribute('id', `todo-${id}`);
  newTodo.className = 'todo';
  newTodo.innerHTML = todoTemplate;

  todosContainer.prepend(newTodo);
  document
    .getElementById(`edit-todo-button-${id}`)
    .addEventListener('click', editTodo);
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
