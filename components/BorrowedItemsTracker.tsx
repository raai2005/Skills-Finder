import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { TeamMember } from '../models/TeamMember';
import TeamMemberService from '../services/TeamMemberService';

interface Props {
  userId: string;
}

export const BorrowedItemsTracker: React.FC<Props> = ({ userId }) => {
  const service = TeamMemberService.getInstance();
  const currentUser = service.getMemberById(userId);

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  const handleReturnItem = (lenderId: string, itemName: string) => {
    service.returnItem(userId, lenderId, itemName);
    // Force re-render (in a real app, you would use state management)
    // This is just for demo purposes
    forceUpdate();
  };

  // Force re-render trick
  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  // Filter only non-returned items
  const activeItems = currentUser.borrowedItems.filter(item => !item.returnedAt);
  const returnedItems = currentUser.borrowedItems.filter(item => item.returnedAt);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currently Borrowed Items</Text>
        {activeItems.length === 0 ? (
          <Text style={styles.emptyText}>No items currently borrowed</Text>
        ) : (
          <FlatList
            data={activeItems}
            keyExtractor={(item, index) => `${item.item}-${index}`}
            renderItem={({ item }) => {
              const lender = service.getMemberById(item.borrowedFrom);
              return (
                <View style={styles.itemCard}>
                  <View>
                    <Text style={styles.itemName}>{item.item}</Text>
                    <Text>From: {lender?.name || 'Unknown'}</Text>
                    <Text>
                      Borrowed: {new Date(item.borrowedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.returnButton}
                    onPress={() => handleReturnItem(item.borrowedFrom, item.item)}
                  >
                    <Text style={styles.returnButtonText}>Return</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Returned Items History</Text>
        {returnedItems.length === 0 ? (
          <Text style={styles.emptyText}>No return history</Text>
        ) : (
          <FlatList
            data={returnedItems}
            keyExtractor={(item, index) => `${item.item}-${index}`}
            renderItem={({ item }) => {
              const lender = service.getMemberById(item.borrowedFrom);
              return (
                <View style={styles.historyCard}>
                  <Text style={styles.historyItemName}>{item.item}</Text>
                  <Text>From: {lender?.name || 'Unknown'}</Text>
                  <Text>
                    Borrowed: {new Date(item.borrowedAt).toLocaleDateString()}
                  </Text>
                  <Text>
                    Returned:{' '}
                    {item.returnedAt
                      ? new Date(item.returnedAt).toLocaleDateString()
                      : 'Not yet'}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginVertical: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  returnButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  returnButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
