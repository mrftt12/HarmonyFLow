import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Heart, MoreHorizontal, Search, Library, Home, User } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import { getAudioFiles, getVideoFiles, MediaFile } from '../services/blobService';

const { width } = Dimensions.get('window');

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  url: string;
  cover?: string;
}

interface VideoItem {
  id: string;
  title: string;
  channel?: string;
  views?: string;
  duration?: string;
  thumbnail?: string;
  url: string;
}

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicData, setMusicData] = useState<MusicTrack[]>([]);
  const [videoData, setVideoData] = useState<VideoItem[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      const [audioFiles, videoFiles] = await Promise.all([
        getAudioFiles(),
        getVideoFiles(),
      ]);

      // Convert audio files to music tracks
      const tracks: MusicTrack[] = audioFiles.map(file => ({
        id: file.id,
        title: file.title,
        artist: file.artist || 'Unknown Artist',
        album: file.album,
        url: file.url,
        cover: file.thumbnail,
        duration: file.duration,
      }));

      // Convert video files to video items
      const videos: VideoItem[] = videoFiles.map(file => ({
        id: file.id,
        title: file.title,
        channel: file.artist,
        thumbnail: file.thumbnail,
        url: file.url,
        duration: file.duration,
      }));

      setMusicData(tracks);
      setVideoData(videos);
      if (tracks.length > 0) {
        setCurrentTrack(tracks[0]);
      }
    } catch (error) {
      console.error('Error loading media files:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#FF69B4" />
            <Text className="text-white mt-4">Loading media...</Text>
          </View>
        ) : (
          <>
            {/* Music Section */}
            {musicData.length > 0 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-xl font-bold">Popular Music</Text>
                  <TouchableOpacity>
                    <Text className="text-[#FF69B4] font-medium">See all</Text>
                  </TouchableOpacity>
                </View>
                
                <View className="gap-4">
                  {musicData.map((track) => (
                    <TouchableOpacity 
                      key={track.id} 
                      className="flex-row items-center bg-[#1A1A1A] rounded-xl p-3"
                      onPress={() => setCurrentTrack(track)}
                    >
                      {track.cover ? (
                        <Image 
                          source={{ uri: track.cover }} 
                          className="w-14 h-14 rounded-lg" 
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-14 h-14 rounded-lg bg-gray-700 items-center justify-center">
                          <Text className="text-white text-xs">🎵</Text>
                        </View>
                      )}
                      <View className="flex-1 ml-3">
                        <Text className="text-white font-semibold">{track.title}</Text>
                        <Text className="text-gray-400">{track.artist}</Text>
                      </View>
                      {track.duration && (
                        <Text className="text-gray-400 mr-3">{track.duration}</Text>
                      )}
                      <TouchableOpacity>
                        <Heart size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

            {/* Video Section */}
            {videoData.length > 0 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-xl font-bold">Trending Videos</Text>
                  <TouchableOpacity>
                    <Text className="text-[#FF69B4] font-medium">See all</Text>
                  </TouchableOpacity>
                </View>
                
                <View className="gap-4">
                  {videoData.map((video) => (
                    <TouchableOpacity 
                      key={video.id} 
                      className="flex-row"
                      onPress={() => router.push(`/video-player?id=${video.id}`)}
                    >
                      {video.thumbnail ? (
                        <Image 
                          source={{ uri: video.thumbnail }} 
                          className="w-2/5 h-24 rounded-lg" 
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-2/5 h-24 rounded-lg bg-gray-700 items-center justify-center">
                          <Text className="text-white text-xs">🎬</Text>
                        </View>
                      )}
                      <View className="flex-1 ml-3 justify-center">
                        <Text className="text-white font-semibold mb-1">{video.title}</Text>
                        {video.channel && (
                          <Text className="text-gray-400 text-sm">{video.channel}</Text>
                        )}
                        {video.duration && (
                          <Text className="text-gray-400 text-sm">{video.duration}</Text>
                        )}
                      </View>
                      <TouchableOpacity className="justify-center">
                        <MoreHorizontal size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
      </ScrollView>

      {/* Player Bar */}
      {currentTrack && (
        <View className="bg-[#1A1A1A] p-4 border-t border-gray-800">
          <View className="flex-row items-center">
            {currentTrack.cover ? (
              <Image 
                source={{ uri: currentTrack.cover }} 
                className="w-12 h-12 rounded-lg" 
                resizeMode="cover"
              />
            ) : (
              <View className="w-12 h-12 rounded-lg bg-gray-700 items-center justify-center">
                <Text className="text-white text-xs">🎵</Text>
              </View>
            )}
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
            <Text className="text-gray-400 text-xs">0:00</Text>
            <View className="flex-1 h-1 bg-gray-700 rounded-full mx-2">
              <View className="h-1 bg-[#FF69B4] rounded-full w-1/3"></View>
            </View>
            <Text className="text-gray-400 text-xs">{currentTrack.duration || '0:00'}</Text>
          </View>
        </View>
      )}

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