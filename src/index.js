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
import './style.css'

const todos = {}

const todo = ((title, description, dueDate, priority) => {
    return {title, description, dueDate, priority}
})

const note = todo('vacuum', 'vacuum the house', 'now', 'high')

console.log(note.priority)


// DOM stuff (separate module)
const contentDiv = document.querySelector('#content')

const createDOMelement = ((tagName, className, ...children) => {
    const el = document.createElement(tagName)
    if(className) el.classList.add(className) 
    children.forEach(child => {
        if(typeof child === 'string'){
            el.innerText = child
        } else {
            el.appendChild(child)    
        }
    })
    return el
})

const test = createDOMelement('div','testClass','this is a test', 
    createDOMelement('div', 'childClass', 'this is a child of test'))

contentDiv.appendChild(test)

