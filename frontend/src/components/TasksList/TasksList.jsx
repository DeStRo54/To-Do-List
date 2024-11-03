/* eslint-disable react/prop-types */
import Task from '../CurrentTask/Task';
import styles from './TasksList.module.css';

const TasksList = ({data, deleteTask}) => {
    return <div className={styles['tasks-container']}>
        {data.map((action, index) => (
            <Task key={index} action={action} deleteTask={deleteTask}/>
        ))}
    </div>
}

export default TasksList;