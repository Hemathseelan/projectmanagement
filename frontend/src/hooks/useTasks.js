import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';

export function useTasks() {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.tasks);

  return {
    ...state,
    fetchTasks: (params) => dispatch(fetchTasks(params)),
    createTask: (payload) => dispatch(createTask(payload)),
    updateTask: (id, payload) => dispatch(updateTask({ id, payload })),
    deleteTask: (id) => dispatch(deleteTask(id)),
  };
}
