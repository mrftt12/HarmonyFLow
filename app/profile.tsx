import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { 
  Settings, 
  Heart, 
  Clock, 
  Music, 
  Video, 
  User, 
  Home, 
  Search, 
  Library,
  ChevronRight,
  Bell,
  Lock,
  CreditCard,
  HelpCircle,
  Info,
  LogOut
} from 'lucide-react-native';
import { router, usePathname } from 'expo-router';

export default function ProfileScreen() {
  const [isPremium, setIsPremium] = useState(true);
  const pathname = usePathname();
  
  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joinDate: "January 2022",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    stats: {
      totalListens: 1247,
      favoriteArtists: 23,
      playlists: 18,
      hoursListened: 342
    }
  };

  // Account settings options
  const settingsOptions = [
    { icon: Bell, title: "Notifications", iconColor: "#FF69B4" },
    { icon: Lock, title: "Privacy", iconColor: "#FF69B4" },
    { icon: CreditCard, title: "Subscription", iconColor: "#FF69B4" },
    { icon: HelpCircle, title: "Help & Support", iconColor: "#FF69B4" },
    { icon: Info, title: "About", iconColor: "#FF69B4" },
  ];

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-[#121212]">
        <Text className="text-3xl font-bold text-white">Profile</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 bg-[#121212]">
        {/* User Profile Section */}
        <View className="items-center py-8">
          <Image 
            source={{ uri: userData.avatar }} 
            className="w-32 h-32 rounded-full mb-4 border-4 border-[#FF69B4]"
          />
          <Text className="text-white text-2xl font-bold">{userData.name}</Text>
          <Text className="text-gray-400 mb-2">{userData.email}</Text>
          <Text className="text-gray-500 text-sm">Member since {userData.joinDate}</Text>
          
          {isPremium ? (
            <View className="mt-4 px-4 py-2 bg-[#FF69B4] rounded-full">
              <Text className="text-white font-bold">Premium Member</Text>
            </View>
          ) : (
            <TouchableOpacity className="mt-4 px-4 py-2 bg-[#8B0A1A] rounded-full">
              <Text className="text-white font-bold">Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Listening Statistics */}
        <View className="bg-[#1A1A1A] rounded-xl p-6 mb-6">
          <Text className="text-white text-xl font-bold mb-4">Listening Statistics</Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <View className="w-16 h-16 rounded-full bg-[#121212] items-center justify-center mb-2">
                <Music size={24} color="#FF69B4" />
              </View>
              <Text className="text-white font-bold">{userData.stats.totalListens}</Text>
              <Text className="text-gray-400 text-sm">Tracks</Text>
            </View>
            
            <View className="items-center">
              <View className="w-16 h-16 rounded-full bg-[#121212] items-center justify-center mb-2">
                <Clock size={24} color="#FF69B4" />
              </View>
              <Text className="text-white font-bold">{userData.stats.hoursListened}</Text>
              <Text className="text-gray-400 text-sm">Hours</Text>
            </View>
            
            <View className="items-center">
              <View className="w-16 h-16 rounded-full bg-[#121212] items-center justify-center mb-2">
                <Heart size={24} color="#FF69B4" />
              </View>
              <Text className="text-white font-bold">{userData.stats.favoriteArtists}</Text>
              <Text className="text-gray-400 text-sm">Artists</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity className="flex-1 bg-[#1A1A1A] rounded-xl py-4 items-center mx-1">
            <Clock size={24} color="#FF69B4" />
            <Text className="text-white mt-2">History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-1 bg-[#1A1A1A] rounded-xl py-4 items-center mx-1">
            <Heart size={24} color="#FF69B4" />
            <Text className="text-white mt-2">Favorites</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-1 bg-[#1A1A1A] rounded-xl py-4 items-center mx-1">
            <User size={24} color="#FF69B4" />
            <Text className="text-white mt-2">Account</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">Account Settings</Text>
          
          <View className="bg-[#1A1A1A] rounded-xl overflow-hidden">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                className={`flex-row items-center p-4 ${index < settingsOptions.length - 1 ? 'border-b border-[#2A2A2A]' : ''}`}
              >
                <option.icon size={24} color={option.iconColor} />
                <Text className="text-white flex-1 ml-4">{option.title}</Text>
                <ChevronRight size={20} color="#AAAAAA" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity className="flex-row items-center justify-center py-4 bg-[#8B0A1A] rounded-xl mb-8">
          <LogOut size={20} color="#FFFFFF" />
          <Text className="text-white font-bold ml-2">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-3 bg-[#121212] border-t border-gray-800">
        <TouchableOpacity className="items-center" onPress={() => router.push('/')}>
          <Home size={24} color={pathname === '/' ? "#FF69B4" : "#AAAAAA"} />
          <Text className={`${pathname === '/' ? 'text-[#FF69B4]' : 'text-gray-400'} text-xs mt-1`}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/search')}>
          <Search size={24} color={pathname === '/search' ? "#FF69B4" : "#AAAAAA"} />
          <Text className={`${pathname === '/search' ? 'text-[#FF69B4]' : 'text-gray-400'} text-xs mt-1`}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/library')}>
          <Library size={24} color={pathname === '/library' ? "#FF69B4" : "#AAAAAA"} />
          <Text className={`${pathname === '/library' ? 'text-[#FF69B4]' : 'text-gray-400'} text-xs mt-1`}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/profile')}>
          <User size={24} color={pathname === '/profile' ? "#FF69B4" : "#AAAAAA"} />
          <Text className={`${pathname === '/profile' ? 'text-[#FF69B4]' : 'text-gray-400'} text-xs mt-1`}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}