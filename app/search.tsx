import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { Search as SearchIcon, X, Play, Heart, Home, Library, User } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';

// Mock search results
const mockSearchResults = [
  { id: '1', type: 'song', title: 'Electric Dreams', artist: 'Neon Pulse', image: 'https://images.unsplash.com/photo-1487954335942-047e6d1551ee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q29uY2VydCUyMG11c2ljJTIwcGVyZm9ybWFuY2V8ZW58MHx8MHx8fDA%3D' },
  { id: '2', type: 'artist', title: 'Stellar Waves', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE5pZ2h0JTIwc2t5JTIwY29zbWljJTIwZ2FsYXh5fGVufDB8fDB8fHww' },
  { id: '3', type: 'playlist', title: 'Chill Vibes', image: 'https://images.unsplash.com/photo-1517340073101-289191978ae8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D' },
  { id: '4', type: 'song', title: 'Cosmic Journey', artist: 'Stellar Waves', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE5pZ2h0JTIwc2t5JTIwY29zbWljJTIwZ2FsYXh5fGVufDB8fDB8fHww' },
];

const trendingSearches = ['Electric Dreams', 'Neon Pulse', 'Chill Vibes', 'Workout Mix', 'Road Trip'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const pathname = usePathname();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setSearchResults(mockSearchResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(query.toLowerCase()))
      ));
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
            {searchResults.length > 0 ? (
              <>
                <Text className="text-white text-xl font-bold mb-4">Results</Text>
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-row items-center mb-4 bg-[#1A1A1A] rounded-xl p-3"
                  >
                    <Image
                      source={{ uri: item.image }}
                      className="w-14 h-14 rounded-lg"
                      resizeMode="cover"
                    />
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
