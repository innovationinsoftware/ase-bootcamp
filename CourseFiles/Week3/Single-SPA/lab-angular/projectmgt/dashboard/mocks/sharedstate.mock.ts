export const apiServiceInstance = {
  getProjects: () => Promise.resolve([{ id: 1, name: 'Mock Project' }]),
  getTasks: () => Promise.resolve([{ id: 1, name: 'Mock Task' }]),
  getTeam: () => Promise.resolve([{ id: 1, name: 'Mock Team Member' }]),
};
