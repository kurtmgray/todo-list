import './style.css';
import { v4 as uuidv4 } from 'uuid';
import {
  hideForm, loadForm, showForm, loadPage, createDOMelement,
} from './DOM';

loadForm();
loadPage();

// arrays with static values for working purposes
const projects = [
  {
    title: 'General',
    id: uuidv4(),
  },
  {
    title: 'Clean Car',
    id: uuidv4(),
  },
  {
    title: 'Shopping',
    id: uuidv4(),
  },
];
const todos = [
  {
    project: 'General',
    title: 'Wash dog',
    description: 'do it right',
    priority: 'Medium',
    dueDate: '2022-01-01',
    // set display value to true when it is displayed, false when it's not
    // why? I lost track of that...
    display: false,
    id: uuidv4(),
  },
  {
    project: 'General',
    title: 'Wash cat',
    description: 'yeah right',
    priority: 'Medium',
    dueDate: '2022-01-12',
    // display: false,
    id: uuidv4(),
  },
  {
    project: 'Clean Car',
    title: 'vacuum carpets',
    description: 'shampoo?',
    priority: 'Medium',
    dueDate: '2022-01-02',
    // display: false,
    id: uuidv4(),
  },
  {
    project: 'Clean Car',
    title: 'Wash back blanket',
    description: 'wash cold, dry low heat',
    priority: 'High',
    dueDate: '2022-01-03',
    // display: false,
    id: uuidv4(),
  },
  {
    project: 'Shopping',
    title: 'grocery',
    description: 'oats and peas and beans',
    priority: 'Medium',
    dueDate: '2022-01-05',
    // display: false,
    id: uuidv4(),
  },
  {
    project: 'Shopping',
    title: 'auto parts',
    description: 'get oil',
    priority: 'Medium',
    dueDate: '2022-01-05',
    // display: false,
    id: uuidv4(),
  },
];

const todoForm = document.getElementById('form');
const projectForm = document.getElementById('new-project-form');
const todoListDiv = document.querySelector('.todo-list');
const addTodoBtn = document.querySelector('.add-new-todo');
const clearCompletedBtn = document.querySelector('.clear-completed');
const cancelNewTodoBtn = document.querySelector('.cancel-new-todo');
const projectTabsDiv = document.querySelector('.tab');
const remainingTodos = document.querySelector('.remaining-todos');
const viewAllBtn = document.getElementById('view-all');
let psDisplay = false;
let projectTabs; let projectTitleH2;

// add project tabs to DOM from projects array
const displayProjectsDOM = () => {
  psDisplay = true;
  projects.forEach((project) => {
    const projectTab = createDOMelement('button', { class: 'tablinks', name: `${project.title}`, id: `${project.id}` }, '');
    projectTab.innerText = project.title;
    projectTabsDiv.append(projectTab);
  });
};
displayProjectsDOM();

// taking form values and adding todo to the todo array. reset form.
const addTodo = () => {
  const todo = {
    // will remove project key - keeping it at a check to make sure filter is working as intended
    project: document.getElementById('project-select').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    priority: document.getElementById('priority').value,
    dueDate: document.getElementById('due-date').value,
    // display: false,
    id: uuidv4(),
  };
  todos.push(todo);
  todoForm.reset();
};

// sort by date, add array to local storage
const updateTodoLS = () => {
  todos.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
  localStorage.setItem('todoArray', JSON.stringify(todos));
};

// remove all Todos from DOM (called before filterTodosDOM)
const removeTodosDOM = () => {
  // todos.forEach((todo) => {
  //   todo.display = false;
  // });
  while (todoListDiv.firstChild) {
    todoListDiv.removeChild(todoListDiv.firstChild);
  }
};

// return if target is already active, use target id to display project name
// remove the active class from old project, set active class on target
// placed here because I needed to use it in filterTodosDOM
const openProject = (e) => {
  if (e.target.classList.contains('active')) return;
  projectTitleH2 = document.querySelector('.project-title');
  projectTitleH2.name = e.target.name;
  projectTitleH2.innerText = e.target.innerText;
  projectTitleH2.id = e.target.id;
  projectTabs = document.querySelectorAll('.tablinks');
  // when to use for vs forEach?
  for (let i = 0; i < projectTabs.length; i++) {
    projectTabs[i].className = projectTabs[i].className.replace(' active', '');
  }
  e.target.classList.add('active');
};

