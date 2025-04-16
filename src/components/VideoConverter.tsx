
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Download, Play, Pause, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extractVideoId, getThumbnailUrl, getEmbedUrl, formatTime } from '@/utils/youtube';

const VideoConverter = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState([0, 100]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(100); // Default max duration
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const extractedId = extractVideoId(url);
    
    if (!extractedId) {
      toast({
        title: "解析錯誤",
        description: "無效的 YouTube 網址，請確認後重試。",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Reset state for new video
    setVideoId(extractedId);
    setIsPlaying(false);
    setTimeRange([0, duration]);
    
    // Simulate video metadata loading
    setTimeout(() => {
      setDuration(300); // Default to 5 minutes if we can't get actual duration
      setTimeRange([0, 300]);
      setIsLoading(false);
      toast({
        title: "成功載入",
        description: "影片已準備好，可以選擇時間範圍並下載。",
      });
    }, 1500);
  };

  const handleDownload = () => {
    if (!videoId) {
      toast({
        title: "下載錯誤",
        description: "請先載入影片。",
        variant: "destructive"
      });
      return;
    }
    
    // Here we would handle the actual video download with time ranges
    // For now we're just showing a toast message
    toast({
      title: "開始下載",
      description: `開始下載影片 (${formatTime(timeRange[0])} - ${formatTime(timeRange[1])})`,
    });
    
    // In a real implementation, we would call a backend API to process the video
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // In a real implementation, we would control the iframe player
    if (videoRef.current) {
      try {
        const message = isPlaying ? '{"event":"command","func":"pauseVideo","args":""}' : 
                                   '{"event":"command","func":"playVideo","args":""}';
        videoRef.current.contentWindow?.postMessage(message, '*');
      } catch (error) {
        console.error("Failed to control video player:", error);
      }
    }
  };

  // Function to handle time range changes
  const handleTimeRangeChange = (newRange: number[]) => {
    setTimeRange(newRange);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          YouTube 影片下載器
        </h1>

        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="請輸入 YouTube 網址"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-muted text-white border-primary/20"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90" 
              disabled={isLoading}
            >
              {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
              載入
            </Button>
          </div>
        </form>

        <div className="bg-secondary/30 rounded-lg p-6 space-y-6">
          <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center overflow-hidden">
            {!videoId && !isLoading && (
              <p className="text-muted-foreground">影片預覽區</p>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center">
                <Loader className="h-8 w-8 animate-spin mb-2" />
                <p className="text-muted-foreground">解析影片中...</p>
              </div>
            )}
            
            {videoId && !isLoading && (
              <iframe
                ref={videoRef}
                src={`${getEmbedUrl(videoId)}?enablejsapi=1&start=${timeRange[0]}&end=${timeRange[1]}`}
                className="w-full h-full"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
                className="bg-muted hover:bg-muted/90"
                disabled={!videoId || isLoading}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <Slider
                  value={timeRange}
                  onValueChange={handleTimeRangeChange}
                  max={duration}
                  step={1}
                  className="w-full"
                  disabled={!videoId || isLoading}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(timeRange[0])}</span>
              <span>{formatTime(timeRange[1])}</span>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            className="w-full bg-accent hover:bg-accent/90"
            disabled={!videoId || isLoading}
          >
            <Download className="mr-2 h-4 w-4" /> 下載 MP4
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoConverter;
