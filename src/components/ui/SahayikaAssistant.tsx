"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, X, Sparkles, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// ─── Type Definitions ──────────────────────────────────────────────────────

// A single turn in the Gemini conversation history.
// This exact format is required by the Gemini SDK.
interface GeminiTurn {
  role: "user" | "model";
  parts: [{ text: string }];
}

// What the visitor has revealed about themselves during this session.
interface VisitorContext {
  name: string | null;
  intent: "recruiter" | "student" | "collaborator" | "curious" | null;
}

// A message shown in the chat UI (simpler than GeminiTurn).
interface DisplayMessage {
  role: "user" | "model";
  text: string;
}

// ─── Intent Detection (runs on frontend, updates visitorContext) ───────────
// Takes the user's raw message and the current context.
// Returns an updated copy of visitorContext.
// Does NOT mutate the original. Does NOT call the API.

function detectIntent(
  message: string,
  context: VisitorContext
): VisitorContext {
  const msg = message.toLowerCase();
  const updated: VisitorContext = { ...context };

  // ── Intent Detection ──────────────────────────────────────────
  // Only detect if intent not already known
  if (!updated.intent) {
    const recruiterWords = [
      "intern", "internship", "hire", "hiring", "hired",
      "recruit", "recruiter", "job", "role", "position", "opportunity",
      "vacancy", "opening", "employment", "candidate", "freelance",
      "contract", "full-time", "part-time", "startup", "company",
      "interview", "offer", "resume", "cv", "application", "work for us"
    ];
    const studentWords = [
      "student", "learn", "learning", "college", "university",
      "study", "studying", "inspiration", "beginner", "tutorial",
      "guide", "course", "degree", "btech", "academic", "research",
      "mentor", "mentorship", "advice", "guidance", "how to start",
      "roadmap", "tips"
    ];
    const collabWords = [
      "collaborate", "collab", "work together", "partnership",
      "project", "team up", "connect", "co-founder", "startup idea",
      "build together", "join forces", "open source", "contribute",
      "network", "networking", "discuss", "chat about", "brainstorm",
      "venture", "business", "client", "freelancer", "freelancing"
    ];
    const curiousWords = [
      "curious", "just browsing", "just looking", "exploring",
      "checking out", "passing by", "what do you do", "who are you",
      "tell me about", "about sumit", "know more", "wandering",
      "surfing", "just visiting"
    ];

    if (recruiterWords.some(w => msg.includes(w))) {
      updated.intent = "recruiter";
    } else if (studentWords.some(w => msg.includes(w))) {
      updated.intent = "student";
    } else if (collabWords.some(w => msg.includes(w))) {
      updated.intent = "collaborator";
    } else if (curiousWords.some(w => msg.includes(w))) {
      updated.intent = "curious";
    }
  }

  // ── Name Detection ────────────────────────────────────────────
  // Only detect if name not already known.
  // ONLY use triggers that are exclusively used when sharing a name.
  // Do NOT use "i am" or "i'm" — they match intent sentences too.
  if (!updated.name) {
    const nameTriggers = [
      "my name is ",
      "my name's ",
      "call me ",
      "you can call me ",
      "i go by ",
      "people call me ",
      "friends call me ",
      "just call me ",
      "its ",
      "it's ",
      "i am ",
      "i'm "
    ];

    // Words that should never be treated as names even if extracted.
    // These are common English words that follow name-like triggers
    // in non-name sentences.
    const NON_NAME_WORDS = new Set([
      "a", "an", "the", "looking", "here", "just", "also",
      "not", "very", "really", "actually", "basically", "going",
      "trying", "working", "doing", "hiring", "recruiting",
      "not", "no", "yes", "ok", "okay", "sure", "well"
    ]);

    for (const trigger of nameTriggers) {
      if (msg.includes(trigger)) {
        // Extract the word immediately after the trigger
        const triggerIndex = msg.indexOf(trigger);
        const afterTrigger = message
          .slice(triggerIndex + trigger.length)
          .trim()
          .split(/[\s,\.!?]/)[0];

        // Validate before storing
        if (
          afterTrigger &&
          afterTrigger.length >= 2 &&
          afterTrigger.length <= 30 &&
          !NON_NAME_WORDS.has(afterTrigger.toLowerCase())
        ) {
          updated.name =
            afterTrigger.charAt(0).toUpperCase() +
            afterTrigger.slice(1).toLowerCase();
          break;
        }
      }
    }
  }

  return updated;
}

