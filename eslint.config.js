import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, RefreshCw, Star, Trash2, Reply, Send, AlertTriangle,
  CheckCircle2, Inbox, Sparkles, ChevronRight, Edit3, X,
  Filter, Search, Tag,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';

// ── Category config ──────────────────────────────────────────────────────────
const CAT_CONFIG = {
  important: { label: 'Important', color: 'danger',  icon: AlertTriangle, dot: '#ef4444' },
  normal:    { label: 'Normal',    color: 'default', icon: Mail,          dot: '#94a3b8' },
  spam:      { label: 'Spam',      color: 'warning', icon: Trash2,        dot: '#f59e0b' },
};

// ── Tone options for replies ─────────────────────────────────────────────────
const TONE_REPLIES = {
  formal: {
    1: `Dear Professor Johnson,\n\nThank you for the update regarding the extended deadline for Assignment 3. I appreciate the additional time and will ensure my submission is complete and well-reviewed before April 5th at 11:59 PM.\n\nBest regards,\nAlex`,
    2: `Dear TechCorp Recruiting Team,\n\nThank you for considering my application and extending this interview invitation. I am very interested in the Software Engineer position and would be delighted to proceed with the technical interview. I will review the available time slots and confirm my preference shortly.\n\nKind regards,\nAlex`,
    5: `Hi,\n\nThank you for notifying me about the new pull request. I will review "Add dark mode support" at my earliest convenience and provide feedback.\n\nBest,\nAlex`,
  },
  casual: {
    1: `Hey Prof. Johnson,\n\nThanks for the heads-up about the deadline extension! That's really helpful. I'll make sure to submit before April 5th.\n\nCheers,\nAlex`,
    2: `Hi TechCorp team,\n\nThanks so much for reaching out! I'd love to interview for the Software Engineer role. I'll pick a time slot from the link soon.\n\nLooking forward to it!\nAlex`,
    5: `Hey,\n\nCool, I'll check out the dark mode PR when I get a chance!\n\nAlex`,
  },
  concise: {
    1: `Noted — will submit Assignment 3 before April 5th. Thank you.`,
    2: `Thank you for the invitation. I'll select a time slot shortly.`,
    5: `Thanks! Will review the PR soon.`,
  },
};

