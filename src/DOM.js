// DOM stuff (separate module)
const contentDiv = document.querySelector('#content')

const createDOMelement = ((tagName, attributes, ...children) => {
    const el = document.createElement(tagName)
    if(attributes) {
        for (const key in attributes) {
            el.setAttribute(key, attributes[key])
        }
    }        
    children.forEach(child => {
        if(typeof child === 'string'){
            el.innerText = child
        } else {
            el.appendChild(child)    
        }
    })
    return el
})

const loadForm = () => {
    if(document.querySelector('.form-wrapper')) return
    const form = 
        createDOMelement('div', {class: 'form-wrapper'},
            createDOMelement('div', {class: 'form-container'},
                createDOMelement('form', {class: 'form-content', id:'form'},
                    createDOMelement('h2',{}, 'New Todo'),
                    createDOMelement('label', {for: 'title', name: 'title', id: 'title-label'}, 'Todo Name:'),
                    createDOMelement('input', {type: 'text', name: 'title', id:'title'}, ''),
                    createDOMelement('label', {for: 'description', id: 'description-label'}, 'Description'),
                    createDOMelement('textarea', {name: 'description', id:'description', cols:'30', rows:'6'}, ''),
                    createDOMelement('label', {for: 'priority', id: 'priority-label'}, 'Priority:'),
                    createDOMelement('select', {name: 'priority', id: 'priority'}, 
                        createDOMelement('option', {value: 'low'}, 'Low'),
                        createDOMelement('option', {value: 'medium'}, 'Medium'), 
                        createDOMelement('option', {value: 'high'}, 'High')),
                    createDOMelement('label', {for: 'due-date'}, 'Due Date:'),
                    createDOMelement('input', {type: 'date', id: 'due-date'}, ''),
                    createDOMelement('div', {class: 'project-select'}),
                    createDOMelement('div', {class: 'form-buttons'}, 
                        createDOMelement('button', {type: 'button', class: 'cancel-new-todo'},'Cancel'),
                        createDOMelement('input', {type: 'submit', class: 'submit-new-todo', value:'Submit'}, '')
                    )
                )
            )
        )     
    contentDiv.appendChild(form)                            
}

const hideForm = () => {
    document.getElementById('form').reset()
    document.querySelector('.form-wrapper').setAttribute('style','display: none')
}

const showForm = () => {
    document.querySelector('.form-wrapper').setAttribute('style','display: block')
}

const loadPage = () => {
    hideForm()
    const header = 
        createDOMelement('div', {class: 'header'},
            createDOMelement('div', {class: 'header-title'}, 
                createDOMelement('h1', {}, 'Todos')),
            createDOMelement('div', {class: 'searchbar'},
                createDOMelement('input', {type: 'text', placeholder: 'search', name: 'searchbar', id: 'searchbar'}, '')
            )    
        )
    const main =     
        createDOMelement('div', {class: 'main'}, 
            createDOMelement('div', {class: 'project-bar'}, 
                createDOMelement('h2', {class: 'project-list'}, 'Project List',
                    createDOMelement('div', {class: 'tab', name: 'project-tabs'})),
                createDOMelement('form', {class: 'new-project-form', id: 'new-project-form'}, 
                    createDOMelement('label', {for: 'new-project'}, 'New Project:'),
                    createDOMelement('input', {type: 'text', name: 'new-project', id: 'new-project'}, ''),
                    createDOMelement('button', {type: 'submit', class: 'new-project'}, 'Submit')),
                createDOMelement('button', {type: 'button', class: 'delete-project'}, 'Delete Selected Project')),
            createDOMelement('div', {class: 'list-body'},
                createDOMelement('div', {class: 'list-header'},
                    createDOMelement('h2', {class: 'project-title'}, ''),
                    createDOMelement('p', {class: 'remaining-todos'}, '')),
                createDOMelement('div', {class: 'todo-list'},),
                createDOMelement('div', {class: 'list-buttons'},
                    createDOMelement('button', {type: 'button', class: 'add-new-todo'}, 'Add New Todo'),
                    createDOMelement('button', {type: 'button', class: 'clear-completed'}, 'Clear Completed Todos'),
                )
            )
        )
    contentDiv.appendChild(header)
    contentDiv.appendChild(main)
}

export {
    createDOMelement,
    loadForm,
    hideForm,
    showForm,
    loadPage,
}    