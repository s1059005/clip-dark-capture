
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Download, Play, Pause } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const VideoConverter = () => {
  const [url, setUrl] = useState('');
  const [timeRange, setTimeRange] = useState([0, 100]);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would validate and process the YouTube URL
    toast({
      title: "處理中",
      description: "正在解析 YouTube 影片...",
    });
  };

  const handleDownload = () => {
    // Here we would handle the video download
    toast({
      title: "開始下載",
      description: "影片下載中，請稍候...",
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              載入
            </Button>
          </div>
        </form>

        <div className="bg-secondary/30 rounded-lg p-6 space-y-6">
          <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">影片預覽區</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
                className="bg-muted hover:bg-muted/90"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <Slider
                  value={timeRange}
                  onValueChange={setTimeRange}
                  max={100}
                  step={1}
                  className="w-full"
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
          >
            <Download className="mr-2 h-4 w-4" /> 下載 MP4
          </Button>
        </div>
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default VideoConverter;
