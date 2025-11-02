import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Heart, MoreHorizontal, Search, Library, Home, User } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock data for music and videos
const mockMusicData = [
  {
    id: '1',
    title: 'Electric Dreams',
    artist: 'Neon Pulse',
    album: 'Midnight Vibes',
    duration: '3:45',
    cover: 'https://images.unsplash.com/photo-1487954335942-047e6d1551ee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q29uY2VydCUyMG11c2ljJTIwcGVyZm9ybWFuY2V8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '2',
    title: 'Cosmic Journey',
    artist: 'Stellar Waves',
    album: 'Galaxy Sounds',
    duration: '4:22',
    cover: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE5pZ2h0JTIwc2t5JTIwY29zbWljJTIwZ2FsYXh5fGVufDB8fDB8fHww',
  },
  {
    id: '3',
    title: 'Urban Rhythm',
    artist: 'City Beats',
    album: 'Street Sounds',
    duration: '3:15',
    cover: 'https://images.unsplash.com/photo-1543033906-8f2a9f541af9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZXNwb3J0cyUyMHZpcnR1YWwlMjByYWNpbmclMjBldmVudHxlbnwwfHwwfHx8MA%3D%3D',
  },
];

const mockVideoData = [
  {
    id: 'v1',
    title: 'Live Concert: Neon Pulse',
    channel: 'Music Universe',
    views: '2.4M views',
    duration: '1:45:22',
    thumbnail: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3IlMjBzcGxhc2h8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 'v2',
    title: 'Gaming Esports Championship',
    channel: 'Game Central',
    views: '1.8M views',
    duration: '2:15:47',
    thumbnail: 'https://images.unsplash.com/photo-1558008258-7ff8888b42b0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8R2FtaW5nJTIwZXNwb3J0cyUyMGNvbXBldGl0aW9ufGVufDB8fDB8fHww',
  },
  {
    id: 'v3',
    title: 'Drama Theater Performance',
    channel: 'Broadway Shows',
    views: '850K views',
    duration: '1:52:33',
    thumbnail: 'https://images.unsplash.com/photo-1611673982064-7385a5d9574e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHJhbWF8ZW58MHx8MHx8fDA%3D',
  },
];

const recentlyPlayed = [
  {
    id: 'r1',
    title: 'Chill Vibes Playlist',
    type: 'playlist',
    image: 'https://images.unsplash.com/photo-1517340073101-289191978ae8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'r2',
    title: 'Workout Mix',
    type: 'playlist',
    image: 'https://images.unsplash.com/photo-1629216509258-4dbd7880e605?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'r3',
    title: 'Discover Weekly',
    type: 'playlist',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
  },
];

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(mockMusicData[0]);
  const pathname = usePathname();

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-[#121212]">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-white">HarmonyStream</Text>
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4" onPress={() => router.push('/search')}>
              <Search size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <User size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Greeting */}
        <Text className="text-white text-2xl font-bold mb-2">Good evening</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 bg-[#121212]">
        {/* Recently Played */}
        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">Recently played</Text>
          <View className="flex-row flex-wrap gap-4">
            {recentlyPlayed.map((item) => (
              <TouchableOpacity key={item.id} className="flex-1 min-w-[40%]">
                <View className="bg-[#1A1A1A] rounded-lg overflow-hidden">
                  <Image 
                    source={{ uri: item.image }} 
                    className="w-full h-32" 
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <Text className="text-white font-semibold">{item.title}</Text>
                    <Text className="text-gray-400 text-sm capitalize">{item.type}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Music Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Popular Music</Text>
            <TouchableOpacity>
              <Text className="text-[#FF69B4] font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          
          <View className="gap-4">
            {mockMusicData.map((track) => (
              <TouchableOpacity 
                key={track.id} 
                className="flex-row items-center bg-[#1A1A1A] rounded-xl p-3"
                onPress={() => setCurrentTrack(track)}
              >
                <Image 
                  source={{ uri: track.cover }} 
                  className="w-14 h-14 rounded-lg" 
                  resizeMode="cover"
                />
                <View className="flex-1 ml-3">
                  <Text className="text-white font-semibold">{track.title}</Text>
                  <Text className="text-gray-400">{track.artist}</Text>
                </View>
                <Text className="text-gray-400 mr-3">{track.duration}</Text>
                <TouchableOpacity>
                  <Heart size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Video Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Trending Videos</Text>
            <TouchableOpacity>
              <Text className="text-[#FF69B4] font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          
          <View className="gap-4">
            {mockVideoData.map((video) => (
              <TouchableOpacity key={video.id} className="flex-row">
                <Image 
                  source={{ uri: video.thumbnail }} 
                  className="w-2/5 h-24 rounded-lg" 
                  resizeMode="cover"
                />
                <View className="flex-1 ml-3 justify-center">
                  <Text className="text-white font-semibold mb-1">{video.title}</Text>
                  <Text className="text-gray-400 text-sm">{video.channel}</Text>
                  <Text className="text-gray-400 text-sm">{video.views}</Text>
                </View>
                <TouchableOpacity className="justify-center">
                  <MoreHorizontal size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Player Bar */}
      <View className="bg-[#1A1A1A] p-4 border-t border-gray-800">
        <View className="flex-row items-center">
          <Image 
            source={{ uri: currentTrack.cover }} 
            className="w-12 h-12 rounded-lg" 
            resizeMode="cover"
          />
          <View className="flex-1 ml-3">
            <Text className="text-white font-semibold">{currentTrack.title}</Text>
            <Text className="text-gray-400 text-sm">{currentTrack.artist}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity className="mx-2">
              <Heart size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlay} className="mx-2">
              {isPlaying ? (
                <Pause size={24} color="#FF69B4" />
              ) : (
                <Play size={24} color="#FF69B4" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View className="mt-3 flex-row items-center">
          <Text className="text-gray-400 text-xs">1:23</Text>
          <View className="flex-1 h-1 bg-gray-700 rounded-full mx-2">
            <View className="h-1 bg-[#FF69B4] rounded-full w-1/3"></View>
          </View>
          <Text className="text-gray-400 text-xs">{currentTrack.duration}</Text>
        </View>
      </View>

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