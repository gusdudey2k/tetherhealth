import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatWindowProps {
  voiceflowApiKey: string;
  voiceflowProjectId: string;
  voiceflowConfig?: string;
}

export function ChatWindow({ voiceflowApiKey, voiceflowProjectId, voiceflowConfig }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Call Voiceflow API
      const response = await fetch('https://general-runtime.voiceflow.com/state/user/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': voiceflowApiKey,
          'vf-project-id': voiceflowProjectId,
        },
        body: JSON.stringify({
          action: {
            type: 'text',
            payload: content.trim(),
          },
          config: voiceflowConfig ? JSON.parse(voiceflowConfig) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Voiceflow');
      }

      const data = await response.json();
      
      // Add assistant message
      if (data.length > 0) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data[0].payload.message,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role}`}
          >
            <div className="message-content">
              <p className="text-sm">{message.content}</p>
              <span className="text-xs text-muted-foreground mt-1">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={loading}
          />
          <Button 
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
} 