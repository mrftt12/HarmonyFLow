import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Share2, Download, Heart, MessageCircle, MoreVertical } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getVideoFiles, MediaFile } from '../services/blobService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock comments data
const comments = [
  { id: '1', user: 'MusicFan123', comment: 'This was absolutely amazing! The energy was incredible.', likes: 245, time: '2 hours ago' },
  { id: '2', user: 'ConcertGoer', comment: 'Wish I could have been there in person. Thanks for sharing!', likes: 189, time: '5 hours ago' },
  { id: '3', user: 'ArtistSupporter', comment: 'The sound quality is fantastic. Great filming!', likes: 97, time: '1 day ago' },
];

export default function VideoPlayerScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [video, setVideo] = useState<MediaFile | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const videoFiles = await getVideoFiles();
      
      if (id) {
        const foundVideo = videoFiles.find(file => file.id === id);
        if (foundVideo) {
          setVideo(foundVideo);
          // Set related videos as other videos except current
          setRelatedVideos(videoFiles.filter(v => v.id !== id).slice(0, 5));
        } else if (videoFiles.length > 0) {
          setVideo(videoFiles[0]);
          setRelatedVideos(videoFiles.slice(1, 6));
        }
      } else if (videoFiles.length > 0) {
        setVideo(videoFiles[0]);
        setRelatedVideos(videoFiles.slice(1, 6));
      }
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  if (loading || !video) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="text-white mt-4">Loading video...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      {/* Video Player Section */}
      <View className="relative">
        {video.thumbnail ? (
          <Image 
            source={{ uri: video.thumbnail }} 
            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.56 }} 
            className="rounded-b-3xl"
          />
        ) : (
          <View 
            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.56 }} 
            className="rounded-b-3xl bg-gray-700 items-center justify-center"
          >
            <Text className="text-white text-4xl">🎬</Text>
          </View>
        )}
        
        {/* Video Controls Overlay */}
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-between items-center px-6">
          <TouchableOpacity onPress={togglePlay} className="bg-black/50 rounded-full p-3">
            {isPlaying ? (
              <Pause size={24} color="#FFFFFF" />
            ) : (
              <Play size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <View className="flex-row space-x-4">
            <TouchableOpacity onPress={toggleLike}>
              <Heart size={24} color={isLiked ? "#FF69B4" : "#FFFFFF"} fill={isLiked ? "#FF69B4" : "none"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreVertical size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Video Info Section */}
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-white text-xl font-bold mb-2">{video.title}</Text>
        
        <View className="flex-row justify-between items-center mb-4">
          {video.duration && (
            <Text className="text-gray-300">{video.duration}</Text>
          )}
          <View className="flex-row space-x-4">
            <TouchableOpacity onPress={toggleLike} className="flex-row items-center">
              <Heart size={20} color={isLiked ? "#FF69B4" : "#AAAAAA"} fill={isLiked ? "#FF69B4" : "none"} />
              <Text className="text-gray-300 ml-1">24K</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSave} className="flex-row items-center">
              <Download size={20} color={isSaved ? "#FF69B4" : "#AAAAAA"} />
              <Text className="text-gray-300 ml-1">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {video.artist && (
          <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 rounded-full bg-gray-700 mr-3 items-center justify-center">
              <Text className="text-white text-xs">📹</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold">{video.artist}</Text>
              <Text className="text-gray-400 text-sm">Channel</Text>
            </View>
            <TouchableOpacity className="bg-white rounded-full px-4 py-2">
              <Text className="text-black font-semibold">Subscribe</Text>
            </TouchableOpacity>
          </View>
        )}

        {video.album && (
          <Text className="text-gray-300 mb-6">{video.album}</Text>
        )}

        {/* Comments Section */}
        <View className="mb-6">
          <Text className="text-white text-lg font-bold mb-4">Comments • 1.2K</Text>
          
          <View className="flex-row mb-4">
            <View className="w-8 h-8 rounded-full bg-gray-700 mr-3" />
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-white font-semibold mr-2">You</Text>
                <Text className="text-gray-400 text-sm">Just now</Text>
              </View>
              <View className="border border-gray-700 rounded-lg px-3 py-2">
                <Text className="text-gray-300">Add a comment...</Text>
              </View>
            </View>
          </View>

          {comments.map((comment) => (
            <View key={comment.id} className="flex-row mb-4">
              <View className="w-8 h-8 rounded-full bg-gray-700 mr-3" />
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-white font-semibold mr-2">{comment.user}</Text>
                  <Text className="text-gray-400 text-sm">{comment.time}</Text>
                </View>
                <Text className="text-gray-300 mb-2">{comment.comment}</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity>
                    <Heart size={16} color="#AAAAAA" />
                  </TouchableOpacity>
                  <Text className="text-gray-400 text-sm ml-1 mr-4">{comment.likes}</Text>
                  <TouchableOpacity>
                    <MessageCircle size={16} color="#AAAAAA" />
                  </TouchableOpacity>
                  <Text className="text-gray-400 text-sm ml-1">Reply</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Related Videos Section */}
        {relatedVideos.length > 0 && (
          <>
            <Text className="text-white text-lg font-bold mb-4">Related Videos</Text>
            {relatedVideos.map((relatedVideo) => (
              <TouchableOpacity 
                key={relatedVideo.id} 
                className="flex-row mb-4"
                onPress={() => router.push(`/video-player?id=${relatedVideo.id}`)}
              >
                {relatedVideo.thumbnail ? (
                  <Image 
                    source={{ uri: relatedVideo.thumbnail }} 
                    className="w-32 h-20 rounded-lg mr-3" 
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-32 h-20 rounded-lg mr-3 bg-gray-700 items-center justify-center">
                    <Text className="text-white text-xs">🎬</Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-white font-semibold mb-1">{relatedVideo.title}</Text>
                  {relatedVideo.artist && (
                    <Text className="text-gray-400 text-sm">{relatedVideo.artist}</Text>
                  )}
                  {relatedVideo.duration && (
                    <Text className="text-gray-400 text-sm">{relatedVideo.duration}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Player Controls Bar */}
      <View className="flex-row items-center justify-between bg-gray-800 p-4">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <SkipBack size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlay} className="bg-pink-500 rounded-full p-2 mr-4">
            {isPlaying ? (
              <Pause size={24} color="#FFFFFF" />
            ) : (
              <Play size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <SkipForward size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <Volume2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Maximize size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}