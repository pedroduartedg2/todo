// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const filterSelect = document.querySelector("#filter-select");
const inputSearch = document.querySelector("#search-input");
const eraseButton = document.querySelector("#erase-button");
let oldInputValue;
let todoSelected;

// Funções
const saveTodo = (text) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerHTML = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  todoList.appendChild(todo);
  let todos = [];
  let id = 1;
  if (localStorage.getItem("id")) id = JSON.parse(localStorage.getItem("id"));
  if (localStorage.getItem("todos")) todos = JSON.parse(localStorage.getItem("todos"));
  todos.push({
    id: id,
    title: text,
    status: "todo",
  });
  localStorage.setItem("id", id + 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    if (todoTitle.innerText == oldInputValue) {
      todoTitle.innerHTML = text;
    }
  });

  let todos2 = JSON.parse(localStorage.getItem("todos"));
  let selected = todos2.find((todo) => {
    return todo.id == todoSelected;
  });
  selected.title = text;

  localStorage.setItem("todos", JSON.stringify(todos2));
};

const updateTodoCheck = () => {
  let todos2 = JSON.parse(localStorage.getItem("todos"));
  let selected = todos2.find((todo) => {
    return todo.id == todoSelected;
  });
  if (selected.status == "todo") selected.status = "done";
  else selected.status = "todo";
  //   selected.title = text;

  localStorage.setItem("todos", JSON.stringify(todos2));
};

const removeTodo = (e) => {
  let todos = JSON.parse(localStorage.getItem("todos"));
  console.log(todos);
  let todosFiltered = todos.filter((todo) => {
    return todo.id != e.id;
  });
  localStorage.setItem("todos", JSON.stringify(todosFiltered));
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerHTML;
  }

  if (targetEl.classList.contains("finish-todo")) {
    todoSelected = parentEl.id;
    parentEl.classList.toggle("done");
    updateTodoCheck();
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    removeTodo(parentEl);
  }

  if (targetEl.classList.contains("edit-todo")) {
    todoSelected = parentEl.id;
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;
  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

filterSelect.addEventListener("change", (e) => {
  const todos = document.querySelectorAll(".todo");
  console.log(e.target.value);
  if (e.target.value == "done") {
    todos.forEach((todo) => {
      todo.classList.remove("hide");
      if (!todo.classList.contains("done")) {
        todo.classList.add("hide");
      }
    });
  }
  if (e.target.value == "all") {
    todos.forEach((todo) => {
      if (todo.classList.contains("hide")) {
        todo.classList.remove("hide");
      }
    });
  }
  if (e.target.value == "todo") {
    todos.forEach((todo) => {
      todo.classList.remove("hide");
      if (todo.classList.contains("done")) {
        todo.classList.add("hide");
      }
    });
  }
});

inputSearch.addEventListener("keyup", (e) => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerHTML.toLowerCase();
    let text = e.target.value.toLowerCase();
    if (todoTitle.includes(text)) {
      todo.classList.remove("hide");
    } else {
      todo.classList.add("hide");
    }
  });
});

eraseButton.addEventListener("click", () => {
  inputSearch.value = "";
  let keyupEvent = new Event("keyup");
  inputSearch.dispatchEvent(keyupEvent);
});

document.getElementById("todo-list");
let todos = JSON.parse(localStorage.getItem("todos"));
let todosHTML = "";
todos.forEach((todo) => {
  let classe = "";
  if (todo.status == "done") classe = "done";
  let HTML = `
    <div id="${todo.id}" class="todo ${classe}">
        <h3>${todo.title}</h3>
        <button class="finish-todo">
            <i class="fa-solid fa-check"></i>
        </button>
        <button class="edit-todo">
            <i class="fa-solid fa-pen"></i>
        </button>
        <button class="remove-todo">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>`;
  todosHTML += HTML;
});
document.querySelector("#todo-list").innerHTML = todosHTML;
