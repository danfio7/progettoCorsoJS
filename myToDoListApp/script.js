function Todolist(){
    let ultodo, input, btnAll, btnTodo, btnCompleted;;
    
    let todos=[];

    const loadTodosFromLocalStorage = () => {
        const localTodos = localStorage.getItem('todos');
        if(localTodos){
            const todoArr = JSON.parse(localTodos);
            if(todoArr){
                todos = todoArr;
            }
        }
    }
    const saveTodosToLocalStorage = () =>{
        localStorage.setItem('todos', JSON.stringify(todos));

    }
    const removeTodo = (id)=>{
        todos = todos.filter(todo => todo.id != id);
        saveTodosToLocalStorage();
        ultodo.removeChild(ultodo.querySelector('#todo-'+id));
    }
    const toggleTodo = (id, ele)=>{
        todos = todos.map(ele => {
            if(ele.id === id){
                ele.completed = !ele.completed;
            }
            return ele;
        });
        saveTodosToLocalStorage();
        const oldClass = ele.classList.contains('completed') ? 'completed' : 'uncompleted';
        const newClass = oldClass == 'completed' ? 'uncompleted' : 'completed';
        ele.classList.replace(oldClass, newClass);
        ele.parentNode.classList.toggle('completed', true);
    }
    const createLi = ({text, id, completed}) => {
        const li=document.createElement('li');
        li.id = 'todo-'+id;
        if(completed){
            li.classList.add('completed');
        };
        const spanCheck=document.createElement('span');
        spanCheck.classList.add(completed ? 'completed' : 'uncompleted');

        const spanCross=document.createElement('span');
        spanCross.classList.add('cross');
        spanCross.addEventListener('click', (e)=>{
            removeTodo(id);
        });
        spanCheck.addEventListener('click', (e)=>{
            toggleTodo(id, e.target);
        });
        const textNode=document.createTextNode(text);

        li.appendChild(spanCheck);
        li.appendChild(textNode);
        li.appendChild(spanCross);
        return li;
    }
    const addNewTodo = (todo) =>{
        todos.unshift (todo);
        saveTodosToLocalStorage();
        const li = createLi(todo);
        const firstLi = ultodo.firstChild;
        if(!firstLi){
            ultodo.appendChild(li);
        }else{
            ultodo.insertBefore(li,firstLi);
        }
    }
    const addTodo = (e) =>{
        const key = e.keyCode 
        ele = e.target;
        // 13 = ENTER KEY
        if(key == 13 && ele.value.trim().length > 2){
            const todo = {
                text: ele.value.trim(),
                id: todos.length,
                completed: false
            }
            
            addNewTodo(todo);
            ele.value = '';
        }
    }
    const renderTodos = (todoType) => {
        const lis = ultodo.querySelectorAll('li');
        if(lis){
            lis.forEach(li => ultodo.removeChild(li));
        }
        const currentTodos = todos.filter(todo => {
            if(todoType === 'all'){
                return todo;
            }

            return (todoType === 'completed') ? todo.completed : !todo.completed;

        })
        currentTodos.map(todo => createLi(todo)).forEach(li => ultodo.append(li));
    }
    const toggleBtnClasses = (target, btns = []) => {
        target.classList.toggle('active');
        target.setAttribute('disabled',true);
        btns.forEach( btn =>  {
            btn.removeAttribute('disabled');
            btn.classList.remove('active');
        });
    }
    const addListeners = () => {
        btnAll = document.querySelector('#btnAll');
        btnCompleted = document.querySelector('#btnCompleted');
        btnTodo = document.querySelector('#btnTodo');

        btnAll.addEventListener('click', e => {
            toggleBtnClasses(e.target, [btnTodo, btnCompleted]);
            renderTodos('all');
        })
        btnCompleted.addEventListener('click', e => {
            toggleBtnClasses(e.target, [btnAll, btnTodo]);
            
            renderTodos('completed');
        })
        btnTodo.addEventListener('click', e => {
            toggleBtnClasses(e.target, [btnAll, btnCompleted]);
            renderTodos('uncompleted');
        })
    }
    const renderTodoList = () => {
        loadTodosFromLocalStorage();
        ultodo = document.querySelector('ul#todolist');
        if(!ultodo){
            ultodo=document.createElement('ul');
            ultodo.id='todolist';
            document.body.appendChild(ultodo);
        }
        //const lis = todos.map(todo => createLi(todo));
        renderTodos('all');


        input = document.querySelector('#todo');
        if(!input){
            input=document.createElement('input');
            input.id='todo';
            input.name = 'todo';
            input.placeholder = 'Add new todo';
            ultodo.parentNode.insertBefore(input, ultodo);
        }
        input.addEventListener('keyup', addTodo);

        addListeners();
    };
    return {
        getTodos : function(){
            return todos
        },
        init : function(){
            renderTodoList();
        }
    }
}
const myTodo=Todolist();
myTodo.init();
console.log(myTodo.getTodos());
console.log(myTodo);