import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function WebcamTest() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fetch available cameras
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput' && device.deviceId !== "");
        setVideoDevices(videoInputs);
        if (videoInputs.length > 0) {
            setSelectedDeviceId(videoInputs[0].deviceId);
        } else {
            setSelectedDeviceId("");
        }
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    };

    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  const startCamera = async () => {
    stopCamera(); // Ensure previous stream is closed
    setError(null);
    
    try {
      console.log("Requesting camera access...");
      const constraints = {
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsActive(true);
    } catch (err: any) {
      console.error("Webcam access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera permission denied. Please allow access in your browser settings.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError("No camera found. Please connect a webcam.");
      } else {
        setError(`Could not access camera: ${err.message}`);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h3 className="text-primary font-orbitron text-xl mb-2">Webcam Diagnostics</h3>
          <p className="text-muted-foreground text-sm">
            Test your camera functionality, resolution, and frame rate. Video is processed locally and never transmitted.
          </p>
        </div>

        <div className="space-y-4">
           <div className="space-y-2">
            <label className="text-xs font-orbitron text-muted-foreground">Select Camera</label>
            <Select 
                value={selectedDeviceId} 
                onValueChange={setSelectedDeviceId}
                disabled={isActive || videoDevices.length === 0}
            >
              <SelectTrigger className="w-full bg-surface border-secondary/30">
                <SelectValue placeholder={videoDevices.length === 0 ? "No cameras found" : "Select a camera"} />
              </SelectTrigger>
              <SelectContent>
                {videoDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            {!isActive ? (
              <Button onClick={startCamera} className="w-full bg-primary text-background hover:bg-primary/80 font-orbitron">
                <Camera className="mr-2 w-4 h-4" /> Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="destructive" className="w-full font-orbitron">
                <CameraOff className="mr-2 w-4 h-4" /> Stop Camera
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}
        
        {isActive && streamRef.current && (
             <div className="p-4 bg-surface border border-secondary/30 rounded-lg space-y-2">
                <h4 className="text-primary font-orbitron text-sm">Stream Stats</h4>
                <div className="text-xs font-mono text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                        <span>Resolution:</span>
                        <span className="text-foreground">
                            {streamRef.current.getVideoTracks()[0]?.getSettings().width}x
                            {streamRef.current.getVideoTracks()[0]?.getSettings().height}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Frame Rate:</span>
                        <span className="text-foreground">
                            {Math.round(streamRef.current.getVideoTracks()[0]?.getSettings().frameRate || 0)} FPS
                        </span>
                    </div>
                </div>
             </div>
        )}
      </div>

      <div className="lg:col-span-2">
        <Card className="bg-black border-secondary/30 p-1 overflow-hidden relative min-h-[400px] flex items-center justify-center glow-border">
            {!isActive ? (
              <div className="text-center text-muted-foreground">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-orbitron opacity-50">Camera Offline</p>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-contain bg-black"
                style={{ transform: 'scaleX(-1)' }} // Mirror effect for webcam
              />
            )}
            
            {isActive && (
                <div className="absolute top-4 right-4 flex gap-2">
                    <div className="text-[10px] text-neon-green font-orbitron border border-neon-green/50 bg-neon-green/10 px-2 py-0.5 rounded animate-pulse">
                        REC
                    </div>
                </div>
            )}
        </Card>
        
        <div className="mt-4 p-4 border-l-4 border-secondary bg-background/50">
            <h4 className="text-primary font-orbitron text-sm mb-2">Privacy Note</h4>
            <p className="text-xs text-muted-foreground">
            This tool streams your webcam directly to your browser's local memory. 
            No video data is recorded or sent to any server.
            </p>
        </div>
      </div>
    </div>
  );
}
