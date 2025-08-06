export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'JD',
    status: 'online'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'JS',
    status: 'online'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'MJ',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'SW',
    status: 'online'
  },
  {
    id: 'user-5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'DB',
    status: 'offline'
  },
   {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'JD',
    status: 'online'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'JS',
    status: 'online'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'MJ',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'SW',
    status: 'online'
  },
  {
    id: 'user-5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'DB',
    status: 'offline'
  },
   {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'JD',
    status: 'online'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'JS',
    status: 'online'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'MJ',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'SW',
    status: 'online'
  },
  {
    id: 'user-5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'DB',
    status: 'offline'
  },
   {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'JD',
    status: 'online'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'JS',
    status: 'online'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'MJ',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'SW',
    status: 'online'
  },
  {
    id: 'user-5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'DB',
    status: 'offline'
  }
];

export const mockTeams = [
  {
    id: 'team-1',
    name: 'Design Team',
    color: '#3B82F6',
    members: ['user-1', 'user-2', 'user-3'],
    description: 'UI/UX Design and Research'
  },
  {
    id: 'team-2',
    name: 'Development',
    color: '#10B981',
    members: ['user-1', 'user-4', 'user-5'],
    description: 'Frontend and Backend Development'
  },
  {
    id: 'team-3',
    name: 'Marketing',
    color: '#F59E0B',
    members: ['user-2', 'user-4'],
    description: 'Marketing and Growth'
  }
];

// Mock message data
export const mockDirectMessages = {
  'user-2': [
    {
      id: 'msg-1',
      senderId: 'user-2',
      content: 'Hey! How are you doing?',
      timestamp: Date.now() - 3600000,
      type: 'direct'
    },
    {
      id: 'msg-2',
      senderId: 'user-1',
      content: 'Im doing great! Thanks for asking.',
      timestamp: Date.now() - 3500000,
      type: 'direct'
    }
  ],
  'user-3': [
    {
      id: 'msg-3',
      senderId: 'user-3',
      content: 'Are we still meeting tomorrow?',
      timestamp: Date.now() - 7200000,
      type: 'direct'
    }
  ]
};

export const mockGroupMessages = {
  'team-1': [
    {
      id: 'msg-4',
      senderId: 'user-2',
      content: 'Great job on the presentation!',
      timestamp: Date.now() - 1800000,
      type: 'group',
      groupId: 'team-1'
    },
    {
      id: 'msg-5',
      senderId: 'user-3',
      content: 'Thanks everyone for the feedback.',
      timestamp: Date.now() - 1700000,
      type: 'group',
      groupId: 'team-1'
    }
  ]
};

export const mockUnreadCounts = {
  direct: {
    'user-2': 0,
    'user-3': 1,
    'user-4': 0,
    'user-5': 2
  },
  group: {
    'team-1': 0,
    'team-2': 1,
    'team-3': 0
  }
};