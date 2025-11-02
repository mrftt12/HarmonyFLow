import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Plus, Play, Heart, Download, Clock, MoreHorizontal, Search, Home, Library, User } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';

// Mock data for user's playlists
const mockPlaylists = [
  {
    id: '1',
    title: 'Chill Vibes',
    trackCount: 24,
    image: 'https://images.unsplash.com/photo-1517340073101-289191978ae8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '2',
    title: 'Workout Mix',
    trackCount: 18,
    image: 'https://images.unsplash.com/photo-1629216509258-4dbd7880e605?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '3',
    title: 'Road Trip',
    trackCount: 32,
    image: 'https://images.unsplash.com/photo-1487954335942-047e6d1551ee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q29uY2VydCUyMG11c2ljJTIwcGVyZm9ybWFuY2V8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '4',
    title: 'Focus Flow',
    trackCount: 15,
    image: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3IlMjBzcGxhc2h8ZW58MHx8MHx8fDA%3D',
  },
];

// Mock data for liked songs
const mockLikedSongs = [
  {
    id: 'l1',
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    album: 'Nocturnal',
    duration: '3:42',
    cover: 'https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fE1vdmllJTIwY29tZWR5JTIwcGVyZm9ybWFuY2V8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 'l2',
    title: 'Electric Pulse',
    artist: 'Neon Wave',
    album: 'Synthwave Collection',
    duration: '4:15',
    cover: 'https://images.unsplash.com/photo-1727189899461-b888a5890287?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MyUyMGdyYXBoaWNzfGVufDB8fDB8fHww',
  },
  {
    id: 'l3',
    title: 'Urban Echo',
    artist: 'City Beats',
    album: 'Street Sounds',
    duration: '3:28',
    cover: 'https://images.unsplash.com/photo-1612855013098-86f0abc2ebaf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U3RyZWV0JTIwYnVza2luZyUyMGBlcmZvcm1hbmNlfGVufDB8fDB8fHww',
  },
];

// Mock data for downloaded content
const mockDownloadedContent = [
  {
    id: 'd1',
    title: 'Summer Hits 2023',
    artist: 'Various Artists',
    type: 'playlist',
    image: 'https://images.unsplash.com/photo-1675351085230-ab39b2289ff4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'd2',
    title: 'Offline Mix',
    artist: 'My Collection',
    type: 'playlist',
    image: 'https://images.unsplash.com/photo-1577807468197-ae3b14e7f0b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RmlyZXdvcmtzJTIwZmVzdGl2YWwlMjBjZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
  },
];

