import { render } from "@testing-library/react";

import TodoList from "../Todos/List";

test("should render", () => {
  render(
    <TodoList todos={[]} deleteTodo={jest.fn()} completeTodo={jest.fn()} />
  );
});
