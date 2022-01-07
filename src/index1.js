/*
create object for each item
    properties include title, description, dueDate, priority... notes, checklist optional
create "projects", or separate lists of Todos
    sort of like tabbed browsing in the last project?
    on first load, there should be a default project
    users should be able to create new projects and choose which project their item goes into
separate modules:
    create new todos
    setting as complete
    changing priority
    moving them into a new project
    changing DOM things
UI requirements:
    view all projects
    view all todos in each project
        just title and due date
        maybe different colors for priority
    expand a todo to see/edit its details
    delete a todo
data storage:
*/
import './style.css';
import { v4 as uuidv4 } from 'uuid';
import {
  hideForm, loadForm, showForm, loadPage, createDOMelement,
} from './DOM';

loadForm();
loadPage();

const form = document.getElementById('form');
const projectForm = document.getElementById('new-project-form');
const todoListDiv = document.querySelector('.todo-list');
const addTodoBtn = document.querySelector('.add-new-todo');
const clearCompletedBtn = document.querySelector('.clear-completed');
const cancelNewTodoBtn = document.querySelector('.cancel-new-todo');
const projectTabsDiv = document.querySelector('.tab');
const remainingTodos = document.querySelector('.remaining-todos');
let psDisplay; let projectTabs; let projectTitleH2;

// arrays with static values for working purposes
const projects = ['View All', 'General', 'Clean Car', 'Shopping'];
const todos = [
  {
    project: 'General',
    title: 'Wash dog',
    description: 'do it right',
    priority: 'Medium',
    dueDate: '2022-01-01',
    display: false,
    id: uuidv4(),
  },
  {
    project: 'General',
    title: 'Wash cat',
    description: 'yeah right',
    priority: 'Medium',
    dueDate: '2022-01-12',
    display: false,
    id: uuidv4(),
  },
  {
    project: 'Clean Car',
    title: 'vacuum carpets',
    description: 'shampoo?',
    priority: 'Medium',
    dueDate: '2022-01-02',
    display: false,
    id: uuidv4(),
  },
  {
    project: 'Clean Car',
    title: 'Wash back blanket',
    description: 'wash cold, dry low heat',
    priority: 'High',
    dueDate: '2022-01-03',
    display: false,
    id: uuidv4(),
  },
  {
    project: 'Shopping',
    title: 'grocery',
    description: 'oats and peas and beans',
    priority: 'Medium',
    dueDate: '2022-01-05',
    display: false,
    id: uuidv4(),
  },
  {
    project: 'Shopping',
    title: 'auto parts',
    description: 'get oil',
    priority: 'Medium',
    dueDate: '2022-01-05',
    display: false,
    id: uuidv4(),
  },
];

// add tabs to DOM from array
const displayProjectsDOM = () => {
  projects.forEach((project) => {
    const id = projects.indexOf(project);
    const projectTab = createDOMelement('button', { class: 'tablinks', name: `${project}`, id: `${id}` }, '');
    projectTab.innerText = project;
    projectTabsDiv.append(projectTab);
  });
};
displayProjectsDOM();

// taking form values and adding todo to the todo array. reset, hide form.
const addTodo = () => {
  const todo = {
    project: document.getElementById('project-select').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    priority: document.getElementById('priority').value,
    dueDate: document.getElementById('due-date').value,
    display: false,
    id: uuidv4(),
  };
  todos.push(todo);
  form.reset();
  hideForm();
};

// sort by date, add array to local storage
const updateTodoLS = () => {
  todos.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
  localStorage.setItem('todoArray', JSON.stringify(todos));
};

// set all display values to false, remove todos from DOM
const removeTodoDOM = () => {
  todos.forEach((todo) => {
    todo.display = false;
  });
  while (todoListDiv.firstChild) {
    todoListDiv.removeChild(todoListDiv.firstChild);
  }
};

// add todo to DOM, using conditions to match active project
const displayTodosDOM = () => {
  let counter = 0;
  let todoContent;
  todos.forEach((todo) => {
    const filterByProject = () => {
      console.log('filter');
      todo.display = true;
      todoListDiv.appendChild(todoContent);
      counter++;
      remainingTodos.innerText = `${counter} remaining todos`;
    };
    const currentProject = document.querySelector('.project-title').name;
    todoContent = createDOMelement(
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
    if (currentProject === 'View All') {
      console.log('view all');
      filterByProject();
    } else if (todo.project === currentProject && !todo.display) {
      console.log('else');
      filterByProject();
    } else if (!currentProject) {
      projectTitleH2 = todo.project;
      console.log(todo.project);
      remainingTodos.innerText = `${counter} remaining todos`;
      console.log('false');
    }
  });
  counter = 0;
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
      const projectSelectOption = createDOMelement('option', { value: `${project}`, id: `${project}` }, `${project}`);
      const activeProject = document.querySelector('.tablinks active');
      projectSelectMenu.appendChild(projectSelectOption);
      // projectSelectMenu.value = activeProject.name;
    });
  }
};

