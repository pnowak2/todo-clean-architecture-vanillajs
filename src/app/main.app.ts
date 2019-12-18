import { TodoInMemoryRepository } from '@domisoft/todo-clean-architecture/lib/features/todo/data/repository/inmemory/todo.inmemory.repository';
import { TodoRepository } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/repository/todo.repository';
import { AddTodoUseCase } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/usecase/add-todo.usecase';
import { GetAllTodosUseCase } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/usecase/get-all-todos.usecase';
import { GetCompletedTodosUseCase } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/usecase/get-completed-todos.usecase';
import { GetIncompletedTodosUseCase } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/usecase/get-incompleted-todos.usecase';
import { MarkTodoAsCompletedUseCase } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/usecase/mark-todo-as-complete.usecase';
import { MarkTodoAsIncompletedUseCase } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/usecase/mark-todo-as-incomplete.usecase';
import { RemoveCompletedTodosUseCase } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/usecase/remove-completed-todos.usecas';
import { RemoveTodoUseCase } from '@domisoft/todo-clean-architecture/lib/features/todo/domain/usecase/remove-todo-id.usecase';
import { TodoVM } from '@domisoft/todo-clean-architecture/lib/features/todo/presentation/state/todos.state';
import { TodoDefaultPresenter } from '@domisoft/todo-clean-architecture/lib/features/todo/presentation/todo-default.presenter';
import { TodoPresenter } from '@domisoft/todo-clean-architecture/lib/features/todo/presentation/todo.presenter';
import { Observable } from 'rxjs';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';

export class VanillaJsApp {
  private todos$: Observable<TodoVM[]>;
  private incompletedTodosCount$: Observable<number>;

  private todoApp: TodoPresenter;

  constructor() {
    // Dependency injection configuration
    this.todoApp = this.createApp();

    // View observables binding
    this.todos$ = this.todoApp.todos$;
    this.incompletedTodosCount$ = this.todoApp.incompletedTodosCount$;

    // Presenter reactive subscriptions
    this.todos$.subscribe(todos => {
      this.handleTodosUpdate(todos);
    });

    this.incompletedTodosCount$.subscribe(todosCount => {
      this.handleIncompleteTodosCountUpdate(todosCount);
    });

    document.querySelector('#getAllTodos').addEventListener('click', () => {
      this.todoApp.getAllTodos();
    });

    document
      .querySelector('#getCompletedTodos')
      .addEventListener('click', () => {
        this.todoApp.getCompletedTodos();
      });

    document
      .querySelector('#getIncompletedTodos')
      .addEventListener('click', () => {
        this.todoApp.getIncompletedTodos();
      });

    document
      .querySelector('#removeCompletedTodos')
      .addEventListener('click', () => {
        this.todoApp.removeCompletedTodos();
      });

    document.querySelector('#addTodo')
      .addEventListener('click', () => {
        const inputEl = document.querySelector('#addTodoInput') as HTMLInputElement;
        this.todoApp.addTodo(inputEl.value);

        inputEl.value = '';
      });
  }

  public run() {
    this.todoApp.getAllTodos();
  }

  private createApp(): TodoPresenter {
    const inMemoryTodoRepo: TodoRepository = new TodoInMemoryRepository();
    const getAllTodosUC: GetAllTodosUseCase = new GetAllTodosUseCase(inMemoryTodoRepo);
    const getCompletedTodosUC: GetCompletedTodosUseCase = new GetCompletedTodosUseCase(inMemoryTodoRepo);
    const getIncompletedTodosUC: GetIncompletedTodosUseCase = new GetIncompletedTodosUseCase(inMemoryTodoRepo);
    const addTodoUC: AddTodoUseCase = new AddTodoUseCase(inMemoryTodoRepo);
    const markTodoAsCompletedUC: MarkTodoAsCompletedUseCase = new MarkTodoAsCompletedUseCase(inMemoryTodoRepo);
    const markTodoAsIncompletedUC: MarkTodoAsIncompletedUseCase = new MarkTodoAsIncompletedUseCase(inMemoryTodoRepo);
    const removeTodoUC: RemoveTodoUseCase = new RemoveTodoUseCase(inMemoryTodoRepo);
    const removeCompletedTodosUC: RemoveCompletedTodosUseCase = new RemoveCompletedTodosUseCase(inMemoryTodoRepo);
    return new TodoDefaultPresenter(getAllTodosUC, getCompletedTodosUC, getIncompletedTodosUC, addTodoUC, markTodoAsCompletedUC, markTodoAsIncompletedUC, removeTodoUC, removeCompletedTodosUC);
  }

  private handleIncompleteTodosCountUpdate(todosCount: number) {
    const todosCountEl = document.querySelector('#incompletedTodosCount');
    todosCountEl.textContent = todosCount + '';
  }

  private handleTodosUpdate(todos: TodoVM[]) {
    const todosEl = document.querySelector('#todos');
    todosEl.innerHTML = '';
    todos.forEach(todo => {
      const liEl = this.createListElement(todo);
      const itemViewEl = this.createItemViewElement(todo);
      const checkboxEl = this.createCheckboxElement(todo);
      const inputEl = this.createInputElement(todo);
      const removeEl = this.createButtonElement();

      itemViewEl.appendChild(checkboxEl);
      itemViewEl.appendChild(inputEl);
      itemViewEl.appendChild(removeEl);

      liEl.appendChild(itemViewEl);

      todosEl.appendChild(liEl);
    });
  }

  private createItemViewElement(todo: TodoVM) {
    const viewEl = document.createElement('div');
    viewEl.className = 'todo-view';
    viewEl.addEventListener('click', this.handleItemClick.bind({
      self: this,
      todo
    }));
    return viewEl;
  }

  private createListElement(todo: TodoVM) {
    const liEl = document.createElement('li');
    return liEl;
  }
  private createButtonElement() {
    const removeEl = document.createElement('button');
    removeEl.dataset.type = 'button';
    removeEl.textContent = 'x';
    return removeEl;
  }

  private createInputElement(todo: TodoVM) {
    const inputEl = document.createElement('input');
    inputEl.dataset.type = 'input';
    inputEl.value = todo.name;
    return inputEl;
  }

  private createCheckboxElement(todo: TodoVM) {
    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.dataset.type = 'checkbox';
    checkboxEl.checked = todo.completed;
    return checkboxEl;
  }
  private handleItemClick(this: any, evt: MouseEvent) {
    const targetEl: HTMLElement = evt.target as HTMLElement;
    if (targetEl.dataset.type === 'checkbox') {
      const inputEl: HTMLInputElement = targetEl as HTMLInputElement;

      if (inputEl.checked) {
        this.self.todoApp.markTodoAsCompleted(this.todo.id);
      } else {
        this.self.todoApp.markTodoAsIncompleted(this.todo.id);
      }
    }

    if (targetEl.dataset.type === 'button') {
      this.self.todoApp.removeTodo(this.todo.id);
    }
  }
}
