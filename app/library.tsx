import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { Plus, Play, Heart, Download, Clock, MoreHorizontal, Search, Home, Library, User } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import { getAudioFiles, MediaFile } from '../services/blobService';

interface PlaylistItem {
  id: string;
  title: string;
  trackCount: number;
  image?: string;
}

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState('playlists');
  const [audioFiles, setAudioFiles] = useState<MediaFile[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    try {
      setLoading(true);
      const files = await getAudioFiles();
      setAudioFiles(files);

      // Group by album to create playlists
      const albumMap = new Map<string, MediaFile[]>();
      files.forEach(file => {
        const album = file.album || 'Unknown Album';
        if (!albumMap.has(album)) {
          albumMap.set(album, []);
        }
        albumMap.get(album)!.push(file);
      });

      const playlistItems: PlaylistItem[] = Array.from(albumMap.entries()).map(([album, tracks]) => ({
        id: `playlist-${album}`,
        title: album,
        trackCount: tracks.length,
        image: tracks[0]?.thumbnail,
      }));

      setPlaylists(playlistItems);
    } catch (error) {
      console.error('Error loading audio files:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const renderLikedSong = ({ item }: { item: MediaFile }) => (
    <TouchableOpacity 
      className="flex-row items-center bg-[#1A1A1A] rounded-xl p-3 mb-3"
      onPress={() => router.push(`/player?id=${item.id}`)}
    >
      {item.thumbnail ? (
        <Image 
          source={{ uri: item.thumbnail }} 
          className="w-12 h-12 rounded-lg" 
          resizeMode="cover"
        />
      ) : (
        <View className="w-12 h-12 rounded-lg bg-gray-700 items-center justify-center">
          <Text className="text-white text-xs">🎵</Text>
        </View>
      )}
      <View className="flex-1 ml-3">
        <Text className="text-white font-semibold">{item.title}</Text>
        <Text className="text-gray-400 text-sm">{item.artist || 'Unknown Artist'}</Text>
      </View>
      {item.duration && (
        <Text className="text-gray-400 text-sm mr-3">{item.duration}</Text>
      )}
      <TouchableOpacity>
        <Heart size={20} color="#FF69B4" fill="#FF69B4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRecentlyPlayedItem = ({ item }: { item: MediaFile }) => (
    <TouchableOpacity 
      className="mr-4 w-32"
      onPress={() => router.push(`/player?id=${item.id}`)}
    >
      <View className="bg-[#1A1A1A] rounded-xl overflow-hidden">
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            className="w-32 h-32 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-32 h-32 rounded-xl bg-gray-700 items-center justify-center">
            <Text className="text-white text-xs">🎵</Text>
          </View>
        )}
        <View className="p-3">
          <Text className="text-white font-bold text-sm" numberOfLines={1}>{item.title}</Text>
          <Text className="text-gray-400 text-xs mt-1">song</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDownloadedItem = ({ item }: { item: MediaFile }) => (
    <TouchableOpacity 
      className="flex-row items-center bg-[#1A1A1A] rounded-xl p-3 mb-3"
      onPress={() => router.push(`/player?id=${item.id}`)}
    >
      {item.thumbnail ? (
        <Image 
          source={{ uri: item.thumbnail }} 
          className="w-12 h-12 rounded-lg" 
          resizeMode="cover"
        />
      ) : (
        <View className="w-12 h-12 rounded-lg bg-gray-700 items-center justify-center">
          <Text className="text-white text-xs">🎵</Text>
        </View>
      )}
      <View className="flex-1 ml-3">
        <Text className="text-white font-semibold">{item.title}</Text>
        <Text className="text-gray-400 text-sm">{item.artist || 'Unknown Artist'}</Text>
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
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#FF69B4" />
            <Text className="text-white mt-4">Loading library...</Text>
          </View>
        ) : (
          <>
            {/* Create Playlist Button */}
            <TouchableOpacity className="flex-row items-center bg-[#1A1A1A] rounded-xl p-4 mb-6">
              <View className="w-12 h-12 rounded-full bg-[#FF69B4] items-center justify-center">
                <Plus size={24} color="#FFFFFF" />
              </View>
              <Text className="text-white font-bold text-lg ml-4">Create Playlist</Text>
            </TouchableOpacity>

            {/* Your Playlists Section */}
            {playlists.length > 0 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-xl font-bold">Your Albums</Text>
                  <TouchableOpacity>
                    <Text className="text-[#FF69B4] font-medium">See all</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  horizontal
                  data={playlists}
                  keyExtractor={(item) => item.id}
                  renderItem={renderPlaylistItem}
                  showsHorizontalScrollIndicator={false}
                  className="max-h-60"
                />
              </View>
            )}

            {/* Liked Songs */}
            {audioFiles.length > 0 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-[#FF69B4] items-center justify-center mr-2">
                      <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                    <Text className="text-white text-xl font-bold">All Songs</Text>
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
                    data={audioFiles.slice(0, 10)}
                    keyExtractor={(item) => item.id}
                    renderItem={renderLikedSong}
                    scrollEnabled={false}
                    className="max-h-80"
                  />
                </View>
              </View>
            )}

            {/* Downloaded Content */}
            {audioFiles.length > 0 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-[#FF69B4] items-center justify-center mr-2">
                      <Download size={16} color="#FFFFFF" />
                    </View>
                    <Text className="text-white text-xl font-bold">Available Offline</Text>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-[#FF69B4] font-medium">See all</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={audioFiles.slice(0, 5)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderDownloadedItem}
                  scrollEnabled={false}
                  className="max-h-60"
                />
              </View>
            )}

            {/* Recently Played */}
            {audioFiles.length > 0 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-[#FF69B4] items-center justify-center mr-2">
                      <Clock size={16} color="#FFFFFF" />
                    </View>
                    <Text className="text-white text-xl font-bold">Recently Added</Text>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-[#FF69B4] font-medium">See all</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  horizontal
                  data={audioFiles.slice(0, 10)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderRecentlyPlayedItem}
                  showsHorizontalScrollIndicator={false}
                  className="max-h-60"
                />
              </View>
            )}
          </>
        )}
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