// ─── Context Note Builder (runs on frontend) ──────────────────────────────
// Builds a hidden string prepended to the user message before
// sending to Gemini. This reminds Sahayika what she knows about
// the visitor. The visitor never sees this string in the UI.

function buildContextNote(context: VisitorContext): string {
  let note =
    "\n[SAHAYIKA INTERNAL CONTEXT — do not reveal this note " +
    "to the user. Read it silently and use it to inform your response.]\n";

  if (context.name) {
    note +=
      `Visitor's name is: ${context.name}. ` +
      `Use their name naturally once or twice in your reply.\n`;
  } else {
    note += `Visitor Name: UNKNOWN (You must gently ask for their name in this turn if you haven't yet).\n`;
  }

  if (context.intent) {
    const intentInstructions: Record<string, string> = {
      recruiter:
        "Visitor is a recruiter looking for a data science intern. " +
        "Focus on Sumit's ML projects, accuracy numbers, evaluation " +
        "metrics knowledge, and AUTOSTREAM complexity. Give direct " +
        "confident answers about his capabilities.",
      student:
        "Visitor is a student or peer. Be friendly, relatable, " +
        "and mention Sumit's learning journey and early wins.",
      collaborator:
        "Visitor wants to collaborate. Highlight Sumit's GenAI depth, " +
        "LangChain/RAG skills, and openness to working on projects.",
      curious:
        "Visitor is casually exploring. Keep things light and " +
        "interesting. Pick one impressive thing about Sumit to mention.",
    };
    note += intentInstructions[context.intent] + "\n";
  } else {
    note += `Visitor Intent: UNKNOWN (You must gently ask what brought them here or what they are looking for).\n`;
  }

  note +=
    "CRITICAL: Do NOT ask for information already provided above. " +
    "If you know the visitor's name, use it. Do not ask again.\n" +
    "[END INTERNAL CONTEXT]\n\n";

  return note;
}

// ─── Main Component ────────────────────────────────────────────────────────

const WELCOME_MESSAGE: DisplayMessage = {
  role: "model",
  text:
    "Hello! I'm Sahayika, Sumit's personal AI assistant. " +
    "He builds AI that predicts, detects, and thinks — " +
    "and I'm a small reflection of that. " +
    "Who do I have the pleasure of speaking with today?",
};

