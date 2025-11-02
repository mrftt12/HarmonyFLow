import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Heart, MoreHorizontal } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CustomSliderProps {
  minimumValue: number;
  maximumValue: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
  thumbColor: string;
}

const CustomSlider = ({
  minimumValue,
  maximumValue,
  value,
  onValueChange,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbColor,
}: CustomSliderProps) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<View>(null);
  
  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };
  
  const handlePanResponderMove = (event: any) => {
    if (sliderWidth <= 0) return;
    
    const locationX = event.nativeEvent.locationX;
    const newValue = Math.min(
      maximumValue,
      Math.max(
        minimumValue,
        (locationX / sliderWidth) * (maximumValue - minimumValue) + minimumValue
      )
    );
    
    onValueChange(newValue);
  };
  
  const progress = sliderWidth > 0 
    ? ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth 
    : 0;
  
  return (
    <View 
      className="h-10 justify-center"
      ref={sliderRef}
      onLayout={handleLayout}
      onTouchMove={handlePanResponderMove}
      onTouchEnd={handlePanResponderMove}
    >
      <View className="h-1 rounded-full" style={{ backgroundColor: maximumTrackTintColor }}>
        <View 
          className="absolute h-1 rounded-full top-0 left-0" 
          style={{ 
            backgroundColor: minimumTrackTintColor, 
            width: progress 
          }} 
        />
        <View
          className="absolute w-5 h-5 rounded-full border-2"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: thumbColor,
            left: progress - 10,
            top: -9.5,
          }}
        />
      </View>
    </View>
  );
};

// Mock track data
const mockTrack = {
  id: '1',
  title: 'Electric Dreams',
  artist: 'Neon Pulse',
  album: 'Midnight Vibes',
  duration: 225, // seconds
  cover: 'https://images.unsplash.com/photo-1487954335942-047e6d1551ee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q29uY2VydCUyMG11c2ljJTIwcGVyZm9ybWFuY2V8ZW58MHx8MHx8fDA%3D',
};

export default function PlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number) => {
    setCurrentPosition(value);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <View className="flex-1 bg-black">
      {/* Album Art Section */}
      <View className="flex-1 justify-center items-center px-8 pt-16">
        <Image
          source={{ uri: mockTrack.cover }}
          style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_WIDTH * 0.8 }}
          className="rounded-3xl mb-8"
        />
        
        <View className="items-center w-full">
          <Text className="text-white text-2xl font-bold mb-2">{mockTrack.title}</Text>
          <Text className="text-gray-400 text-lg mb-8">{mockTrack.artist}</Text>
        </View>

        {/* Progress Slider */}
        <View className="w-full px-4 mb-4">
          <CustomSlider
            minimumValue={0}
            maximumValue={mockTrack.duration}
            value={currentPosition}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#FF69B4"
            maximumTrackTintColor="#333333"
            thumbColor="#FF69B4"
          />
          
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-400 text-sm">{formatTime(currentPosition)}</Text>
            <Text className="text-gray-400 text-sm">{formatTime(mockTrack.duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View className="flex-row items-center justify-center space-x-6 mt-8">
          <TouchableOpacity>
            <SkipBack size={32} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handlePlayPause}
            className="bg-pink-500 rounded-full p-6"
          >
            {isPlaying ? (
              <Pause size={40} color="#FFFFFF" />
            ) : (
              <Play size={40} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity>
            <SkipForward size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Additional Actions */}
        <View className="flex-row items-center justify-center space-x-8 mt-12">
          <TouchableOpacity onPress={handleLike}>
            <Heart 
              size={28} 
              color={isLiked ? "#FF69B4" : "#FFFFFF"} 
              fill={isLiked ? "#FF69B4" : "none"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity>
            <MoreHorizontal size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}