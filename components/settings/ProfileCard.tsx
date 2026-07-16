import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { UserProfile } from '../../types/settings.types';
import { auth } from '../../config/firebase';

interface ProfileCardProps {
  profile: UserProfile;
  onPress?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onPress }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return unsubscribe;
  }, []);

  const userName = firebaseUser?.displayName || 'Anonymous User';
  const userEmail = firebaseUser?.email || 'No email';
  const avatarUrl = firebaseUser?.photoURL || null;
  const initial = userName.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="mx-4 mt-4 mb-2 bg-app-card border border-app-border rounded-2xl px-4 py-4 flex-row items-center"
    >
      {/* Avatar */}
      <View className="w-[60px] h-[60px] rounded-full overflow-hidden mr-4 border-2 border-app-accentSoft bg-app-card2 items-center justify-center">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-[60px] h-[60px]"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 w-full bg-app-accent/20 items-center justify-center">
            <Text className="text-app-accentSoft font-bold text-xl">
              {initial}
            </Text>
          </View>
        )}
      </View>

      {/* Name + Email */}
      <View className="flex-1">
        <Text className="text-app-light font-semibold text-[16px]" numberOfLines={1}>
          {userName}
        </Text>
        <Text className="text-app-muted text-sm mt-0.5" numberOfLines={1}>
          {userEmail}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;