import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, FlatList } from 'react-native';
import { TeamMember } from '../models/TeamMember';

interface Props {
  member: TeamMember;
  onUpdate: (member: TeamMember) => void;
}

export const TeamMemberProfile: React.FC<Props> = ({ member, onUpdate }) => {
  const [skills, setSkills] = useState(member.skills.join(', '));
  const [tools, setTools] = useState(member.tools.join(', '));
  const [willingToHelp, setWillingToHelp] = useState(member.willingToHelp);

  const handleSave = () => {
    onUpdate({
      ...member,
      skills: skills.split(',').map(s => s.trim()),
      tools: tools.split(',').map(t => t.trim()),
      willingToHelp,
    });
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{member.name}</Text>
      <Text>Skills:</Text>
      <TextInput value={skills} onChangeText={setSkills} placeholder="e.g. React, Python" />
      <Text>Tools/Resources:</Text>
      <TextInput value={tools} onChangeText={setTools} placeholder="e.g. Laptop, Camera" />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
        <Text>Willing to Help:</Text>
        <Switch value={willingToHelp} onValueChange={setWillingToHelp} />
      </View>
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};
