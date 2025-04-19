
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Eye, EyeOff } from 'lucide-react';
import { setGeminiApiKey } from '@/lib/gemini-service';

export default function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    // Load the API key from localStorage
    const storedApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedApiKey && storedApiKey !== 'GEMINI_API_KEY') {
      setApiKey('••••••••••••••••••••••••••');
    }
  }, []);

  const handleSave = () => {
    if (!apiKey) {
      toast.error('Please enter an API key');
      return;
    }
    
    setGeminiApiKey(apiKey);
    setIsEditing(false);
    setShowApiKey(false);
    toast.success('API key saved successfully');
  };

  const handleEdit = () => {
    setApiKey('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowApiKey(false);
    
    // Reset the input field to masked value if a key exists
    const storedApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedApiKey && storedApiKey !== 'GEMINI_API_KEY') {
      setApiKey('••••••••••••••••••••••••••');
    } else {
      setApiKey('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gemini API Key</CardTitle>
        <CardDescription>
          Add your Gemini API key to use for medical image analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="apiKey">Gemini API Key</Label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={!isEditing}
              />
              {(apiKey || !isEditing) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled={!isEditing && !localStorage.getItem('GEMINI_API_KEY')}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key from the Google AI Studio dashboard. This key will be stored in your browser's local storage.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save API Key
            </Button>
          </>
        ) : (
          <Button onClick={handleEdit}>
            {localStorage.getItem('GEMINI_API_KEY') && localStorage.getItem('GEMINI_API_KEY') !== 'GEMINI_API_KEY'
              ? 'Change API Key'
              : 'Add API Key'
            }
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
