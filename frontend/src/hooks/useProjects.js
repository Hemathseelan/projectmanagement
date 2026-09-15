import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, updateProject, deleteProject } from '../store/slices/projectSlice';

export function useProjects() {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.projects);

  return {
    ...state,
    fetchProjects: (params) => dispatch(fetchProjects(params)),
    createProject: (payload) => dispatch(createProject(payload)),
    updateProject: (id, payload) => dispatch(updateProject({ id, payload })),
    deleteProject: (id) => dispatch(deleteProject(id)),
  };
}