// add project array to LS
const updateProjectLS = () => {
  localStorage.setItem('projectArray', JSON.stringify(projects));
};

// add project to project list, project array
const addNewProject = () => {
  const project = {
    title: document.getElementById('new-project').value,
    id: uuidv4(),
  };
  if (project.title === '') {
    alert('You must enter a title.');
  } else {
    projects.push(project);
    projectForm.reset();
  }
};

// tab functionality

// return if target is already active, use target id to display project name, remove all todos,
// remove the active class from old project, set active class on target, add its todos to DOM
const openProject = (e) => {
  let i;
  if (e.target.classList.contains('active')) return;
  projectTitleH2 = document.querySelector('.project-title');
  projectTitleH2.name = e.target.name;
  projectTitleH2.innerText = e.target.innerText;
  projectTitleH2.id = e.target.id;
  projectTabs = document.querySelectorAll('.tablinks');
  for (i = 0; i < projectTabs.length; i++) {
    projectTabs[i].className = projectTabs[i].className.replace(' active', '');
  }
  e.target.classList.add('active');
};

// init edit button listeners
const addEditListener = () => {
  const editBtns = document.querySelectorAll('.edit');
  editBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      todos.forEach((todo) => {
        if (e.target.id === todo.id) {
          console.log('hi');
          showForm();
          document.getElementById('title').value = todo.title,
          document.getElementById('description').value = todo.description,
          document.getElementById('priority').selected = todo.priority,
          document.getElementById('due-date').value = todo.dueDate;
          return todos.splice(e.target.id, 1);
        }
      });
    });
  });
};

// remove projects from DOM, called before displayProjectsDOM
const removeProjectsDOM = () => {
  while (projectTabsDiv.firstChild) {
    projectTabsDiv.removeChild(projectTabsDiv.firstChild);
  }
};

// clear completed
const clearCompleteTodo = () => {
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

// click event to add a project ****** auto-activate the new project!
projectTabsDiv.addEventListener('click', (e) => {
  removeTodoDOM();
  openProject(e);
  displayTodosDOM();
  addEditListener();
});

// click even to clear checked todos
clearCompletedBtn.addEventListener('click', () => {
  clearCompleteTodo();
  removeTodoDOM();
  displayTodosDOM();
});

// click event to show new todo form
addTodoBtn.addEventListener('click', () => {
  showForm();
  addProjectSelectOption();
});

// click even to reset and close new todo form
cancelNewTodoBtn.addEventListener('click', () => hideForm());

// submit event to push new todo to array, store array in LS,
// repopulate DOM elements, add listener to edit buttons
form.addEventListener('submit', (e) => {
  e.preventDefault();
  removeTodoDOM();
  addTodo();
  hideForm();
  updateTodoLS();
  displayTodosDOM();
  addEditListener();
});

const selectNewProject = () => {
  projectTabs = document.querySelectorAll('.tablinks');
  const newProject = projectTabs[projectTabs.length - 1];
  newProject.classList.add('active');
};

// submit even to add project to list and project array, store array in LS
projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // selectNewProject();
  removeTodoDOM();
  displayTodosDOM();
  addNewProject();
  updateProjectLS();
  removeProjectsDOM();
  displayProjectsDOM();
});

// still needs work

const removeProjectTodos = () => {
  let i;
  let remove;
  projects.forEach((project) => {
    for (i = 0; i < todos.length; i += 1) {
      if (todos[i].project === project) {
        remove = i;
      }
    }
    todos.splice(remove, 1);
  });
  // default to View All
  projectTitleH2.innerText = projects[0];
  projectTitleH2.id = projects[0];
};

const removeProject = () => {
  projectTabs = document.querySelectorAll('.tablinks');
  projectTabs.forEach((tab) => {
    let i; let
      remove;
    if (tab.classList.contains('active')) {
      console.log(tab);
      for (i = 0; i < todos.length; i += 1) {
        console.log(tab.name);
        console.log(todos[i]);
        if (todos[i].project === tab.name) {
          remove = i;
          console.log(todos);
          return todos.splice(remove, 1);
        }

        console.log(todos);
      }

      projects.forEach((project) => {
        if (tab.id == projects.indexOf(project)) {
          projects.splice(projects.indexOf(project), 1);
        }
      });
    }
  });
};

const deleteProjectBtn = document.querySelector('.delete-project');
deleteProjectBtn.addEventListener('click', () => {
  // removeProjectTodos()
  // removeProject()
  // removeProjectsDOM()
  // updateProjectLS()
  // displayProjectsDOM()
  // updateTodoLS()
  // displayTodosDOM()

});
