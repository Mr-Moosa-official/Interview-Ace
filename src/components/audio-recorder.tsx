"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import { Progress } from "./ui/progress";

interface AudioRecorderProps {
  onRecordingComplete: (audioDataUri: string) => void;
  disabled: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RECORDING_TIME = 300; // 5 minutes

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onRecordingComplete(base64data);
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => {
            if (prevTime >= MAX_RECORDING_TIME) {
                stopRecording();
                return MAX_RECORDING_TIME;
            }
            return prevTime + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied. Please allow access in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const resetRecording = () => {
    setAudioURL(null);
    setRecordingTime(0);
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  if (audioURL) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
            <audio src={audioURL} controls className="w-full" />
            <Button onClick={resetRecording} variant="ghost" size="icon" disabled={disabled}>
                <Trash2 className="size-4" />
                <span className="sr-only">Record Again</span>
            </Button>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 items-center">
        <Button 
            onClick={isRecording ? stopRecording : startRecording} 
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="w-48"
            disabled={disabled}
        >
            {isRecording ? <Square className="mr-2" /> : <Mic className="mr-2" />}
            {isRecording ? "Stop Recording" : "Record Answer"}
        </Button>
        {isRecording && (
            <div className="w-full flex items-center gap-4">
                <Progress value={(recordingTime / MAX_RECORDING_TIME) * 100} className="flex-1 h-2"/>
                <span className="text-sm font-mono text-muted-foreground w-20 text-right">{formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}</span>
            </div>
        )}
    </div>
  );
};
