"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Target, 
  FileText,
  Briefcase,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'error';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const suggestedQuestions = [
  "How can I transition from frontend to full-stack development?",
  "What skills should I learn for senior engineer roles?",
  "How do I negotiate a better salary?",
  "What's the best way to prepare for technical interviews?",
  "Should I learn React or Vue.js first?",
  "How can I build a strong portfolio?",
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi there! I'm your AI Career Coach powered by AI CAREER COACH . I'm here to help you navigate your professional journey with personalized advice.\n\nI can help with:\n• Career transitions and path planning\n• Technical skill development strategies\n• Interview preparation (technical, behavioral, system design)\n• Resume optimization and ATS tips\n• Salary negotiation tactics\n• Portfolio and personal branding\n\nWhat would you like to discuss today?",
      timestamp: new Date(),
      suggestions: ["Career transition advice", "Skill development plan", "Interview preparation", "Salary negotiation tips"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get resume context from localStorage
  const getResumeContext = (): string => {
    try {
      const resumesData = localStorage.getItem('ai-career-coach:resumes');
      if (!resumesData) return '';

      const resumes = JSON.parse(resumesData);
      const defaultResume = resumes.find((r: any) => r.isDefault) || resumes[0];
      
      if (!defaultResume) return '';

      // Build context string from resume data
      const context = `
Title: ${defaultResume.personalInfo?.title || 'Not specified'}
Experience: ${defaultResume.experience?.length || 0} positions
Skills: ${defaultResume.skills?.join(', ') || 'Not specified'}
Education: ${defaultResume.education?.[0]?.degree || 'Not specified'} in ${defaultResume.education?.[0]?.field || 'Not specified'}
      `.trim();

      return context;
    } catch (error) {
      console.error('Error reading resume context:', error);
      return '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const resumeContext = getResumeContext();
      
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          resumeContext: resumeContext || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: error.message || 'Failed to get AI response. Please check your API key in .env.local and try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError(error.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Bot className="h-8 w-8 mr-3 text-blue-500" />
            AI Career Coach
          </h1>
          <p className="text-muted-foreground">
            Get personalized career advice and guidance from our AI-powered coach.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <GlassCard className="h-[600px] flex flex-col" gradient>
              {/* Error Alert */}
              {error && (
                <div className="p-4 pb-0">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error}. Make sure to connect your api  <code className="text-xs">.env.local</code>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`rounded-full p-2 ${
                            message.type === 'user' ? 'bg-blue-500' : 
                            message.type === 'error' ? 'bg-red-500' : 
                            'bg-purple-500'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : message.type === 'error' ? (
                              <AlertCircle className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user' ? 'bg-blue-500 text-white' : 
                            message.type === 'error' ? 'bg-red-500/20 border border-red-500/50' :
                            'bg-white/10 backdrop-blur-sm'
                          }`}>
                            {message.type === 'ai' ? (
                              <div className="text-sm prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown 
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                    strong: ({node, ...props}) => <strong className="font-semibold text-blue-300" {...props} />,
                                    em: ({node, ...props}) => <em className="italic text-purple-300" {...props} />,
                                    code: ({node, ...props}) => <code className="bg-black/30 px-1 py-0.5 rounded text-xs" {...props} />,
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-line">{message.content}</p>
                            )}
                            {message.suggestions && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, idx) => (
                                  <Button
                                    key={idx}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs bg-white/10 border-white/20 hover:bg-white/20"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="rounded-full p-2 bg-purple-500">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="rounded-lg p-3 bg-white/10 backdrop-blur-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your career..."
                    className="flex-1 bg-white/10 border-white/20 placeholder:text-white/50"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Suggested Questions */}
            <GlassCard className="p-4" gradient>
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Suggested Questions</h3>
              </div>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="w-full text-left text-sm p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-4" gradient>
              <h3 className="font-semibold mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Set Career Goals
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Review Resume
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Job Market Analysis
                </Button>
              </div>
            </GlassCard>

            {/* Coach Stats */}
            <GlassCard className="p-4" gradient>
              <h3 className="font-semibold mb-3">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sessions</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Goals Set</span>
                  <Badge variant="secondary">5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Actions Taken</span>
                  <Badge variant="secondary">23</Badge>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}