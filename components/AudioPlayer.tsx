"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NeonGradientCard } from './ui/neon-gradient-card'

interface AudioPlayerProps {
  src: string
  title: string
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    const resetPlayer = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('ended', resetPlayer)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('ended', resetPlayer)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef.current?.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (newValue: number[]) => {
    const [time] = newValue
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (newValue: number[]) => {
    const [newVolume] = newValue
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
        <NeonGradientCard className='w-full max-w-md mx-4 rounded-xl shadow-xl mb-20'>
      <div className="p-4 h-full text-center">
        <h2 className="text-sm text-center font-medium text-gray-600 mb-2">My Audio</h2>
        <audio ref={audioRef} src='/1.mp3' />
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={togglePlay} 
            aria-label={isPlaying ? "Pause" : "Play"}
            className="hover:bg-gray-100 mb-7"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex-grow">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full cursor-pointer"
              aria-label="Seek"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-3">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='mb-7'>
              <Button variant="ghost" size="sm" className="text-xs font-medium">
                {playbackRate}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[0.5, 1, 1.5, 2].map((rate) => (
                <DropdownMenuItem key={rate} onSelect={() => changePlaybackRate(rate)}>
                  {rate}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center">
          <Volume2 className="h-4 w-4 text-gray-500 mr-2" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24 cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
      </NeonGradientCard>
    </div>
  )
}
