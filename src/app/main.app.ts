import { TodoDefaultPresenter, TodoInMemoryRepository, TodoPresenter, TodoRepository, TodoVM } from '@domisoft/todo-clean-architecture';
import { Observable } from 'rxjs';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import '../assets/styles.css';

export class VanillaJsApp {
  private todos$: Observable<TodoVM[]>;
  private activeTodosCount$: Observable<number>;
  private filter$: Observable<string>;

  private todoApp: TodoPresenter;

  constructor() {
    this.todoApp = this.createApp();
    this.todos$ = this.todoApp.todos$;
    this.activeTodosCount$ = this.todoApp.activeTodosCount$;
    this.filter$ = this.todoApp.filter$;

    this.todos$.subscribe(todos => {
      this.handleTodosUpdate(todos);
    });

    this.activeTodosCount$.subscribe(todosCount => {
      this.handleActiveTodosCountUpdate(todosCount);
    });

    this.filter$.subscribe(filter => {
      this.handleFilterUpdate(filter);
    });

    document.querySelector('#getAllTodos').addEventListener('click', (evt: MouseEvent) => {
      this.todoApp.getAllTodos();
      evt.preventDefault();
    });

    document
      .querySelector('#getCompletedTodos').addEventListener('click', (evt: MouseEvent) => {
        this.todoApp.getCompletedTodos();
        evt.preventDefault();
      });

    document
      .querySelector('#getActiveTodos').addEventListener('click', (evt: MouseEvent) => {
        this.todoApp.getActiveTodos();
        evt.preventDefault();
      });

    document
      .querySelector('#removeCompletedTodos').addEventListener('click', (evt: MouseEvent) => {
        this.todoApp.removeCompletedTodos();
        evt.preventDefault();
      });

    document
      .querySelector('#toggle-all').addEventListener('click', (evt: MouseEvent) => {
        const el = evt.target as HTMLInputElement;
        if(el.checked) {
          this.todoApp.markAllTodosAsCompleted();
        } else {
          this.todoApp.markAllTodosAsActive();
        }
      });

    document.querySelector('#addTodoInput')
      .addEventListener('keyup', (evt: KeyboardEvent) => {
        if (evt.key === 'Enter') {
          const el = evt.target as HTMLInputElement;
          if (el.value.trim() !== '') {
            this.todoApp.addTodo(el.value);
            el.value = '';
          }
        }
      });
  }

  public run() {
    this.todoApp.getAllTodos();
  }

  private createApp(): TodoPresenter {
    const repo: TodoRepository = new TodoInMemoryRepository([
      { id: '1', title: 'test 1', completed: true },
      { id: '2', title: 'test 2', completed: false },
      { id: '3', title: 'test 3', completed: false },
    ]);
    return new TodoDefaultPresenter(repo);
  }

  private handleActiveTodosCountUpdate(todosCount: number) {
    const todosCountEl = document.querySelector('#activeTodosCount');
    todosCountEl.textContent = todosCount + '';
  }

  private handleTodosUpdate(todos: TodoVM[]) {
    const todosEl = document.querySelector('#todos');
    todosEl.innerHTML = '';
    todos.forEach(todo => {
      const liEl = this.createListElement(todo);
      const itemViewEl = this.createItemViewElement(todo);
      const checkboxEl = this.createCheckboxElement(todo);
      const inputEl = this.createLabelElement(todo);
      const removeEl = this.createButtonElement(todo);

      itemViewEl.appendChild(checkboxEl);
      itemViewEl.appendChild(inputEl);
      itemViewEl.appendChild(removeEl);

      liEl.appendChild(itemViewEl);

      todosEl.appendChild(liEl);
    });
  }

  handleFilterUpdate(filter: string) {
    const allEl = document.querySelector('#getAllTodos');
    const activeEl = document.querySelector('#getActiveTodos');
    const completedEl = document.querySelector('#getCompletedTodos');

    [allEl, activeEl, completedEl].forEach(el => {
      el.className = '';
    })
    
    if(filter === 'active') {
      activeEl.className = 'selected';
    }
    if(filter === 'completed') {
      completedEl.className = 'selected';
    }
    if(filter === 'all') {
      allEl.className = 'selected';
    }
  }

  private createItemViewElement(todo: TodoVM) {
    const el = document.createElement('div');
    el.className = 'view';
    return el;
  }

  private createListElement(todo: TodoVM) {
    const liEl = document.createElement('li');
    return liEl;
  }

  private createButtonElement(todo: TodoVM) {
    const el = document.createElement('button');
    el.className = 'destroy';

    el.addEventListener('click', () => {
      this.todoApp.removeTodo(todo.id);
    })

    return el;
  }

  private createLabelElement(todo: TodoVM) {
    const el = document.createElement('label');
    el.textContent = todo.name;

    return el;
  }

  private createCheckboxElement(todo: TodoVM) {
    const el = document.createElement('input') as HTMLInputElement;
    el.className = 'toggle';
    el.type = 'checkbox';
    el.checked = todo.completed;

    el.addEventListener('change', (evt: MouseEvent) => {
      if (el.checked) {
        this.todoApp.markTodoAsCompleted(todo.id);
      } else {
        this.todoApp.markTodoAsActive(todo.id);
      }
    })

    return el;
  }
}
