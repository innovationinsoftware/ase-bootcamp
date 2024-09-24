let projects = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'Description of Project Alpha',
    date: '2023-01-01',
  },
  {
    id: 2,
    name: 'Project Beta',
    description: 'Description of Project Beta',
    date: '2023-02-01',
  },
  {
    id: 3,
    name: 'Project Gamma',
    description: 'Description of Project Gamma',
    date: '2023-03-01',
  },
  {
    id: 4,
    name: 'Project Delta',
    description: 'Description of Project Delta',
    date: '2023-04-01',
  },
  {
    id: 5,
    name: 'Project Epsilon',
    description: 'Description of Project Epsilon',
    date: '2023-05-01',
  },
  {
    id: 6,
    name: 'Project Zeta',
    description: 'Description of Project Zeta',
    date: '2023-06-01',
  },
  {
    id: 7,
    name: 'Project Eta',
    description: 'Description of Project Eta',
    date: '2023-07-01',
  },
  {
    id: 8,
    name: 'Project Theta',
    description: 'Description of Project Theta',
    date: '2023-08-01',
  },
  {
    id: 9,
    name: 'Project Iota',
    description: 'Description of Project Iota',
    date: '2023-09-01',
  },
  {
    id: 10,
    name: 'Project Kappa',
    description: 'Description of Project Kappa',
    date: '2023-10-01',
  },
];

let tasks = [
  { id: 1, projectId: 1, name: 'Design Mockups', status: 'Completed' },
  { id: 2, projectId: 2, name: 'API Integration', status: 'In Progress' },
];

let teams = [
  { id: 1, name: 'Team Alpha', members: ['John Doe', 'Jane Smith'] },
  { id: 2, name: 'Team Beta', members: ['Alice Johnson', 'Bob Brown'] },
];

export const sharedStateResource = () => {
  let sharedState: any = {
    dashboard: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      totalTeamMembers: teams.length,
      projects: projects,
      tasks: tasks,
      teams: teams,
    },
  };

  const getState = (key: string) => sharedState[key];
  const setState = (key: string, value: string) => {
    sharedState[key] = value;
  };

  return { getState, setState };
};
