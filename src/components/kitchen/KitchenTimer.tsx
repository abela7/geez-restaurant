
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, Play, Pause, RotateCcw, Plus, Trash2, Volume2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface TimerItem {
  id: string;
  name: string;
  duration: number; // in seconds
  remaining: number; // in seconds
  active: boolean;
}

const KitchenTimer: React.FC = () => {
  const { t } = useLanguage();
  const [timers, setTimers] = useState<TimerItem[]>([]);
  const [newTimerName, setNewTimerName] = useState("");
  const [newTimerMinutes, setNewTimerMinutes] = useState(5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Set up the timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => 
        prevTimers.map(timer => {
          if (timer.active && timer.remaining > 0) {
            const newRemaining = timer.remaining - 1;
            
            // Play sound when timer reaches 0
            if (newRemaining === 0 && audioRef.current) {
              audioRef.current.play();
            }
            
            return { ...timer, remaining: newRemaining };
          }
          return timer;
        })
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Add a new timer
  const addTimer = () => {
    if (!newTimerName.trim()) return;
    
    const durationInSeconds = newTimerMinutes * 60;
    
    const newTimer: TimerItem = {
      id: crypto.randomUUID(),
      name: newTimerName,
      duration: durationInSeconds,
      remaining: durationInSeconds,
      active: false
    };
    
    setTimers([...timers, newTimer]);
    setNewTimerName("");
  };
  
  // Toggle timer (start/pause)
  const toggleTimer = (id: string) => {
    setTimers(prevTimers => 
      prevTimers.map(timer => 
        timer.id === id ? { ...timer, active: !timer.active } : timer
      )
    );
  };
  
  // Reset timer
  const resetTimer = (id: string) => {
    setTimers(prevTimers => 
      prevTimers.map(timer => 
        timer.id === id ? { ...timer, remaining: timer.duration, active: false } : timer
      )
    );
  };
  
  // Delete timer
  const deleteTimer = (id: string) => {
    setTimers(prevTimers => prevTimers.filter(timer => timer.id !== id));
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle><T text="Kitchen Timers" /></CardTitle>
      </CardHeader>
      <CardContent>
        <audio ref={audioRef} src="/sounds/timer-alarm.mp3" />
        
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder={t("Timer name (e.g., Beef Tibs)")}
            value={newTimerName}
            onChange={(e) => setNewTimerName(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            value={newTimerMinutes}
            onChange={(e) => setNewTimerMinutes(Number(e.target.value))}
            className="w-20"
            min={1}
            max={120}
          />
          <Button onClick={addTimer} disabled={!newTimerName.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            <T text="Add" />
          </Button>
        </div>
        
        {timers.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            <Timer className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p><T text="No active timers" /></p>
            <p className="text-sm"><T text="Add a timer to get started" /></p>
          </div>
        ) : (
          <div className="space-y-3">
            {timers.map(timer => (
              <div 
                key={timer.id} 
                className={`flex items-center justify-between p-3 rounded-md border ${
                  timer.remaining === 0 ? 'bg-red-50 border-red-200 animate-pulse' : 
                  timer.active ? 'bg-amber-50 border-amber-200' : 'border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium">{timer.name}</div>
                  <div className="text-sm text-muted-foreground">
                    <T text="Total" />: {formatTime(timer.duration)}
                  </div>
                </div>
                
                <div className="text-2xl font-mono mr-3">
                  {formatTime(timer.remaining)}
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => toggleTimer(timer.id)}
                    className={timer.active ? 'text-amber-600' : 'text-green-600'}
                  >
                    {timer.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => resetTimer(timer.id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-red-600"
                    onClick={() => deleteTimer(timer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KitchenTimer;
