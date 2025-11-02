import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Share2, Download, Heart, MessageCircle, MoreVertical } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data for video content
const mockVideo = {
  id: '1',
  title: 'Summer Music Festival Highlights',
  channel: 'MusicEvents',
  views: '2.4M views',
  uploadDate: '3 days ago',
  duration: '12:45',
  thumbnail: 'https://images.unsplash.com/photo-1636337897543-83b55150608f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JTIyQ2luZW1hJTIwbW92aWUlMjBuaWdodCUyMGV4cGVyaWVuY2V8ZW58MHx8MHx8fDA%3D',
  description: 'Relive the best moments from our summer music festival. Amazing performances by top artists and unforgettable memories.',
};

// Mock data for related videos
const relatedVideos = [
  { id: '2', title: 'Top 10 Concert Performances', channel: 'MusicChannel', views: '1.8M', duration: '15:22', thumbnail: 'https://images.unsplash.com/photo-1558008258-7ff8888b42b0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8R2FtaW5nJTIwZXNwb3J0cyUyMGNvbXBldGl0aW9ufGVufDB8fDB8fHww' },
  { id: '3', title: 'Acoustic Sessions - Live', channel: 'AcousticVibes', views: '956K', duration: '8:45', thumbnail: 'https://images.unsplash.com/photo-1608447718455-ed5006c46051?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8MyUyMGdyYXBoaWNzfGVufDB8fDB8fHww' },
  { id: '4', title: 'Behind the Scenes - Music Video', channel: 'ArtistsLife', views: '3.2M', duration: '22:10', thumbnail: 'https://images.unsplash.com/photo-1675351085230-ab39b2289ff4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D' },
  { id: '5', title: 'Music Festival Afterparty', channel: 'NightLife', views: '1.1M', duration: '18:33', thumbnail: 'https://images.unsplash.com/photo-1660142107232-e26dd2036dd8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D' },
];

// Mock comments data
const comments = [
  { id: '1', user: 'MusicFan123', comment: 'This was absolutely amazing! The energy was incredible.', likes: 245, time: '2 hours ago' },
  { id: '2', user: 'ConcertGoer', comment: 'Wish I could have been there in person. Thanks for sharing!', likes: 189, time: '5 hours ago' },
  { id: '3', user: 'ArtistSupporter', comment: 'The sound quality is fantastic. Great filming!', likes: 97, time: '1 day ago' },
];

export default function VideoPlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Video Player Section */}
      <View className="relative">
        <Image 
          source={{ uri: mockVideo.thumbnail }} 
          style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.56 }} 
          className="rounded-b-3xl"
        />
        
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
        <Text className="text-white text-xl font-bold mb-2">{mockVideo.title}</Text>
        
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-300">{mockVideo.views} • {mockVideo.uploadDate}</Text>
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

        <View className="flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
          <View className="flex-1">
            <Text className="text-white font-semibold">{mockVideo.channel}</Text>
            <Text className="text-gray-400 text-sm">1.2M subscribers</Text>
          </View>
          <TouchableOpacity className="bg-white rounded-full px-4 py-2">
            <Text className="text-black font-semibold">Subscribe</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-300 mb-6">{mockVideo.description}</Text>

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
        <Text className="text-white text-lg font-bold mb-4">Related Videos</Text>
        {relatedVideos.map((video) => (
          <TouchableOpacity key={video.id} className="flex-row mb-4">
            <Image 
              source={{ uri: video.thumbnail }} 
              className="w-32 h-20 rounded-lg mr-3" 
            />
            <View className="flex-1">
              <Text className="text-white font-semibold mb-1">{video.title}</Text>
              <Text className="text-gray-400 text-sm">{video.channel}</Text>
              <Text className="text-gray-400 text-sm">{video.views} • {video.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
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