// add todo to DOM, using conditions to match active project
const filterTodosDOM = () => {
  // counter to be used to show # of remaining todos
  let counter = 0;
  const activeProject = document.querySelector('.active');
  console.log(activeProject);
  todos.forEach((todo) => {
    const displayAllTodos = () => {
      // todo.display = true;
      todoListDiv.appendChild(todoContent);
      counter++;
      remainingTodos.innerText = `${counter} remaining todos`;
    };
    const displayFilteredTodos = () => {
      if (activeProject.name === todo.project) {
        todoListDiv.appendChild(todoContent);
        counter++;
        remainingTodos.innerText = `${counter} remaining todos`;
      }
    };
    const todoContent = createDOMelement(
      'div',
      { class: 'todo-container', id: `${todo.id}` },
      createDOMelement(
        'div',
        { class: 'todo-content' },
        createDOMelement('input', { type: 'checkbox', class: 'checkbox', id: `${todo.id}` }, ''),
        createDOMelement('p', { class: 'todo-text' }, `${todo.project}, ${todo.title}, ${todo.description}, ${todo.dueDate}, ${todo.priority}`),
        createDOMelement('button', { type: 'button', class: 'edit', id: `${todo.id}` }, 'Edit'),
      ),
    );
    if (activeProject.id === 'view-all') {
      displayAllTodos();
      console.log('hi');
      // openProject();
    } else {
      displayFilteredTodos();
    }
  });
  counter = 0;
};

// clear checked todos
const clearCompletedTodo = () => {
  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach((box) => {
    if (box.checked) {
      todos.forEach((todo) => {
        if (box.id === todo.id) {
          todos.splice(todos.indexOf(todo), 1);
        }
      });
    }
  });
};

// adding select project option to new todo form if projects exist
const addProjectSelectOption = () => {
  // if (psDisplay === true) return;
  if (projects.length >= 1) {
    psDisplay = true;
    const projectSelectDiv = document.querySelector('.project-select');
    while (projectSelectDiv.firstChild) {
      projectSelectDiv.removeChild(projectSelectDiv.firstChild);
    }
    const projectSelectLabel = createDOMelement('label', { for: 'project-select' }, 'Select Project:');
    const projectSelectMenu = createDOMelement('select', { name: 'project-select', id: 'project-select' });
    projectSelectDiv.appendChild(projectSelectLabel);
    projectSelectDiv.appendChild(projectSelectMenu);
    projects.forEach((project) => {
      const projectSelectOption = createDOMelement('option', { value: `${project.title}`, id: `${project.id}` }, `${project.title}`);
      const activeProject = document.querySelector('.active');
      projectSelectMenu.appendChild(projectSelectOption);
      if (project.id === activeProject.id) {
        const defaultOption = document.getElementById(`${project.id}`);
        defaultOption.selected = true;
      }
    });
  }
};

// add project object to project list, project array
const addNewProject = () => {
  const project = {
    title: document.getElementById('new-project').value,
    id: uuidv4(),
  };
  if (project.title === '') {
    alert('You must enter a title.'); // replace with something better
  } else {
    projects.push(project);
    projectForm.reset();
  }
};

// add project array to LS
const updateProjectLS = () => {
  localStorage.setItem('projectArray', JSON.stringify(projects));
};

// edit button listeners
// created because I had issues with event listeners not listeneing once they were clicked
// different way to address that?
const addEditListeners = () => {
  const editBtns = document.querySelectorAll('.edit');
  editBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      for (let i = 0; i < todos.length; i++) {
        if (e.target.id === todos[i].id) {
          showForm();
          // change title of form to "edit todo"
          addProjectSelectOption();
          document.getElementById('title').value = todos[i].title,
          document.getElementById('description').value = todos[i].description,
          document.getElementById('priority').selected = todos[i].priority,
          document.getElementById('due-date').value = todos[i].dueDate;
          return todos.splice(i, 1);
        }
      }
    });
  });
};

// remove projects from DOM, called before displayProjectsDOM
const removeProjectsDOM = () => {
  while (projectTabsDiv.firstChild) {
    projectTabsDiv.removeChild(projectTabsDiv.firstChild);
  }
};

// sets the new project to active by default
const selectNewProject = () => {
  viewAllBtn.className.replace(' active', '');
  projectTabs = document.querySelectorAll('.tablinks');
  const newProject = projectTabs[projectTabs.length - 1];
  newProject.classList.add('active');
  const newProjectBtn = document.querySelector('.active');
  console.log('check');
  // newProjectBtn.click('click', (e) => {
  //   console.log(e);
  // });
};

// click event to show new todo form
addTodoBtn.addEventListener('click', () => {
  showForm();
  addProjectSelectOption();
});

// click event to reset and close new todo form
cancelNewTodoBtn.addEventListener('click', () => hideForm());

// click event to view all, with different behavior from other project tabs
viewAllBtn.addEventListener('click', (e) => {
  openProject(e);
  removeTodosDOM();
  filterTodosDOM();
});

// click event to apply "active" class, display project name, filter/display todos by project
projectTabsDiv.addEventListener('click', (e) => {
  removeTodosDOM();
  openProject(e);
  filterTodosDOM();
  addEditListeners(); // also re(?)activate listeners
});

// submit even to add project to list and project array, store array in LS
projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  selectNewProject();
  addNewProject();
  updateProjectLS();
  removeProjectsDOM();
  displayProjectsDOM();
  removeTodosDOM();
  filterTodosDOM();
});

// click even to clear checked todos
clearCompletedBtn.addEventListener('click', () => {
  clearCompletedTodo();
  removeTodosDOM();
  filterTodosDOM();
});

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  hideForm();
  removeTodosDOM();
  addTodo();
  updateTodoLS();
  filterTodosDOM();
  addEditListeners();
});