// ── Email list item ──────────────────────────────────────────────────────────
function EmailItem({ email, isSelected, onClick }) {
  const cat = CAT_CONFIG[email.category];
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800/80 last:border-0
                  ${isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
    >
      <div className="relative mt-1 shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-white text-sm font-bold">
          {email.fromName.charAt(0)}
        </div>
        {!email.read && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm truncate ${!email.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
            {email.fromName}
          </span>
          <span className="text-xs text-slate-400 shrink-0">{email.time}</span>
        </div>
        <p className={`text-sm truncate mb-1 ${!email.read ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
          {email.subject}
        </p>
        <p className="text-xs text-slate-400 truncate">{email.preview}</p>
      </div>

      <div className="shrink-0">
        <span className="w-2 h-2 rounded-full block mt-1.5" style={{ background: cat.dot }} />
      </div>
    </motion.div>
  );
}

// ── Reply composer ───────────────────────────────────────────────────────────
function ReplyComposer({ email, onClose, onSend }) {
  const [tone, setTone] = useState('formal');
  const [body, setBody] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sent, setSent] = useState(false);

  const generateReply = () => {
    setGenerating(true);
    setTimeout(() => {
      const reply = TONE_REPLIES[tone]?.[email.id] || `Thank you for your email regarding "${email.subject}". I will follow up shortly.\n\nBest regards,\nAlex`;
      setBody(reply);
      setGenerating(false);
    }, 1000);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onSend(); onClose(); }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="border-t border-slate-200 dark:border-slate-800 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1">
          <Reply size={15} className="text-indigo-500" /> Reply to {email.fromName}
        </p>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={16} />
        </button>
      </div>

      {/* Tone selector */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-500 dark:text-slate-400">Tone:</span>
        {['formal', 'casual', 'concise'].map(t => (
          <button key={t} onClick={() => setTone(t)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
              tone === t
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}>
            {t}
          </button>
        ))}
        <Button variant="outline" size="xs" icon={Sparkles} loading={generating} onClick={generateReply} className="ml-auto">
          Generate
        </Button>
      </div>

      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Click 'Generate' to create an AI reply, or write your own…"
        rows={6}
        className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
      />

      <div className="flex items-center justify-end gap-2 mt-3">
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        {sent
          ? <Button variant="success" size="sm" icon={CheckCircle2}>Sent!</Button>
          : <Button variant="primary" size="sm" icon={Send} onClick={handleSend} disabled={!body.trim()}>Send Reply</Button>
        }
      </div>
    </motion.div>
  );
}

// ── Email detail view ────────────────────────────────────────────────────────
function EmailDetail({ email, onBack }) {
  const [showReply, setShowReply] = useState(false);
  const cat = CAT_CONFIG[email.category];
  const Icon = cat.icon;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-y-2">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 lg:hidden">
          <ChevronRight size={16} className="rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{email.subject}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">From: {email.from} · {email.date}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={cat.color}>
            <Icon size={10} /> {cat.label}
          </Badge>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <Star size={15} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* AI Summary */}
      {email.category === 'important' && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={13} className="text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">AI Summary</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">{email.summary}</p>
        </motion.div>
      )}

      {/* Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
          {email.body}
        </pre>
      </div>

      {/* Reply area */}
      <AnimatePresence>
        {showReply && (
          <ReplyComposer email={email} onClose={() => setShowReply(false)} onSend={() => setShowReply(false)} />
        )}
      </AnimatePresence>

      {/* Actions footer */}
      {!showReply && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Button variant="primary" size="sm" icon={Reply} onClick={() => setShowReply(true)}>
            Reply with AI
          </Button>
          <Button variant="outline" size="sm" icon={Edit3}>
            Compose
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Main Email Assistant ─────────────────────────────────────────────────────
export default function EmailAssistant() {
  const { emails, emailsLoading, fetchEmails, markEmailRead } = useApp();
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (emails.length === 0) fetchEmails();
  }, []);

  const filtered = emails.filter(e => {
    if (filter !== 'all' && e.category !== filter) return false;
    if (search && !e.subject.toLowerCase().includes(search.toLowerCase()) &&
        !e.fromName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = emails.find(e => e.id === selectedId);
  const unreadCount = emails.filter(e => !e.read).length;
  const importantCount = emails.filter(e => e.category === 'important').length;
  const spamCount = emails.filter(e => e.category === 'spam').length;

  const handleSelect = (email) => {
    setSelectedId(email.id);
    markEmailRead(email.id);
  };

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Inbox,         label: 'Total',     value: emails.length, color: 'indigo' },
          { icon: AlertTriangle, label: 'Important', value: importantCount, color: 'rose' },
          { icon: Trash2,        label: 'Spam',      value: spamCount,     color: 'amber' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card hover>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  { indigo:'bg-indigo-50 dark:bg-indigo-950/40', rose:'bg-rose-50 dark:bg-rose-950/40', amber:'bg-amber-50 dark:bg-amber-950/40' }[s.color]
                }`}>
                  <s.icon size={16} style={{ color: { indigo:'#6366f1', rose:'#ef4444', amber:'#f59e0b' }[s.color] }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main panel */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="!p-0 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Left: email list */}
            <div className={`flex flex-col border-r border-slate-200 dark:border-slate-800 ${selected ? 'hidden lg:flex lg:w-80 xl:w-96' : 'w-full lg:w-80 xl:w-96'}`}>
              {/* Toolbar */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search emails…"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg outline-none focus:ring-1 ring-indigo-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                    />
                  </div>
                  <button onClick={fetchEmails}
                    className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors ${emailsLoading ? 'animate-spin' : ''}`}>
                    <RefreshCw size={15} />
                  </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1">
                  {[
                    { key: 'all',       label: 'All',       count: emails.length },
                    { key: 'important', label: 'Important', count: importantCount },
                    { key: 'normal',    label: 'Normal',    count: emails.filter(e=>e.category==='normal').length },
                    { key: 'spam',      label: 'Spam',      count: spamCount },
                  ].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filter === f.key
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}>
                      {f.label} {f.count > 0 && <span className={`ml-0.5 ${filter===f.key?'opacity-80':'opacity-60'}`}>({f.count})</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email list */}
              <div className="flex-1 overflow-y-auto">
                {emailsLoading ? (
                  <div className="space-y-3 p-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex gap-3">
                        <div className="w-9 h-9 rounded-full shimmer shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 shimmer rounded w-3/4" />
                          <div className="h-3 shimmer rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Inbox size={36} className="text-slate-300 dark:text-slate-700 mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No emails found</p>
                  </div>
                ) : (
                  filtered.map(email => (
                    <EmailItem
                      key={email.id}
                      email={email}
                      isSelected={email.id === selectedId}
                      onClick={() => handleSelect(email)}
                    />
                  ))
                )}
              </div>

              {/* Unread badge */}
              {unreadCount > 0 && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{unreadCount} unread</span> emails
                  </p>
                </div>
              )}
            </div>

            {/* Right: detail pane */}
            <div className={`flex-1 flex flex-col ${!selected ? 'hidden lg:flex' : 'flex'}`}>
              {selected ? (
                <EmailDetail email={selected} onBack={() => setSelectedId(null)} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-4">
                    <Mail size={36} className="text-indigo-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Select an email</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                    Choose an email from the list to read it and generate AI-powered replies
                  </p>
                  <div className="mt-6 flex gap-2 flex-wrap justify-center">
                    <Badge variant="indigo"><Sparkles size={10} /> AI Summarization</Badge>
                    <Badge variant="indigo"><Reply size={10} /> Auto-Reply</Badge>
                    <Badge variant="indigo"><Tag size={10} /> Smart Classify</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
