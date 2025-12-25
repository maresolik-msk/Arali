import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

export function VoiceInput({ onTranscript, placeholder = 'Click mic to speak' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak now', { duration: 2000 });
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece;
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        onTranscript(finalTranscript);
        toast.success('Voice input captured!');
      } else if (interimTranscript) {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        toast.error('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please enable it in browser settings.');
      } else {
        toast.error('Voice input error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={toggleListening}
        className={`${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
            : 'border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81]/10'
        } transition-all duration-200`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 mr-2 animate-pulse" />
            Stop
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </>
        )}
      </Button>
      {transcript && (
        <span className="text-sm text-muted-foreground italic">
          "{transcript}"
        </span>
      )}
    </div>
  );
}
