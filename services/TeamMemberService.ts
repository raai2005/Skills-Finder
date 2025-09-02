import { TeamMember } from '../models/TeamMember';

// Mock data for testing
const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Smith',
    skills: ['React Native', 'TypeScript', 'UI Design'],
    tools: ['MacBook Pro', 'Figma License', 'iPhone'],
    willingToHelp: true,
    isActive: true,
    role: 'admin',
    lastActive: new Date(),
    borrowedItems: [],
  },
  {
    id: '2',
    name: 'Bob Johnson',
    skills: ['Python', 'Data Science', 'Machine Learning'],
    tools: ['GPU Server', 'Jupyter', 'Scientific Calculator'],
    willingToHelp: true,
    isActive: true,
    role: 'user',
    lastActive: new Date(Date.now() - 86400000), // 1 day ago
    borrowedItems: [],
  },
  {
    id: '3',
    name: 'Charlie Kim',
    skills: ['Java', 'Android', 'Kotlin'],
    tools: ['Android Device', 'Soldering Iron', 'Projector'],
    willingToHelp: false,
    isActive: true,
    role: 'user',
    lastActive: new Date(Date.now() - 259200000), // 3 days ago
    borrowedItems: [],
  },
  {
    id: '4',
    name: 'Diana Chen',
    skills: ['Project Management', 'Agile', 'Leadership'],
    tools: ['Meeting Room Access', 'Whiteboard', 'Printer'],
    willingToHelp: true,
    isActive: true,
    role: 'manager',
    lastActive: new Date(Date.now() - 172800000), // 2 days ago
    borrowedItems: [],
  },
];

// Singleton class to manage team members
class TeamMemberService {
  private static instance: TeamMemberService;
  private members: TeamMember[] = [...MOCK_TEAM_MEMBERS];

  private constructor() {}

  public static getInstance(): TeamMemberService {
    if (!TeamMemberService.instance) {
      TeamMemberService.instance = new TeamMemberService();
    }
    return TeamMemberService.instance;
  }

  // Get all team members
  public getAllMembers(): TeamMember[] {
    return [...this.members];
  }

  // Get a single team member by ID
  public getMemberById(id: string): TeamMember | undefined {
    return this.members.find((member) => member.id === id);
  }

  // Add a new team member
  public addMember(member: Omit<TeamMember, 'id'>): TeamMember {
    const newMember = {
      ...member,
      id: String(this.members.length + 1),
      borrowedItems: [],
    };
    this.members.push(newMember);
    return newMember;
  }

  // Update an existing team member
  public updateMember(updatedMember: TeamMember): TeamMember | undefined {
    const index = this.members.findIndex((m) => m.id === updatedMember.id);
    if (index !== -1) {
      this.members[index] = updatedMember;
      return updatedMember;
    }
    return undefined;
  }

  // Record a borrowed item
  public borrowItem(
    borrowerId: string,
    lenderId: string,
    itemName: string
  ): boolean {
    const borrower = this.getMemberById(borrowerId);
    if (!borrower) return false;

    borrower.borrowedItems.push({
      item: itemName,
      borrowedFrom: lenderId,
      borrowedAt: new Date(),
    });

    return this.updateMember(borrower) !== undefined;
  }

  // Mark an item as returned
  public returnItem(
    borrowerId: string,
    lenderId: string,
    itemName: string
  ): boolean {
    const borrower = this.getMemberById(borrowerId);
    if (!borrower) return false;

    const borrowedItemIndex = borrower.borrowedItems.findIndex(
      (item) =>
        item.item === itemName &&
        item.borrowedFrom === lenderId &&
        !item.returnedAt
    );

    if (borrowedItemIndex === -1) return false;

    borrower.borrowedItems[borrowedItemIndex].returnedAt = new Date();
    return this.updateMember(borrower) !== undefined;
  }

  // Search members by skills, tools, or name
  public searchMembers(query: string): TeamMember[] {
    if (!query) return this.getAllMembers();
    
    const lowerQuery = query.toLowerCase();
    return this.members.filter((member) =>
      member.name.toLowerCase().includes(lowerQuery) ||
      member.skills.some((skill) => skill.toLowerCase().includes(lowerQuery)) ||
      member.tools.some((tool) => tool.toLowerCase().includes(lowerQuery))
    );
  }

  // Remove a team member (admin function)
  public removeMember(id: string): boolean {
    const initialLength = this.members.length;
    this.members = this.members.filter(member => member.id !== id);
    return this.members.length < initialLength;
  }

  // Reset all borrowed items (admin function)
  public resetAllBorrowedItems(): boolean {
    this.members.forEach(member => {
      member.borrowedItems = [];
    });
    return true;
  }

  // Get all unique skills from all team members
  public getAllUniqueSkills(): string[] {
    const skillSet = new Set<string>();
    this.members.forEach(member => {
      member.skills.forEach(skill => skillSet.add(skill));
    });
    return Array.from(skillSet);
  }

  // Get all unique tools from all team members
  public getAllUniqueTools(): string[] {
    const toolSet = new Set<string>();
    this.members.forEach(member => {
      member.tools.forEach(tool => toolSet.add(tool));
    });
    return Array.from(toolSet);
  }

  // Toggle a user's active status (admin function)
  public toggleUserActiveStatus(id: string): boolean {
    const member = this.getMemberById(id);
    if (member) {
      member.isActive = !member.isActive;
      this.updateMember(member);
      return true;
    }
    return false;
  }

  // Update a user's role (admin function)
  public updateUserRole(id: string, role: 'admin' | 'user' | 'manager'): boolean {
    const member = this.getMemberById(id);
    if (member) {
      member.role = role;
      this.updateMember(member);
      return true;
    }
    return false;
  }

  // Get total number of borrowed items
  public getTotalBorrowedItems(): number {
    let count = 0;
    this.members.forEach(member => {
      count += member.borrowedItems.filter(item => !item.returnedAt).length;
    });
    return count;
  }
}

export default TeamMemberService;
