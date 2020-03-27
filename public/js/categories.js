function renderCategory(category) {
  const id = category.id;
  const categoryChipsContainer = document.getElementById(
    'category-chips-container'
  );
  const categoryTemplate = `
    <div id="category-${id}-chip-contents" class="category-chip-contents">
      <p>${category.category_name}</p>
      <i id="category-${id}-edit" category="${id}" class="material-icons">
        create
      </i>
      <i id="category-${id}-delete" category="${id}" class="material-icons">
        clear
      </i>
    </div>
    <form id="category-${id}-edit-form" class="category-edit-form hide">
      <input id="category-${id}-input" value="${category.category_name}" />
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

function fetchCategories() {
  fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .then(categories => {
      if (!categories.length) {
        document.getElementById('category-chips-container').innerHTML = '';
        return;
      }
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        renderCategory(category);
      }
    });
}

function renderCategoriesPage() {
  // show categories view wrapper, hide todos view wrapper
  document.getElementById('todos-view-wrapper').className = 'hide';
  document.getElementById('categories-view-wrapper').className = '';

  // add event listener for posting a new category
  document
    .getElementById('category-form')
    .addEventListener('submit', addCategory);

  fetchCategories();
}