// Mock data for recently played
const mockRecentlyPlayed = [
  {
    id: 'r1',
    title: 'Discover Weekly',
    type: 'playlist',
    image: 'https://images.unsplash.com/photo-1718947109846-f19c3fe3062e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fE11c2ljJTIwYmFuZCUyMHBlcmZvcm1hbmNlfGVufDB8fDB8fHww',
  },
  {
    id: 'r2',
    title: 'Daily Mix 3',
    type: 'playlist',
    image: 'https://images.unsplash.com/photo-1574602336947-71b45b025065?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VHJhbSUyMHN0cmVldGNhciUyMGxpZ2h0JTIwcmFpbHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'r3',
    title: 'Release Radar',
    type: 'playlist',
    image: 'https://images.unsplash.com/photo-1608447718455-ed5006c46051?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8MyUyMGdyYXBoaWNzfGVufDB8fDB8fHww',
  },
];

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState('playlists');
  const pathname = usePathname();

  const renderPlaylistItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="mr-4 w-40">
      <View className="bg-[#1A1A1A] rounded-xl overflow-hidden">
        <Image
          source={{ uri: item.image }}
          className="w-40 h-40 rounded-xl"
          resizeMode="cover"
        />
        <View className="p-3">
          <Text className="text-white font-bold text-sm" numberOfLines={1}>{item.title}</Text>
          <Text className="text-gray-400 text-xs mt-1">{item.trackCount} songs</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLikedSong = ({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row items-center bg-[#1A1A1A] rounded-xl p-3 mb-3">
      <Image 
        source={{ uri: item.cover }} 
        className="w-12 h-12 rounded-lg" 
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text className="text-white font-semibold">{item.title}</Text>
        <Text className="text-gray-400 text-sm">{item.artist}</Text>
      </View>
      <Text className="text-gray-400 text-sm mr-3">{item.duration}</Text>
      <TouchableOpacity>
        <Heart size={20} color="#FF69B4" fill="#FF69B4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRecentlyPlayedItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="mr-4 w-32">
      <View className="bg-[#1A1A1A] rounded-xl overflow-hidden">
        <Image
          source={{ uri: item.image }}
          className="w-32 h-32 rounded-xl"
          resizeMode="cover"
        />
        <View className="p-3">
          <Text className="text-white font-bold text-sm" numberOfLines={1}>{item.title}</Text>
          <Text className="text-gray-400 text-xs mt-1 capitalize">{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDownloadedItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row items-center bg-[#1A1A1A] rounded-xl p-3 mb-3">
      <Image 
        source={{ uri: item.image }} 
        className="w-12 h-12 rounded-lg" 
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text className="text-white font-semibold">{item.title}</Text>
        <Text className="text-gray-400 text-sm">{item.artist}</Text>
      </View>
      <TouchableOpacity className="ml-2">
        <Download size={20} color="#FF69B4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-[#121212]">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-white">Your Library</Text>
          <TouchableOpacity>
            <Search size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View className="flex-row border-b border-gray-800">
          <TouchableOpacity 
            className={`pb-3 px-4 ${activeTab === 'playlists' ? 'border-b-2 border-[#FF69B4]' : ''}`}
            onPress={() => setActiveTab('playlists')}
          >
            <Text className={`font-bold ${activeTab === 'playlists' ? 'text-white' : 'text-gray-400'}`}>Playlists</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`pb-3 px-4 ${activeTab === 'songs' ? 'border-b-2 border-[#FF69B4]' : ''}`}
            onPress={() => setActiveTab('songs')}
          >
            <Text className={`font-bold ${activeTab === 'songs' ? 'text-white' : 'text-gray-400'}`}>Songs</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`pb-3 px-4 ${activeTab === 'albums' ? 'border-b-2 border-[#FF69B4]' : ''}`}
            onPress={() => setActiveTab('albums')}
          >
            <Text className={`font-bold ${activeTab === 'albums' ? 'text-white' : 'text-gray-400'}`}>Albums</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`pb-3 px-4 ${activeTab === 'artists' ? 'border-b-2 border-[#FF69B4]' : ''}`}
            onPress={() => setActiveTab('artists')}
          >
            <Text className={`font-bold ${activeTab === 'artists' ? 'text-white' : 'text-gray-400'}`}>Artists</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 bg-[#121212]">
        {/* Create Playlist Button */}
        <TouchableOpacity className="flex-row items-center bg-[#1A1A1A] rounded-xl p-4 mb-6">
          <View className="w-12 h-12 rounded-full bg-[#FF69B4] items-center justify-center">
            <Plus size={24} color="#FFFFFF" />
          </View>
          <Text className="text-white font-bold text-lg ml-4">Create Playlist</Text>
        </TouchableOpacity>

        {/* Your Playlists Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Your Playlists</Text>
            <TouchableOpacity>
              <Text className="text-[#FF69B4] font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={mockPlaylists}
            keyExtractor={(item) => item.id}
            renderItem={renderPlaylistItem}
            showsHorizontalScrollIndicator={false}
            className="max-h-60"
          />
        </View>

        {/* Liked Songs */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#FF69B4] items-center justify-center mr-2">
                <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <Text className="text-white text-xl font-bold">Liked Songs</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-[#FF69B4] font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          
          <View>
            <TouchableOpacity className="flex-row items-center bg-[#1A1A1A] rounded-xl p-4 mb-3">
              <View className="w-12 h-12 rounded-full bg-[#FF69B4] items-center justify-center">
                <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <Text className="text-white font-bold ml-4">PLAY ALL</Text>
            </TouchableOpacity>
            
            <FlatList
              data={mockLikedSongs}
              keyExtractor={(item) => item.id}
              renderItem={renderLikedSong}
              scrollEnabled={false}
              className="max-h-80"
            />
          </View>
        </View>

        {/* Downloaded Content */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#FF69B4] items-center justify-center mr-2">
                <Download size={16} color="#FFFFFF" />
              </View>
              <Text className="text-white text-xl font-bold">Downloaded</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-[#FF69B4] font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockDownloadedContent}
            keyExtractor={(item) => item.id}
            renderItem={renderDownloadedItem}
            scrollEnabled={false}
            className="max-h-60"
          />
        </View>

        {/* Recently Played */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#FF69B4] items-center justify-center mr-2">
                <Clock size={16} color="#FFFFFF" />
              </View>
              <Text className="text-white text-xl font-bold">Recently Played</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-[#FF69B4] font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={mockRecentlyPlayed}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentlyPlayedItem}
            showsHorizontalScrollIndicator={false}
            className="max-h-60"
          />
        </View>
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