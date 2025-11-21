"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Zap,
  TrendingUp,
  MessageSquare,
  RotateCcw,
  Download,
  Mic,
  Paperclip,
  Plus,
  Trash2,
  Menu,
  X
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Dynamically import markdown library to reduce bundle size
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
  loading: () => <div className="text-sm text-gray-600">Loading...</div>,
});

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const quickPrompts = [
  { icon: TrendingUp, text: "Career growth strategy", prompt: "How can I advance to a senior role?" },
  { icon: Zap, text: "Interview prep", prompt: "Help me prepare for technical interviews" },
  { icon: MessageSquare, text: "Salary negotiation", prompt: "How do I negotiate a better salary?" },
  { icon: Sparkles, text: "Skill roadmap", prompt: "What skills should I learn next?" },
];

const exampleQuestions = [
  "How can I transition from frontend to full-stack development?",
  "What's the best way to showcase my projects in a portfolio?",
  "How do I stand out in a competitive job market?",
  "What are the most in-demand tech skills for 2025?",
  "How can I improve my system design interview skills?",
  "Should I pursue a master's degree or focus on experience?",
];

const STORAGE_KEY = 'ai-coach:sessions';
const CURRENT_SESSION_KEY = 'ai-coach:current';

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load sessions on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
        messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      })));
    }
    const current = localStorage.getItem(CURRENT_SESSION_KEY);
    if (current) {
      const parsed = JSON.parse(current);
      setMessages(parsed.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      setCurrentSessionId(parsed.id);
    }
  }, []);

  // Auto-save current session
  useEffect(() => {
    if (messages.length > 0) {
      const id = currentSessionId || Date.now().toString();
      if (!currentSessionId) setCurrentSessionId(id);
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify({ id, messages }));
    }
  }, [messages, currentSessionId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

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

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputValue;
    if (!messageToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
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
          message: messageToSend,
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
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. This might be due to API limits. Please try again in a moment, or check your API configuration.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveSession = () => {
    if (messages.length === 0) return;
    const title = messages.find(m => m.type === 'user')?.content.slice(0, 40) || 'New Chat';
    const session: ChatSession = {
      id: currentSessionId || Date.now().toString(),
      title: title + (title.length >= 40 ? '...' : ''),
      messages,
      timestamp: new Date()
    };
    const updated = [session, ...sessions.filter(s => s.id !== session.id)].slice(0, 50);
    setSessions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const newChat = () => {
    if (messages.length > 0) saveSession();
    setMessages([]);
    setCurrentSessionId(null);
    setInputValue('');
    localStorage.removeItem(CURRENT_SESSION_KEY);
  };

  const loadSession = (session: ChatSession) => {
    if (messages.length > 0 && currentSessionId !== session.id) saveSession();
    setMessages(session.messages);
    setCurrentSessionId(session.id);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (currentSessionId === id) newChat();
  };

  const handleReset = () => {
    saveSession();
    newChat();
  };

  const handleExport = () => {
    const exportData = messages.map(m => `[${m.type.toUpperCase()}] ${m.content}`).join('\n\n');
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-chat-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navbar />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-4 h-[calc(100vh-80px)]">
        {/* Chat History Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[260px] flex-shrink-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Chat History</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSidebarOpen(false)}
                  className="h-7 w-7 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={newChat}
                className="w-full mb-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              <ScrollArea className="flex-1">
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className={`group relative p-2.5 rounded-lg cursor-pointer transition-all ${
                        currentSessionId === session.id
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(session.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => deleteSession(session.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity"
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-8">No chat history yet</p>
                  )}
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSidebarOpen(true)}
                  className="h-9 w-9 text-slate-400 hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <Bot className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Career Coach
                </h1>
                <p className="text-slate-400 text-xs mt-0.5">
                  Your personal career advisor, powered by AI
                </p>
              </div>
            </div>
            
            {messages.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Chat Container */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-4">
          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="order-2 lg:order-1 min-w-0"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden h-[calc(100vh-180px)] flex flex-col">
              
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                {messages.length === 0 ? (
                  /* Empty State */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center px-4"
                  >
                    <div className="text-center max-w-lg">
                      <div className="relative inline-block mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-2xl"></div>
                        <Bot className="relative h-16 w-16 text-blue-400 mx-auto" />
                      </div>
                      <h2 className="text-xl font-bold mb-2 text-white">
                        Ready to accelerate your career?
                      </h2>
                      <p className="text-slate-400 text-sm mb-6">
                        Ask me anything about career growth, interviews, skills, or salary negotiation. I&apos;m here to help!
                      </p>
                      
                      {/* Quick Start Prompts */}
                      <div className="grid grid-cols-2 gap-2">
                        {quickPrompts.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(prompt.prompt)}
                            className="group p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all hover:scale-105"
                          >
                            <prompt.icon className="h-5 w-5 mb-1.5 text-blue-400 group-hover:text-purple-400 transition-colors" />
                            <p className="text-xs font-medium text-slate-300">{prompt.text}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Messages */
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2.5 max-w-[90%] ${
                            message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.type === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50'
                                : 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50'
                            }`}>
                              {message.type === 'user' ? (
                                <User className="h-4 w-4 text-white" />
                              ) : (
                                <Bot className="h-4 w-4 text-white" />
                              )}
                            </div>
                            
                            {/* Message Bubble */}
                            <div className="flex-1 space-y-1.5">
                              <div className={`rounded-xl px-4 py-3 ${
                                message.type === 'user'
                                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg'
                                  : 'bg-slate-800/80 border border-white/10 shadow-xl'
                              }`}>
                                {message.type === 'ai' ? (
                                  <div className="prose prose-invert prose-sm max-w-none text-[15px]">
                                    <ReactMarkdown 
                                      components={{
                                        p: ({node, ...props}: any) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-100" {...props} />,
                                        ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-2 space-y-1 text-slate-100" {...props} />,
                                        ol: ({node, ...props}: any) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-slate-100" {...props} />,
                                        li: ({node, ...props}: any) => <li className="text-slate-100 text-[14px]" {...props} />,
                                        strong: ({node, ...props}: any) => <strong className="font-bold text-blue-200" {...props} />,
                                        em: ({node, ...props}: any) => <em className="italic text-purple-200" {...props} />,
                                        code: ({node, ...props}: any) => <code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-xs text-blue-300" {...props} />,
                                        h3: ({node, ...props}: any) => <h3 className="text-base font-bold mb-1.5 text-white" {...props} />,
                                        blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-blue-500 pl-3 italic text-slate-200" {...props} />,
                                      }}
                                    >
                                      {message.content}
                                    </ReactMarkdown>
                                  </div>
                                ) : (
                                  <p className="text-[15px] leading-relaxed text-white">{message.content}</p>
                                )}
                              </div>
                              
                              {/* Suggestions */}
                              {message.suggestions && message.suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pl-1">
                                  {message.suggestions.map((suggestion, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => handleSendMessage(suggestion)}
                                      className="px-2.5 py-1 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:scale-105 text-slate-300 hover:text-white"
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                              
                              {/* Timestamp */}
                              <p className={`text-xs text-slate-500 ${message.type === 'user' ? 'text-right' : 'text-left'} pl-1`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-2.5"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="p-3 border-t border-white/10 bg-slate-900/50">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about your career..."
                    disabled={isTyping}
                    className="min-h-[56px] max-h-[200px] resize-none bg-slate-800/50 border-white/10 focus:border-blue-500/50 rounded-2xl pr-32 text-[15px] placeholder:text-slate-500"
                    rows={1}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/10"
                      disabled={isTyping}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/10"
                      disabled={isTyping}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      className="h-9 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Shift + Enter</kbd> for new line
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 order-1 lg:order-2"
          >
            {/* Example Questions */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-3">
              <div className="flex items-center space-x-1.5 mb-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <h3 className="font-semibold text-white text-sm">Example Questions</h3>
              </div>
              <div className="space-y-1.5">
                {exampleQuestions.slice(0, 4).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(question)}
                    disabled={isTyping}
                    className="w-full text-left text-xs p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl border border-white/10 p-3">
              <div className="flex items-center space-x-1.5 mb-2">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Zap className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Pro Tip</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                For more personalized advice, make sure to complete your resume in the Resume section. I&apos;ll use that context to give you tailored recommendations!
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-3">
              <h3 className="font-semibold text-white text-sm mb-2">Session Stats</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Messages</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0">
                    {messages.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Questions Asked</span>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0">
                    {messages.filter(m => m.type === 'user').length}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </main>
    </div>
  );
}