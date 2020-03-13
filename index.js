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
      for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        document.getElementById(
          !todo.done ? 'todos-in-progress-container' : 'todos-done-container'
        ).innerHTML += `
                <div id="todo-${i}" class="todo">
                    <div id="todo-contents-${i}" class="todo-contents">
                        <div class="todo-title-wrapper row">
                            <div class="nine columns">
                                <h5>${todo.title}</h5>
                            </div>
                            <div class="three columns">
                                <button id="edit-todo-button-${i}" todo="${i}" class="todo-edit-button u-pull-right"><i class="material-icons">create</i></button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="twelve columns">
                                <p>${todo.body}</h5>
                            </div>
                        
                        </div>
                        <div class="row">
                            <div class="twelve columns">
                                <label for="todo-complete-toggle">done</label>
                                <input id="todo-complete-toggle" type="checkbox" />
                            </div>
                        </div>
                    </div>
                    <form id="edit-todo-form-${i}" class="edit-todo-form hide">
                        <input type="text" placeholder="title" value="${todo.title}"/>
                        <select placeholder="category">
                            <option value="" disabled selected>select category</option>
                        </select>
                        <textarea placeholder="description">${todo.body}</textarea>
                        <div class="edit-todo-actions-wrapper">
                            <button class="cancel-edit-todo" id="cancel-edit-${i}" type="submit">cancel</button>
                            <button class="save-edit-todo button-primary" id="save-edit-${i}" type="submit">save</button>
                        </div>
                    </form>
                </div>
            `;
      }

      function editTodo(e) {
        function showEditForm(i) {
          document.getElementById(`todo-contents-${i}`).classList.add('hide');
          document
            .getElementById(`edit-todo-form-${i}`)
            .classList.remove('hide');
        }

        function hideEditForm(i) {
          document
            .getElementById(`todo-contents-${i}`)
            .classList.remove('hide');
          document.getElementById(`edit-todo-form-${i}`).classList.add('hide');
        }
        const todoId = e.currentTarget.getAttributeNode('todo').value;
        showEditForm(todoId);

        const cancelEditButton = document.getElementById(
          `cancel-edit-${todoId}`
        );
        const saveEditButton = document.getElementById(`save-edit-${todoId}`);

        cancelEditButton.addEventListener('click', e => {
          document
            .getElementById(`edit-todo-button-${todoId}`)
            .addEventListener('click', editTodo);
          hideEditForm(todoId);
        });

        saveEditButton.addEventListener('click', e => {
          console.log(e);
        });
      }
      const editButtons = document.querySelectorAll('.todo-edit-button');
      for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', editTodo);
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
