let categoriesCache = [];

function renderTodo(todo) {
  const { id, title, body, category, done } = todo;
  const todosContainer = document.getElementById(
    !done ? 'todos-in-progress-container' : 'todos-done-container'
  );
  const todoTemplate = `
    <div id="todo-${id}-contents" class="todo-contents" u-full-width">
        <div class="todo-title-wrapper">
            <div>
                <h5>${title}</h5>
            </div>
            <div class="todo-edit-buttons-wrapper">
              <button id="todo-${id}-delete-button" todo="${id}" class="todo-delete-button" ><i class="material-icons">delete</i></button>
              <button id="todo-${id}-edit-button" todo="${id}" class="todo-edit-button u-pull-right"><i class="material-icons">create</i></button>
            </div>
        </div>
        <div class="row">
            <div class="twelve columns">
                <p>${body}</h5>
            </div>
        
        </div>
        <div class="row">
            <div class="twelve columns">
                <label for="todo-${id}-complete-toggle">done</label>
                <input id="todo-${id}-complete-toggle" todo="${id}" type="checkbox" ${
    done ? 'checked' : ''
  } />
            </div>
        </div>
    </div>
    <form id="todo-${id}-edit-form" todo="${id}" class="edit-todo-form hide">
        <input name="title" type="text" placeholder="title" value="${title}"/>
        <select name="category" placeholder="category">
            <option value="" disabled ${
              !category ? 'selected' : ''
            }>select category</option>
            ${categoriesCache
              .map(
                category => `
              <option value="${category.id}" ${
                  category.id === todo.category ? 'selected' : ''
                }>${category.category_name}</option>
            `
              )
              .join('')}
        </select>
        <textarea name="description" placeholder="description">${body}</textarea>
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
    existingTodo.setAttribute('category', category);
    eventListeners();
    return;
  }

  const newTodo = document.createElement('div');
  newTodo.setAttribute('id', `todo-${id}`);
  newTodo.setAttribute('category', category);
  newTodo.className = 'todo';
  newTodo.innerHTML = todoTemplate;

  todosContainer.prepend(newTodo);
  eventListeners();
  clearCategoryFilter();
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
    const category = editForm.category.value;

    fetch(
      `http://localhost:3000/api/todos/${
        editForm.getAttributeNode('todo').value
      }`,
      {
        headers: { 'Content-type': 'application/json' },
        method: 'put',
        body: JSON.stringify({ title, body: description, category })
      }
    )
      .then(res => res.json())
      .then(updatedTodo => {
        renderTodo(updatedTodo);
        clearCategoryFilter();
      });
  });
}

function addTodo(e) {
  e.preventDefault();
  const title = e.target.title.value;
  const description = e.target.description.value;
  const category = e.target.category.value;
  fetch('http://localhost:3000/api/todos', {
    headers: { 'Content-type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ title, body: description, category })
  })
    .then(res => res.json())
    .then(todo => {
      renderTodo(todo);
    });
}

document.getElementById('todo-form').addEventListener('submit', addTodo);

function filterTodos(category) {
  if (document.getElementById('categories-filter-select').value === 'none')
    return;
  const todos = document.querySelectorAll('[category]');
  for (const todo of todos) {
    if (todo.getAttributeNode('category').value !== category) {
      todo.classList.add('hide');
      continue;
    }
    todo.classList.remove('hide');
  }
  document.getElementById('clear-category-filter').classList.remove('hide');
}

function addCategoryFilterOptions() {
  let categoryOptionsForSelect =
    '<option value="none" selected disabled>Select a Category</option>';
  for (const category of categoriesCache) {
    categoryOptionsForSelect += `<option value="${category.id}">${category.category_name}</option>`;
  }
  document.getElementById(
    'categories-filter-select'
  ).innerHTML = categoryOptionsForSelect;
}

function renderAddTodoForm() {
  document.getElementById(
    'add-todo-form-categories-select'
  ).innerHTML = `${categoriesCache
    .map(
      category => `
            <option value="${category.id}">${category.category_name}</option>
          `
    )
    .join('')}`;
}

function renderTodos(todos) {
  if (!todos.length) {
    document.getElementById('todos-in-progress-container').innerHTML = '';
    document.getElementById('todos-done-container').innerHTML = '';
    return;
  }
  for (let i = 1; i < todos.length; i++) {
    const todo = todos[i];
    renderTodo(todo);
  }
}

function getCategories(todos) {
  fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .then(categories => {
      categoriesCache = categories;
      renderAddTodoForm();
      addCategoryFilterOptions();
      renderTodos(todos);
    });
}

function fetchTodosAndCategories() {
  fetch('http://localhost:3000/api/todos')
    .then(res => res.json())
    .then(todos => {
      getCategories(todos);
    });
}

function clearCategoryFilter() {
  if (document.getElementById('categories-filter-select').value === 'none')
    return;
  document.getElementById('clear-category-filter').classList.add('hide');
  document.getElementById('categories-filter-select').value = 'none';
  const todos = document.querySelectorAll('[category]');
  for (const todo of todos) {
    todo.classList.remove('hide');
  }
}

function renderCategoriesFilter() {
  const categorySelect = document.getElementById('categories-filter-select');
  categorySelect.addEventListener('change', e => filterTodos(e.target.value));
  const clearCategoryFilterButton = document.getElementById(
    'clear-category-filter'
  );
  clearCategoryFilterButton.addEventListener('click', clearCategoryFilter);
}

function renderTodosPage() {
  // show todos view, hide categories view
  document.getElementById('todos-view-wrapper').className = '';
  document.getElementById('categories-view-wrapper').className = 'hide';

  renderCategoriesFilter();

  fetchTodosAndCategories();
}
