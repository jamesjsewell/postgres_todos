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

function renderCategory(categoryData) {
  const id = categoryData.id;
  const categoryChipsContainer = document.getElementById(
    'category-chips-container'
  );
  const categoryTemplate = `
    <div id="category-${id}-chip-contents" class="category-chip-contents">
      <p>${categoryData.category_name}</p>
      <i id="category-${id}-edit" category="${id}" class="material-icons">
        create
      </i>
      <i id="category-${id}-delete" category="${id}" class="material-icons">
        clear
      </i>
    </div>
    <form id="category-${id}-edit-form" class="category-edit-form hide">
      <input id="category-${id}-input" value="${categoryData.category_name}" />
      <i id="category-${id}-edit-cancel" class="material-icons category-edit-button">
        undo
      </i>
      <i id="category-${id}-edit-save" category="${id}" class="material-icons category-edit-button">
        save
      </i>
    </form>
  `;

  function eventListeners() {
    document
      .getElementById(`category-${id}-delete`)
      .addEventListener('click', deleteCategory);
    document
      .getElementById(`category-${id}-edit`)
      .addEventListener('click', editCategory);
  }

  const existingCategory = document.getElementById(`category-${id}-chip`);
  if (existingCategory) {
    existingCategory.innerHTML = categoryTemplate;
    eventListeners();
    document
      .getElementById(`category-${id}-edit`)
      .addEventListener('click', editCategory);
    return;
  }

  const newCategory = document.createElement('div');
  newCategory.setAttribute('id', `category-${id}-chip`);
  newCategory.className = 'category-chip';
  newCategory.setAttribute('category', id);
  newCategory.innerHTML = categoryTemplate;

  categoryChipsContainer.prepend(newCategory);
  eventListeners();
}

function editCategory(e) {
  const id = e.currentTarget.getAttributeNode('category').value;

  function showEditForm() {
    document
      .getElementById(`category-${id}-chip-contents`)
      .classList.add('hide');
    document
      .getElementById(`category-${id}-edit-form`)
      .classList.remove('hide');
  }

  function hideEditForm() {
    document
      .getElementById(`category-${id}-chip-contents`)
      .classList.remove('hide');
    document.getElementById(`category-${id}-edit-form`).classList.add('hide');
  }

  showEditForm();
  document
    .getElementById(`category-${id}-edit-cancel`)
    .addEventListener('click', e => {
      hideEditForm();
    });
  document
    .getElementById(`category-${id}-edit-save`)
    .addEventListener('click', e => {
      const updatedName = document.getElementById(`category-${id}-input`).value;
      fetch(
        `http://localhost:3000/api/categories/${
          e.currentTarget.getAttributeNode('category').value
        }`,
        {
          headers: { 'Content-type': 'application/json' },
          method: 'put',
          body: JSON.stringify({ category_name: updatedName })
        }
      )
        .then(res => res.json())
        .then(updatedCategory => {
          renderCategory(updatedCategory);
        });
    });
}

function deleteCategory(e) {
  const id = e.currentTarget.getAttributeNode('category').value;
  fetch(`http://localhost:3000/api/categories/${id}`, {
    method: 'delete'
  })
    .then(res => res.json())
    .then(deletedCategory => {
      if (!deletedCategory) return;
      document.getElementById(`category-${deletedCategory.id}-chip`).remove();
    });
}

function addCategory(e) {
  e.preventDefault();
  const name = e.target.category_name.value;
  fetch('http://localhost:3000/api/categories', {
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ category_name: name })
  })
    .then(res => res.json())
    .then(category => {
      renderCategory(category);
    });
}

document
  .getElementById('category-form')
  .addEventListener('submit', addCategory);
// routing

function fetchCategories() {
  fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .then(categories => {
      if (!categories.length) {
        document.getElementById('category-chips-container').innerHTML = '';
        return;
      }
      for (let i = 1; i < categories.length; i++) {
        const category = categories[i];
        renderCategory(category);
      }
    });
}

function renderCategoriesPage() {
  document.getElementById('todos-view-wrapper').className = 'hide';
  document.getElementById('categories-view-wrapper').className = '';
  fetchCategories();
}

function fetchTodos() {
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
  document.getElementById('todos-view-wrapper').className = '';
  document.getElementById('categories-view-wrapper').className = 'hide';
  fetchTodos();
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
