import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCirclePlus,
  faL,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

const getLocalItems = () => {
  let list = localStorage.getItem("lists");

  if (list) {
    return JSON.parse(localStorage.getItem("lists"));
  } else {
    return [];
  }
};

const Home = () => {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState(getLocalItems());
  const [showInput, setShowInput] = useState(false);
  const [editText, setEditText] = useState("");
  const [editedTodoId, setEditedTodoId] = useState(null);
  const [todoFilter, setTodoFilter] = useState("All");
  const [err, setErr] = useState(false);
  const [activeButton, setActiveButton] = useState("All");

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(todos));
  }, [todos]);

  const handleShowInput = () => {
    setShowInput(true);
  };

  const handleCancelInput = () => {
    setShowInput(false);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    console.log(input);
  };

  const handleAdd = () => {
    if (input.trim() !== "") {
      setTodos([...todos, { id: uuidv4(), text: input, completed: false }]);
      setShowInput(false);
      setErr(false);
    } else {
      setErr(true);
    }
    setInput("");
  };

  const todoFilterPage = todos.filter((eachElement) => {
    if (todoFilter === "Completed") {
      return eachElement.completed === true;
    } else if (todoFilter === "Incomplete") {
      return eachElement.completed === false;
    } else {
      return true;
    }
  });

  const handleCheckbox = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleEdit = (id) => {
    setEditedTodoId(id);
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditText(todoToEdit.text);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim() !== "") {
      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item.id === id ? { ...item, text: editText } : item
        )
      );
      setEditedTodoId(null);
      setEditText("");
    } else {
      setErr(true);
      if (err) {
        alert("please enter data");
      }
    }
  };

  const handleDelete = (id) => {
    const deleteTodo = todos.filter((todo) => todo.id !== id);
    setTodos(deleteTodo);
  };

  const handleClearAll = () => {
    setTodos([]);
  };

  return (
    <div className="parent">
      <div className="child">
        <div className="container1">
          <div className="title">Today</div>
          <FontAwesomeIcon
            className="btn"
            onClick={handleShowInput}
            icon={faCirclePlus}
          />
        </div>

        {showInput === true ? (
          <div className="pop-up">
            <div className="pop-up-title">Add Todo</div>
            <div>
              <textarea
                className="pop-up-input"
                type="text"
                onChange={handleInput}
                placeholder="enter data here..."
              ></textarea>

              {err && <div style={{ color: "red" }}> Please Enter Data</div>}
            </div>
            <div className="pop-up-btns">
              <div className="pop-up-btn" onClick={handleCancelInput}>
                Cancel
              </div>
              <div className="pop-up-btn" onClick={handleAdd}>
                <b>Done</b>
              </div>
            </div>
          </div>
        ) : (todos.length > 0 &&
          <div>
            <div className="status">
              <button
                className={`status-btn ${
                  activeButton === "All" ? "active" : ""
                }`}
                onClick={() => {
                  setTodoFilter("All");
                  setActiveButton("All");
                }}
              >
                All
              </button>
              <button
                className={`status-btn ${
                  activeButton === "Completed" ? "active" : ""
                }`}
                onClick={() => {
                  setTodoFilter("Completed");
                  setActiveButton("Completed");
                }}
              >
                Completed
              </button>
              <button
                className={`status-btn ${
                  activeButton === "Incomplete" ? "active" : ""
                }`}
                onClick={() => {
                  setTodoFilter("Incomplete");
                  setActiveButton("Incomplete");
                }}
              >
                Incomplete
              </button>
            </div>
            <ul className="all-todos">
              {todoFilterPage.map((todo) => (
                <li className="single-todo" key={todo.id}>
                  <div>
                    <div className="abc">
                      <input
                        className="round-checkbox"
                        type="checkbox"
                        defaultChecked={todo.completed}
                        onChange={() => handleCheckbox(todo.id)}
                      />
                      {todo.completed ? (
                        <s>{todo.text}</s>
                      ) : (
                        <div>
                          {editedTodoId === todo.id ? (
                            <form onSubmit={() => handleSaveEdit(todo.id)}>
                              <input
                                className="edit-input"
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onBlur={() => handleSaveEdit(todo.id)}
                              />
                            </form>
                          ) : (
                            <div>{todo.text}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="todo-btns">
                    {editedTodoId === todo.id ? (
                      <FontAwesomeIcon
                        className="btn"
                        onClick={() => handleSaveEdit(todo.id)}
                        icon={faCircleCheck}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="btn"
                        onClick={() => handleEdit(todo.id)}
                        icon={faPenToSquare}
                      />
                    )}
                    <FontAwesomeIcon
                      className="btn"
                      onClick={() => handleDelete(todo.id)}
                      icon={faTrash}
                    />
                    {todo.completed ? (
                      <div className="complete"></div>
                    ) : (
                      <div className="incomplete"></div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="footer">
              <button onClick={handleClearAll} className="status-btn">
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
