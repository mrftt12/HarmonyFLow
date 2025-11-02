import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Heart, MoreHorizontal } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { getAudioFiles, MediaFile } from '../services/blobService';

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

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [track, setTrack] = useState<MediaFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(180); // Default duration in seconds

  useEffect(() => {
    loadTrack();
  }, [id]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const audioFiles = await getAudioFiles();
      
      if (id) {
        const foundTrack = audioFiles.find(file => file.id === id);
        if (foundTrack) {
          setTrack(foundTrack);
          // Parse duration if available, otherwise use default
          if (foundTrack.duration) {
            const durationMatch = foundTrack.duration.match(/(\d+):(\d+)/);
            if (durationMatch) {
              setDuration(parseInt(durationMatch[1]) * 60 + parseInt(durationMatch[2]));
            }
          }
        } else if (audioFiles.length > 0) {
          setTrack(audioFiles[0]);
        }
      } else if (audioFiles.length > 0) {
        setTrack(audioFiles[0]);
      }
    } catch (error) {
      console.error('Error loading track:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading || !track) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="text-white mt-4">Loading track...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Album Art Section */}
      <View className="flex-1 justify-center items-center px-8 pt-16">
        {track.thumbnail ? (
          <Image
            source={{ uri: track.thumbnail }}
            style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_WIDTH * 0.8 }}
            className="rounded-3xl mb-8"
          />
        ) : (
          <View 
            style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_WIDTH * 0.8 }}
            className="rounded-3xl mb-8 bg-gray-700 items-center justify-center"
          >
            <Text className="text-white text-6xl">🎵</Text>
          </View>
        )}
        
        <View className="items-center w-full">
          <Text className="text-white text-2xl font-bold mb-2">{track.title}</Text>
          <Text className="text-gray-400 text-lg mb-8">{track.artist || 'Unknown Artist'}</Text>
        </View>

        {/* Progress Slider */}
        <View className="w-full px-4 mb-4">
          <CustomSlider
            minimumValue={0}
            maximumValue={duration}
            value={currentPosition}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#FF69B4"
            maximumTrackTintColor="#333333"
            thumbColor="#FF69B4"
          />

          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-400 text-sm">{formatTime(currentPosition)}</Text>
            <Text className="text-gray-400 text-sm">{formatTime(duration)}</Text>
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