import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // lấy dữ liệu từ local
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    // Lưu dữ liệu vào local khi todos thay đổi
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo(''); // Reset input
      inputRef.current.focus(); // Focus lại vào ô input
    }
  }, [newTodo, todos]);

  const deleteTodo = useCallback((id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  }, [todos]);

  const updateTodo = useCallback((id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  }, [todos]);

  const startEditTodo = useCallback((todo) => {
    setEditTodoId(todo.id);
    setEditText(todo.text);
  }, []);

  const saveEditTodo = useCallback(() => {
    if (editText.trim()) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editTodoId ? { ...todo, text: editText } : todo
      );
      setTodos(updatedTodos);
      setEditTodoId(null);
      setEditText('');
    }
  }, [editText, editTodoId, todos]);

  const cancelEditTodo = useCallback(() => {
    setEditTodoId(null);
    setEditText('');
  }, []);

  const completedTodosCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="ghi những gì bạn thích"
        />
        <button onClick={addTodo}>thêm</button>
      </div>

      {editTodoId !== null && (
        <div>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Sửa những gì bạn thích "
          />
          <button onClick={saveEditTodo}>Lưu</button>
          <button onClick={cancelEditTodo}>Hủy</button>
        </div>
      )}

      <ul>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id}>
              <span
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                onClick={() => updateTodo(todo.id)}
              >
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>xóa</button>
              <button onClick={() => startEditTodo(todo)}>sửa</button>
            </li>
          ))
        ) : (
          <li>Không có gì bạn muốn oke</li>
        )}
      </ul>

      <div>
        <p>Tổng: {todos.length}</p>
        <p>hoàn thành: {completedTodosCount}</p>
      </div>
    </div>
  );
}

export default App;
