import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Modal, Button, Alert, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TeamMemberList } from '@/components/TeamMemberList';
import { TeamMemberProfile } from '@/components/TeamMemberProfile';
import { RequestHelp } from '@/components/RequestHelp';
import TeamMemberService from '@/services/TeamMemberService';
import { TeamMember } from '@/models/TeamMember';
import { BorrowedItemsTracker } from '@/components/BorrowedItemsTracker';
import { SkillsAnalytics } from '@/components/SkillsAnalytics';
import { ActivityFeed } from '@/components/ActivityFeed';
import { QuickActions } from '@/components/QuickActions';
import { oldSchoolStyles } from '@/constants/OldSchoolStyles';

export default function ExploreScreen() {
  const service = TeamMemberService.getInstance();
  const [members, setMembers] = useState<TeamMember[]>(service.getAllMembers());
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showBorrowedItems, setShowBorrowedItems] = useState(false);
  const [searchSkill, setSearchSkill] = useState<string | null>(null);
  
  // For this demo, we'll use a hardcoded current user
  const currentUserId = '1'; // Alice's ID
  
  // Extract all skills from team members
  const allSkills = useMemo(() => {
    const skills: string[] = [];
    members.forEach(member => {
      skills.push(...member.skills);
    });
    return skills;
  }, [members]);
  
  // Filter members by selected skill if any
  const displayMembers = useMemo(() => {
    if (!searchSkill) return members;
    return members.filter(member => 
      member.skills.some(skill => skill.toLowerCase() === searchSkill.toLowerCase())
    );
  }, [members, searchSkill]);
  
  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleUpdateMember = (updatedMember: TeamMember) => {
    service.updateMember(updatedMember);
    setMembers(service.getAllMembers());
    setSelectedMember(null);
  };

  const handleRequestHelp = (memberId: string, message: string) => {
    console.log(`Request help from ${memberId}: ${message}`);
    Alert.alert("Help Request Sent", `Your request has been sent to ${service.getMemberById(memberId)?.name}`);
  };

  const handleBorrowItem = (lenderId: string, itemName: string) => {
    service.borrowItem(currentUserId, lenderId, itemName);
    // Refresh the members list to show updated borrowed items
    setMembers(service.getAllMembers());
    Alert.alert("Item Requested", `You've requested to borrow ${itemName}`);
  };

  const handleSelectSkill = (skill: string) => {
    setSearchSkill(skill);
    Alert.alert("Skill Selected", `Showing team members with ${skill} skill`);
  };

  const handleActivitySelect = (activity: any) => {
    Alert.alert("Activity Details", activity.message);
  };

  const handleCreateTeam = (name: string, description: string) => {
    console.log(`Team created: ${name}, ${description}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000080', dark: '#000040' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.3.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.oldSchoolTitle}>TEAM SKILLS EXPLORER</ThemedText>
        <ThemedText style={styles.oldSchoolSubtitle}>FINDER v1.0</ThemedText>
        <View style={styles.oldSchoolDivider}></View>
        {searchSkill && (
          <View style={styles.searchSkillTag}>
            <ThemedText style={styles.osMonoText}>Showing: {searchSkill}</ThemedText>
            <Button title="Clear" onPress={() => setSearchSkill(null)} />
          </View>
        )}
      </ThemedView>
      
      {/* Quick action buttons */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ QUICK ACTIONS ]</ThemedText>
        </View>
        <View style={styles.osContentContainer}>
          <QuickActions onCreateTeam={handleCreateTeam} />
        </View>
      </ThemedView>
      
      {/* Skills Analytics */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ SKILLS ANALYTICS ]</ThemedText>
        </View>
        <View style={styles.osContentContainer}>
          <SkillsAnalytics skills={allSkills} onSelectSkill={handleSelectSkill} />
        </View>
      </ThemedView>
      
      {/* Activity Feed */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ ACTIVITY FEED ]</ThemedText>
        </View>
        <View style={styles.osContentContainer}>
          <ActivityFeed allMembers={members} onSelectActivity={handleActivitySelect} />
        </View>
      </ThemedView>
      
      {/* Borrowed Items Button */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ RESOURCE MANAGEMENT ]</ThemedText>
        </View>
        <View style={styles.osContentContainer}>
          <Button 
            title="MY BORROWED ITEMS" 
            onPress={() => setShowBorrowedItems(true)} 
          />
        </View>
      </ThemedView>

      {/* Team member list with search */}
      <ThemedView style={styles.oldSchoolContainer}>
        <View style={styles.osHeader}>
          <ThemedText style={styles.osMenuTitle}>[ TEAM MEMBERS ]</ThemedText>
        </View>
        <View style={styles.osContentContainer}>
          <ThemedText style={styles.osMonoText}>PERSONNEL RECORDS ({displayMembers.length})</ThemedText>
          <View style={styles.osDivider}></View>
          <TeamMemberList 
            members={displayMembers} 
            onSelectMember={handleSelectMember} 
          />
        </View>
      </ThemedView>

      {/* Modal for viewing and editing a team member profile */}
      <Modal
        visible={selectedMember !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedMember(null)}
      >
        {selectedMember && (
          <View style={styles.osModalContainer}>
            <ThemedText style={styles.osModalTitle}>[ PERSONNEL PROFILE ]</ThemedText>
            <View style={styles.osDivider}></View>
            <Button title="CLOSE" onPress={() => setSelectedMember(null)} />
            <TeamMemberProfile 
              member={selectedMember} 
              onUpdate={handleUpdateMember} 
            />
            <View style={styles.osSection}>
              <ThemedText style={styles.osMenuTitle}>[ REQUEST ASSISTANCE ]</ThemedText>
              <View style={styles.osDivider}></View>
              <RequestHelp 
                member={selectedMember}
                currentUserId={currentUserId}
                onRequestHelp={handleRequestHelp}
                onBorrowItem={handleBorrowItem}
              />
            </View>
          </View>
        )}
      </Modal>

      {/* Modal for viewing borrowed items */}
      <Modal
        visible={showBorrowedItems}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowBorrowedItems(false)}
      >
        <View style={styles.osModalContainer}>
          <ThemedText style={styles.osModalTitle}>[ BORROWED ITEMS LOG ]</ThemedText>
          <View style={styles.osDivider}></View>
          <Button title="CLOSE" onPress={() => setShowBorrowedItems(false)} />
          <BorrowedItemsTracker userId={currentUserId} />
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
  searchSkillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,255,0,0.1)',
    padding: 8,
    borderRadius: 0,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  actionsContainer: {
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
});
