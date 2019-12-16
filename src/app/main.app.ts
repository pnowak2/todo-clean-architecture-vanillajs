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

export class VanillaJsApp {
  private todos$: Observable<TodoVM[]>;
  private todosCount$: Observable<number>;
  private incompletedTodosCount$: Observable<number>;

  private todoApp: TodoPresenter;

  constructor() {
    // Dependency injection configuration
    const inMemoryTodoRepo: TodoRepository = new TodoInMemoryRepository();
    const getAllTodosUC: GetAllTodosUseCase = new GetAllTodosUseCase(
      inMemoryTodoRepo
    );
    const getCompletedTodosUC: GetCompletedTodosUseCase = new GetCompletedTodosUseCase(
      inMemoryTodoRepo
    );
    const getIncompletedTodosUC: GetIncompletedTodosUseCase = new GetIncompletedTodosUseCase(
      inMemoryTodoRepo
    );
    const addTodoUC: AddTodoUseCase = new AddTodoUseCase(inMemoryTodoRepo);
    const markTodoAsCompletedUC: MarkTodoAsCompletedUseCase = new MarkTodoAsCompletedUseCase(
      inMemoryTodoRepo
    );
    const markTodoAsIncompletedUC: MarkTodoAsIncompletedUseCase = new MarkTodoAsIncompletedUseCase(
      inMemoryTodoRepo
    );
    const removeTodoUC: RemoveTodoUseCase = new RemoveTodoUseCase(
      inMemoryTodoRepo
    );
    const removeCompletedTodosUC: RemoveCompletedTodosUseCase = new RemoveCompletedTodosUseCase(
      inMemoryTodoRepo
    );

    this.todoApp = new TodoDefaultPresenter(
      getAllTodosUC,
      getCompletedTodosUC,
      getIncompletedTodosUC,
      addTodoUC,
      markTodoAsCompletedUC,
      markTodoAsIncompletedUC,
      removeTodoUC,
      removeCompletedTodosUC
    );

    // View observables binding
    this.todos$ = this.todoApp.todos$;
    this.todosCount$ = this.todoApp.todosCount$;
    this.incompletedTodosCount$ = this.todoApp.incompletedTodosCount$;

    // Presenter reactive subscriptions
    this.todos$.subscribe(todos => {
      const todosEl = document.querySelector('#todos');
      todosEl.innerHTML = '';

      todos.forEach(todo => {
        const liEl = document.createElement('li');
        liEl.addEventListener(
          'click',
          this.handleItemClick.bind({
            self: this,
            todo
          })
        );

        const checkboxEl = document.createElement('input');
        checkboxEl.type = 'checkbox';
        checkboxEl.dataset.type = 'checkbox';
        checkboxEl.checked = todo.completed;

        const inputEl = document.createElement('input');
        inputEl.dataset.type = 'input';
        inputEl.value = todo.name;

        const removeEl = document.createElement('button');
        removeEl.dataset.type = 'button';
        removeEl.textContent = 'x';

        liEl.appendChild(checkboxEl);
        liEl.appendChild(inputEl);
        liEl.appendChild(removeEl);

        todosEl.appendChild(liEl);
      });
    });

    this.todosCount$.subscribe(todosCount => {
      const todosCountEl = document.querySelector('#todosCount');
      todosCountEl.textContent = todosCount + '';
    });

    this.incompletedTodosCount$.subscribe(todosCount => {
      const todosCountEl = document.querySelector('#incompletedTodosCount');
      todosCountEl.textContent = todosCount + '';
    });
  }

  public run() {
    // UI Events/Code

    this.todoApp.getAllTodos();

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

    document.querySelector('#addTodo').addEventListener('click', () => {
      const inputEl = document.querySelector(
        '#addTodoInput'
      ) as HTMLInputElement;
      this.todoApp.addTodo(inputEl.value);

      inputEl.value = '';
    });
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

    if (targetEl.dataset.type === 'input') {
      const inputEl: HTMLInputElement = targetEl as HTMLInputElement;
    }

    if (targetEl.dataset.type === 'button') {
      this.self.todoApp.removeTodo(this.todo.id);
    }
  }
}
