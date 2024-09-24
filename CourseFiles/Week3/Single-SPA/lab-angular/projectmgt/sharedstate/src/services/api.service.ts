export const apiService = () => {
  const getProjects = () => {
    return fetch('/projects').then((response) => response.json());
  };

  const getTasks = () => {
    return fetch('/tasks').then((response) => response.json());
  };

  const getTeam = () => {
    return fetch('/team').then((response) => response.json());
  };

  return { getProjects, getTasks, getTeam };
};
