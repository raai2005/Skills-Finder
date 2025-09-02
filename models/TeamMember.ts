export type TeamMember = {
  id: string;
  name: string;
  skills: string[];
  tools: string[];
  willingToHelp: boolean;
  isActive?: boolean; // User account active status
  role?: 'admin' | 'user' | 'manager'; // User role for permissions
  lastActive?: Date; // Last login time
  borrowedItems: Array<{
    item: string;
    borrowedFrom: string;
    borrowedAt: Date;
    returnedAt?: Date;
  }>;
};
