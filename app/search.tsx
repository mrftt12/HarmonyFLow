import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import { Search as SearchIcon, X, Play, Heart, Home, Library, User } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import { searchMediaFiles, getAllMediaFiles, MediaFile } from '../services/blobService';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaFile[]>([]);
  const [allMedia, setAllMedia] = useState<MediaFile[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    loadAllMedia();
  }, []);

  const loadAllMedia = async () => {
    try {
      const { audio, video } = await getAllMediaFiles();
      const all = [...audio, ...video];
      setAllMedia(all);
      
      // Extract trending searches from media titles
      const uniqueArtists = [...new Set(all.map(m => m.artist).filter(Boolean))];
      const uniqueTitles = [...new Set(all.slice(0, 10).map(m => m.title))];
      setTrendingSearches([...uniqueTitles.slice(0, 5), ...uniqueArtists.slice(0, 5)].slice(0, 5));
    } catch (error) {
      console.error('Error loading media:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setLoading(true);
      try {
        const results = await searchMediaFiles(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-[#121212]">
        <Text className="text-3xl font-bold text-white mb-6">Search</Text>
        
        {/* Search Input */}
        <View className="flex-row items-center bg-[#1A1A1A] rounded-xl px-4 py-3">
          <SearchIcon size={20} color="#AAAAAA" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="What do you want to listen to?"
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#AAAAAA" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 bg-[#121212]">
        {searchQuery.length === 0 ? (
          <>
            {/* Trending Searches */}
            <View className="mb-8 mt-6">
              <Text className="text-white text-xl font-bold mb-4">Trending</Text>
              <View className="flex-row flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSearch(search)}
                    className="bg-[#1A1A1A] px-4 py-2 rounded-full"
                  >
                    <Text className="text-white font-medium">{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Browse Categories */}
            <View className="mb-8">
              <Text className="text-white text-xl font-bold mb-4">Browse</Text>
              <View className="flex-row flex-wrap gap-4">
                {['Music', 'Podcasts', 'Audiobooks', 'Genres', 'Moods'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    className="bg-[#1A1A1A] rounded-xl p-4 flex-1 min-w-[45%]"
                  >
                    <Text className="text-white font-semibold text-lg">{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View className="mt-6">
            {loading ? (
              <View className="items-center justify-center py-12">
                <ActivityIndicator size="large" color="#FF69B4" />
                <Text className="text-gray-400 mt-4">Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <>
                <Text className="text-white text-xl font-bold mb-4">Results</Text>
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-row items-center mb-4 bg-[#1A1A1A] rounded-xl p-3"
                    onPress={() => {
                      if (item.type === 'video') {
                        router.push(`/video-player?id=${item.id}`);
                      } else {
                        router.push(`/player?id=${item.id}`);
                      }
                    }}
                  >
                    {item.thumbnail ? (
                      <Image
                        source={{ uri: item.thumbnail }}
                        className="w-14 h-14 rounded-lg"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-14 h-14 rounded-lg bg-gray-700 items-center justify-center">
                        <Text className="text-white text-xs">{item.type === 'video' ? '🎬' : '🎵'}</Text>
                      </View>
                    )}
                    <View className="flex-1 ml-3">
                      <Text className="text-white font-semibold">{item.title}</Text>
                      {item.artist && (
                        <Text className="text-gray-400 text-sm">{item.artist}</Text>
                      )}
                      <Text className="text-gray-500 text-xs capitalize">{item.type}</Text>
                    </View>
                    <TouchableOpacity>
                      <Play size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View className="items-center justify-center py-12">
                <Text className="text-gray-400 text-lg">No results found</Text>
                <Text className="text-gray-500 text-sm mt-2">Try searching for something else</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-3 bg-[#121212] border-t border-gray-800">
        <TouchableOpacity className="items-center" onPress={() => router.push('/')}>
          <Home size={24} color={pathname === '/' ? "#FF69B4" : "#AAAAAA"} />
          <Text className={`${pathname === '/' ? 'text-[#FF69B4]' : 'text-gray-400'} text-xs mt-1`}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/search')}>
          <SearchIcon size={24} color={pathname === '/search' ? "#FF69B4" : "#AAAAAA"} />
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
