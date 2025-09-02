import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Switch, TouchableOpacity, TextInput, Alert, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TeamMemberService from '@/services/TeamMemberService';
import { TeamMember } from '@/models/TeamMember';
import { useAuth } from '@/contexts/AuthContext';
import { oldSchoolStyles } from '@/constants/OldSchoolStyles';

export default function AdminScreen() {
  const service = TeamMemberService.getInstance();
  const router = useRouter();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  
  const [members, setMembers] = useState<TeamMember[]>(service.getAllMembers());
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleToAssign, setRoleToAssign] = useState<'admin' | 'user' | 'manager'>('user');
  const [stats, setStats] = useState({
    totalMembers: members.length,
    totalSkills: countTotalUniqueSkills(members),
    totalTools: countTotalUniqueTools(members),
    pendingRequests: 3,
    borrowedItems: service.getTotalBorrowedItems(),
  });
  
  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin-login');
    } else if (!isAdmin) {
      Alert.alert('Access Denied', 'You need admin privileges to access this page.', [
        { 
          text: 'OK', 
          onPress: () => {
            router.replace('/(tabs)');
          }
        }
      ]);
    }
  }, [isAuthenticated, isAdmin, router]);

  // Count unique skills across all members
  function countTotalUniqueSkills(members: TeamMember[]): number {
    const uniqueSkills = new Set<string>();
    members.forEach(member => {
      member.skills.forEach(skill => uniqueSkills.add(skill));
    });
    return uniqueSkills.size;
  }

  // Count unique tools across all members
  function countTotalUniqueTools(members: TeamMember[]): number {
    const uniqueTools = new Set<string>();
    members.forEach(member => {
      member.tools.forEach(tool => uniqueTools.add(tool));
    });
    return uniqueTools.size;
  }

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'Logout', 
          onPress: () => {
            logout();
            router.replace('/admin-login');
          }
        }
      ]
    );
  };

  const handleToggleUserActive = (userId: string) => {
    // Toggle the user's active status
    service.toggleUserActiveStatus(userId);
    setMembers(service.getAllMembers());
    const member = service.getMemberById(userId);
    Alert.alert('Status Updated', `${member?.name} is now ${member?.isActive ? 'active' : 'inactive'}`);
  };
  
  const handleChangeUserRole = () => {
    if (!selectedMember) return;
    
    service.updateUserRole(selectedMember, roleToAssign);
    setMembers(service.getAllMembers());
    const member = service.getMemberById(selectedMember);
    Alert.alert('Role Updated', `${member?.name} is now a ${roleToAssign}`);
    setShowRoleModal(false);
    setSelectedMember(null);
  };

  const handleAddSkillToMember = () => {
    if (!selectedMember || !newSkill.trim()) return;
    
    const member = service.getMemberById(selectedMember);
    if (member && !member.skills.includes(newSkill.trim())) {
      const updatedMember = {
        ...member,
        skills: [...member.skills, newSkill.trim()]
      };
      service.updateMember(updatedMember);
      setMembers(service.getAllMembers());
      setNewSkill('');
      setShowAddSkill(false);
      setSelectedMember(null);
      setStats({
        ...stats,
        totalSkills: countTotalUniqueSkills(service.getAllMembers()),
      });
      Alert.alert('Success', `Skill added to ${member.name}`);
    }
  };

  const handleRemoveSkill = (memberId: string, skillToRemove: string) => {
    const member = service.getMemberById(memberId);
    if (member) {
      const updatedMember = {
        ...member,
        skills: member.skills.filter(skill => skill !== skillToRemove)
      };
      service.updateMember(updatedMember);
      setMembers(service.getAllMembers());
      setStats({
        ...stats,
        totalSkills: countTotalUniqueSkills(service.getAllMembers()),
      });
    }
  };

  const handleRemoveUser = (userId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Remove the user
            const memberName = service.getMemberById(userId)?.name;
            service.removeMember(userId);
            setMembers(service.getAllMembers());
            setStats({
              ...stats,
              totalMembers: service.getAllMembers().length
            });
            Alert.alert('User Deleted', `${memberName} has been removed`);
          }
        }
      ]
    );
  };

  const handleResetAllBorrowedItems = () => {
    Alert.alert(
      'Confirm Reset',
      'Are you sure you want to reset all borrowed items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => {
            // Reset all borrowed items
            service.resetAllBorrowedItems();
            setMembers(service.getAllMembers());
            setStats({
              ...stats,
              borrowedItems: 0
            });
            
            Alert.alert('Reset Complete', 'All borrowed items have been reset');
          }
        }
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000080', dark: '#000040' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.oldSchoolTitle}>ADMIN CONSOLE</ThemedText>
        <ThemedText style={styles.oldSchoolSubtitle}>SYSTEM MANAGEMENT v1.0</ThemedText>
        <View style={styles.oldSchoolDivider}></View>
      </ThemedView>

      {/* Admin Stats */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ SYSTEM STATISTICS ]</ThemedText>
        </View>

        <View style={styles.osStatsGrid}>
          <View style={styles.osStatRow}>
            <View style={styles.osStatLabel}>
              <ThemedText style={styles.osMonoText}>TOTAL PERSONNEL:</ThemedText>
            </View>
            <View style={styles.osStatValue}>
              <ThemedText style={styles.osMonoText}>{stats.totalMembers}</ThemedText>
            </View>
          </View>
          
          <View style={styles.osStatRow}>
            <View style={styles.osStatLabel}>
              <ThemedText style={styles.osMonoText}>UNIQUE SKILLS:</ThemedText>
            </View>
            <View style={styles.osStatValue}>
              <ThemedText style={styles.osMonoText}>{stats.totalSkills}</ThemedText>
            </View>
          </View>
          
          <View style={styles.osStatRow}>
            <View style={styles.osStatLabel}>
              <ThemedText style={styles.osMonoText}>AVAILABLE TOOLS:</ThemedText>
            </View>
            <View style={styles.osStatValue}>
              <ThemedText style={styles.osMonoText}>{stats.totalTools}</ThemedText>
            </View>
          </View>
          
          <View style={styles.osStatRow}>
            <View style={styles.osStatLabel}>
              <ThemedText style={styles.osMonoText}>PENDING REQUESTS:</ThemedText>
            </View>
            <View style={styles.osStatValue}>
              <ThemedText style={styles.osMonoText}>{stats.pendingRequests}</ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ SYSTEM OPERATIONS ]</ThemedText>
        </View>
        
        <View style={styles.osContentContainer}>
          <TouchableOpacity 
            style={styles.osActionButton}
            onPress={handleResetAllBorrowedItems}
          >
            <IconSymbol name="arrow.clockwise" size={20} color="#00FF00" />
            <ThemedText style={styles.osMonoText}>RESET ALL BORROWED ITEMS</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.osActionButton}
            onPress={() => Alert.alert('Notification Sent', 'Reminder sent to all users with overdue items')}
          >
            <IconSymbol name="bell.fill" size={20} color="#00FF00" />
            <ThemedText style={styles.osMonoText}>SEND OVERDUE REMINDERS</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.osActionButton, styles.osLogoutButton]}
            onPress={handleLogout}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FF0000" />
            <ThemedText style={[styles.osMonoText, {color: '#FF0000'}]}>LOGOUT</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.osActionButton}
            onPress={() => Alert.alert('Export Started', 'Skills report is being generated')}
          >
            <IconSymbol name="square.and.arrow.down" size={20} color="#00FF00" />
            <ThemedText style={styles.osMonoText}>EXPORT SKILLS REPORT</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* User Management */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ PERSONNEL MANAGEMENT ]</ThemedText>
        </View>
        
        <View style={styles.osContentContainer}>
          {members.map(member => (
            <View key={member.id} style={styles.osUserCard}>
              <View style={styles.osUserInfo}>
                <ThemedText style={styles.osUserName}>{member.name}</ThemedText>
                <ThemedText style={styles.osMonoText}>{member.skills.length} skills | {member.tools.length} tools</ThemedText>
                <View style={styles.osRoleBadge}>
                  <ThemedText style={styles.osRoleBadgeText}>{member.role || 'user'}</ThemedText>
                </View>
              </View>
              
              <View style={styles.osUserActions}>
                <View style={styles.osStatusContainer}>
                  <ThemedText style={[styles.osMonoText, {fontSize: 10, marginRight: 4}]}>{member.isActive ? 'ACTIVE' : 'INACTIVE'}</ThemedText>
                  <Switch 
                    value={member.isActive !== false} // Default to true if undefined
                    onValueChange={() => handleToggleUserActive(member.id)}
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.osIconButton}
                  onPress={() => {
                    setSelectedMember(member.id);
                    setShowAddSkill(true);
                  }}
                >
                  <IconSymbol name="plus.circle" size={24} color="#00FF00" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.osIconButton}
                  onPress={() => {
                    setSelectedMember(member.id);
                    setRoleToAssign(member.role || 'user');
                    setShowRoleModal(true);
                  }}
                >
                  <IconSymbol name="person.badge.key.fill" size={24} color="#00FF00" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.osIconButton}
                  onPress={() => handleRemoveUser(member.id)}
                >
                  <IconSymbol name="trash" size={24} color="#FF0000" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Skills Management */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ SKILLS DATABASE ]</ThemedText>
        </View>
        
        <View style={styles.osContentContainer}>
          {members.map(member => (
            <View key={`skills-${member.id}`} style={styles.osSkillsCard}>
              <ThemedText style={styles.osSkillsCardTitle}>{member.name}'s Skills</ThemedText>
              
              <View style={styles.osSkillsContainer}>
                {member.skills.map((skill, index) => (
                  <View key={index} style={styles.osSkillChip}>
                    <ThemedText style={styles.osMonoText}>{skill}</ThemedText>
                    <TouchableOpacity
                      onPress={() => handleRemoveSkill(member.id, skill)}
                    >
                      <IconSymbol name="xmark.circle.fill" size={18} color="#FF0000" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Add Skill Modal */}
      {showAddSkill && selectedMember && (
        <ThemedView style={styles.osAddSkillContainer}>
          <ThemedText style={styles.osMenuTitle}>[ ADD SKILL ]</ThemedText>
          <View style={styles.osDivider}></View>
          <ThemedText style={styles.osMonoText}>
            ADDING SKILL TO: {service.getMemberById(selectedMember)?.name}
          </ThemedText>
          
          <TextInput
            style={styles.osInput}
            placeholder="Enter skill name"
            value={newSkill}
            onChangeText={setNewSkill}
            placeholderTextColor="#00AA00"
          />
          
          <View style={styles.osButtonRow}>
            <TouchableOpacity 
              style={[styles.osButton, styles.osCancelButton]}
              onPress={() => {
                setShowAddSkill(false);
                setSelectedMember(null);
                setNewSkill('');
              }}
            >
              <ThemedText style={styles.osButtonText}>CANCEL</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.osButton, styles.osAddButton]}
              onPress={handleAddSkillToMember}
            >
              <ThemedText style={styles.osButtonText}>ADD SKILL</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      )}

      {/* Change Role Modal */}
      <Modal
        visible={showRoleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.osModalOverlay}>
          <ThemedView style={styles.osRoleModalContainer}>
            <ThemedText style={styles.osMenuTitle}>[ MODIFY ACCESS LEVEL ]</ThemedText>
            <View style={styles.osDivider}></View>
            {selectedMember && (
              <ThemedText style={styles.modalText}>
                Changing role for: {service.getMemberById(selectedMember)?.name}
              </ThemedText>
            )}
            
            <View style={styles.roleOptions}>
              <TouchableOpacity 
                style={[styles.roleOption, roleToAssign === 'user' && styles.roleOptionSelected]}
                onPress={() => setRoleToAssign('user')}
              >
                <ThemedText style={styles.roleText}>User</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.roleOption, roleToAssign === 'manager' && styles.roleOptionSelected]}
                onPress={() => setRoleToAssign('manager')}
              >
                <ThemedText style={styles.roleText}>Manager</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.roleOption, roleToAssign === 'admin' && styles.roleOptionSelected]}
                onPress={() => setRoleToAssign('admin')}
              >
                <ThemedText style={styles.roleText}>Admin</ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowRoleModal(false);
                  setSelectedMember(null);
                }}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.addButton]}
                onPress={handleChangeUserRole}
              >
                <ThemedText style={styles.buttonText}>Update Role</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  ...oldSchoolStyles,
  headerImage: {
    opacity: 0.3,
    left: -30,
    top: -50,
  },
  titleContainer: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: 'rgba(66, 135, 245, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: 'rgba(245, 66, 66, 0.2)',
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: 'rgba(66, 135, 245, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  skillsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  skillsCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: 'rgba(66, 135, 245, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillText: {
    fontSize: 12,
    marginRight: 6,
  },
  addSkillContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 4,
    padding: 10,
    marginTop: 8,
    marginBottom: 16,
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  addButton: {
    backgroundColor: '#4287f5',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleModalContainer: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 16,
  },
  modalText: {
    marginBottom: 12,
    color: '#333',
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4,
    borderRadius: 4,
  },
  roleOptionSelected: {
    backgroundColor: '#4287f5',
  },
  roleText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
