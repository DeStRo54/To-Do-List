import { useState, useEffect } from "react";
import styles from "./ToDoList.module.css";
import TasksList from "../TasksList/TasksList.jsx";

const ToDoList = () => {
  const [inputValue, getInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [actions, getActions] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/store`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const storeData = await response.json();
      if (storeData) {
        getActions(storeData);
        setLoading(true);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, [loading]);

  const handleChange = (e) => {
    getInputValue(e.target.value);
  };

  const addTask = () => {
    const task = {
      id: Date.now(),
      val: inputValue,
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    getActions([...actions, task]);
  };

  const deleteTask = (index) => {
    let lostData = actions.filter((item) => item.id != index);
    
    fetch(`${import.meta.env.VITE_BACKEND_URL}/store/${index}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    getActions(lostData);
  };

  return (
    <div className={styles.header}>
      <span>TO-DO-LIST</span>
      <div className={styles.container}>
        <div className={styles["list-form"]}>
          <div className={styles["list-form-header"]}>
            <input type="text" onChange={handleChange} value={inputValue} />
            <button
              disabled={inputValue === "" ? true : false}
              type="button"
              onClick={addTask}
            >
              Add
            </button>
          </div>
          {loading && <TasksList data={actions} deleteTask={deleteTask} />}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;