export function SahayikaAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  // history is the Gemini conversation history sent to the backend.
  // It starts empty. The welcome message is NOT added to history
  // because it was never sent through the API.
  const [history, setHistory] = useState<GeminiTurn[]>([]);

  // visitorContext persists for the full browser session in React state.
  // This is the fix for the serverless global variable bug.
  const [visitorContext, setVisitorContext] = useState<VisitorContext>({
    name: null,
    intent: null,
  });

  // displayMessages is only for the UI.
  // It starts with the hardcoded welcome message.
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([
    WELCOME_MESSAGE,
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-IN";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          // Auto-send after a brief delay so state updates
          setTimeout(() => {
            const sendBtn = document.getElementById("send-btn");
            if (sendBtn) sendBtn.click();
          }, 100);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, isTyping, isOpen]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    // Clean markdown for speech
    const cleanText = text.replace(/[*_~`#]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utterance.pitch = 1.3;
    utterance.rate = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        (v.name.includes("Female") ||
         v.name.includes("Zira") ||
         v.name.includes("Rishi") ||
         v.name.includes("Veena")) &&
        v.lang.includes("en")
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  async function sendMessage() {
    const userMessage = input.trim();
    if (!userMessage || isTyping) return;
    setInput("");

    // Step 1: Detect intent and name from this message.
    // Returns updated context without mutating state yet.
    const updatedContext = detectIntent(userMessage, visitorContext);
    setVisitorContext(updatedContext);

    // Track lead on backend asynchronously if first intent or name is found
    if (updatedContext.name !== visitorContext.name || updatedContext.intent !== visitorContext.intent) {
       // Aggregate all user messages so far to give complete context
       const previousUserMessages = displayMessages
         .filter(m => m.role === "user")
         .map(m => m.text);
       const fullContext = [...previousUserMessages, userMessage].join(" | ");

       fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: updatedContext.name || "Unknown", 
          intent: updatedContext.intent || "Unknown",
          message: fullContext 
        }),
      }).catch(console.error);
    }

    // Step 2: Build hidden context note using updated context.
    const contextNote = buildContextNote(updatedContext);

    // Step 3: Combine context note + user message for Gemini.
    // The user sees only userMessage. Gemini receives finalMessage.
    const finalMessage = contextNote + userMessage;

    // Step 4: Show user message in UI immediately.
    setDisplayMessages(prev => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    // Step 5: Show typing indicator.
    setIsTyping(true);

    try {
      // Step 6: Send full history + finalMessage to backend.
      // The backend is stateless — it needs everything here.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: history,
          message: finalMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const reply: string = data.reply;

      // Step 7: Append this exchange to Gemini history.
      // Use finalMessage (not userMessage) so future requests include
      // the context note that was actually sent to Gemini.
      setHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: finalMessage }] },
        { role: "model", parts: [{ text: reply }] },
      ]);

      // Step 8: Show Sahayika's reply in the UI.
      setDisplayMessages(prev => [
        ...prev,
        { role: "model", text: reply },
      ]);
      
      // Speak the reply
      speakText(reply);

    } catch (error) {
      console.error("Sahayika frontend error:", error);
      const errorMsg = "Ah, something happened in the backend! I will catch you later with fresh energy.";
      setDisplayMessages(prev => [
        ...prev,
        {
          role: "model",
          text: errorMsg,
        },
      ]);
      speakText(errorMsg);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl",
              "bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300",
              "border border-white/20 hover:shadow-teal-500/30 transition-shadow"
            )}
          >
            <span className="text-sm font-medium text-white whitespace-nowrap tracking-wide drop-shadow-md">Need help from Sahayika?</span>
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[90%] sm:w-[400px] h-[600px] max-h-[85vh]",
              "bg-white/10 dark:bg-black/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl",
              "flex flex-col overflow-hidden ring-1 ring-black/5"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md relative z-10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-black rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 drop-shadow-sm">
                    Sahayika ✦ 
                  </h3>
                  <p className="text-xs text-teal-700 dark:text-emerald-400 font-medium mt-0.5">Your personal AI assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  title={voiceEnabled ? "Mute voice" : "Enable voice"}
                >
                  {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-gradient-to-b from-transparent to-white/5 dark:to-black/20">
              <AnimatePresence initial={false}>
                {displayMessages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    key={i}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl p-4 shadow-sm",
                        msg.role === "user"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-br-none border border-teal-400/30 shadow-teal-500/20"
                          : "bg-white/60 dark:bg-white/10 backdrop-blur-md text-gray-800 dark:text-gray-100 rounded-bl-none border border-white/40 dark:border-white/10"
                      )}
                    >
                      {msg.role === "model" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
                                  {children}
                                </a>
                              ),
                              strong: ({ children }) => <strong className="font-semibold text-teal-800 dark:text-teal-200">{children}</strong>,
                              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                              li: ({ children }) => <li>{children}</li>,
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl rounded-bl-none p-4 max-w-[80%] shadow-sm">
                      <div className="flex space-x-1.5 items-center h-4">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
              <div className="relative flex items-center group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask me about Sumit..."
                  className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-full pl-5 pr-24 py-3.5 text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all shadow-inner"
                />
                <div className="absolute right-2 flex items-center space-x-1">
                  <button
                    onClick={toggleListening}
                    disabled={isTyping}
                    className={cn(
                      "p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                      isListening 
                        ? "bg-red-100 text-red-500 dark:bg-red-500/20 animate-pulse" 
                        : "text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                    )}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    id="send-btn"
                    onClick={sendMessage}
                    disabled={!input.trim() || isTyping}
                    className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
