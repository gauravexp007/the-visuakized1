import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts';
import {
  Upload, FileText, Sparkles, CheckCircle2, ChevronDown, ChevronUp,
  PlayCircle, BookOpen, HelpCircle, Brain, Zap, Download, Eye,
  ArrowRight, Copy, X, AlertCircle, BarChart2, TrendingUp,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';

// ── PIE colors ────────────────────────────────────────────────────────────────
const PIE_COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899'];

// ── Drop zone ─────────────────────────────────────────────────────────────────
function DropZone({ onFile }) {
  const onDrop = useCallback((files) => { if (files[0]) onFile(files[0]); }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
                  ${isDragActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'
                  }`}
    >
      <input {...getInputProps()} />
      <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} className="flex flex-col items-center gap-4">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors
                          ${isDragActive ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <Upload size={36} className={isDragActive ? 'text-indigo-500' : 'text-slate-400'} />
        </div>
        {isDragActive ? (
          <div>
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Drop your PDF here</p>
            <p className="text-sm text-indigo-500/70">Release to analyze</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Drag & drop a PDF file</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">or click to browse your files</p>
            <Button variant="primary" icon={Upload}>Choose PDF File</Button>
          </div>
        )}
        <p className="text-xs text-slate-400">Supports PDF up to 50MB · AI-powered analysis</p>
      </motion.div>
    </div>
  );
}

// ── Processing skeleton ───────────────────────────────────────────────────────
function ProcessingCard({ fileName }) {
  const steps = [
    'Extracting text content…',
    'Detecting topics & entities…',
    'Generating summary…',
    'Building flowchart & visualizations…',
    'Searching YouTube resources…',
  ];
  const [step] = useState(0);

  return (
    <Card>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
          <FileText size={24} className="text-indigo-500" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{fileName}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Processing with AI…</p>
        </div>
        <div className="ml-auto">
          <Sparkles size={20} className="text-indigo-500 spin-slow" />
        </div>
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
              i === step ? 'bg-indigo-100 dark:bg-indigo-900' : i < step ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              {i < step
                ? <CheckCircle2 size={12} className="text-emerald-500" />
                : i === step
                ? <div className="w-2 h-2 bg-indigo-500 rounded-full pulse-dot" />
                : <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
              }
            </div>
            <div className={`flex-1 h-2 rounded-full overflow-hidden ${i < step ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {i === step && <div className="h-full shimmer rounded-full" />}
              {i < step && <div className="h-full bg-emerald-500 rounded-full" />}
            </div>
            <span className={`text-xs w-52 ${i === step ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-400'}`}>{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {[0,1,2].map(i => (
          <motion.span key={i} className="w-2 h-2 bg-indigo-500 rounded-full"
            animate={{ y: [0,-6,0], opacity: [1,0.4,1] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </Card>
  );
}

// ── Collapsible section ───────────────────────────────────────────────────────
function Section({ title, icon: Icon, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between mb-0 group">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-indigo-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          {badge && <Badge variant="indigo">{badge}</Badge>}
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ── Flowchart ─────────────────────────────────────────────────────────────────
function Flowchart({ nodes }) {
  const typeStyles = {
    start:    'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-800 dark:text-emerald-300',
    end:      'bg-rose-100 dark:bg-rose-900/40 border-rose-400 text-rose-800 dark:text-rose-300',
    process:  'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 text-indigo-800 dark:text-indigo-300',
    decision: 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 text-amber-800 dark:text-amber-300',
  };
  return (
    <div className="flex flex-col items-center gap-0">
      {nodes.map((n, i) => (
        <div key={n.id} className="flex flex-col items-center">
          <div className={`px-6 py-3 rounded-xl border-2 text-sm font-semibold min-w-44 text-center
                           ${typeStyles[n.type] || typeStyles.process}`}>
            {n.label}
          </div>
          {i < nodes.length - 1 && (
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-5 bg-slate-300 dark:bg-slate-700" />
              <ArrowRight size={12} className="text-slate-400 rotate-90" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-slate-600 dark:text-slate-400">{p.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{p.value}{p.unit || ''}</span>
        </div>
      ))}
    </div>
  );
}

// ── PDF Visualization section ─────────────────────────────────────────────────
function PDFVisualization({ viz }) {
  if (!viz) return null;

  const { type, title, description, barData, pieData, lineData, radarData, insights } = viz;

  const renderChart = () => {
    if (type === 'pie' && pieData?.length) {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color || PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}`, n]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (type === 'line' && lineData?.length) {
      return (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={lineData}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'radar' && radarData?.length) {
      return (
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      );
    }

    // Default: bar chart
    const data = barData?.length ? barData : [];
    return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
            unit={data[0]?.unit || ''} />
          <Tooltip
            formatter={(v, n, p) => [`${v}${p.payload?.unit || ''}`, n]}
            contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }}
          />
          <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]}
            label={{ position: 'top', fontSize: 11, fill: '#94a3b8' }} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Section title={title || 'Document Visualization'} icon={BarChart2} badge="AI Generated" defaultOpen={true}>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
      )}
      <div className="mb-4">
        {renderChart()}
      </div>
      {insights?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Key Insights</p>
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <TrendingUp size={14} className="text-indigo-500 shrink-0 mt-0.5" />
              {insight}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ── Main PDF Analyzer ─────────────────────────────────────────────────────────
export default function PDFAnalyzer() {
  const { uploadedPDF, pdfProcessing, pdfResult, pdfError, processPDF } = useApp();
  const [activeTab, setActiveTab] = useState('short');
  const [copied, setCopied] = useState(false);

  const handleFile = (file) => { processPDF(file); };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => { window.location.reload(); };

  // ── No file yet ──
  if (!uploadedPDF && !pdfResult) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Brain,      label: 'AI Summarization',   desc: 'Short & detailed' },
            { icon: Zap,        label: 'ELI5 Simplifier',    desc: 'Plain English' },
            { icon: BarChart2,  label: 'Smart Visualizations', desc: 'Auto-generated charts' },
            { icon: PlayCircle, label: 'YouTube Links',       desc: 'Topic-based' },
          ].map(f => (
            <Card key={f.label} className="text-center py-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto mb-2">
                <f.icon size={20} className="text-indigo-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{f.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <DropZone onFile={handleFile} />
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Don't have a PDF? Try the demo:</p>
          <Button variant="outline" icon={Sparkles} onClick={() => handleFile({ name: 'Introduction_to_ML.pdf', size: 0 })}>
            Load Sample PDF
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Processing ──
  if (pdfProcessing) {
    return (
      <div className="max-w-2xl mx-auto">
        <ProcessingCard fileName={uploadedPDF?.name || 'document.pdf'} />
      </div>
    );
  }

  // ── Error state ──
  if (pdfError) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <div className="flex flex-col items-center gap-4 text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <AlertCircle size={28} className="text-rose-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">Analysis Failed</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{pdfError}</p>
            </div>
            <Button variant="primary" onClick={handleReset}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Results ──
  const r = pdfResult;
  return (
    <div className="space-y-4">
      {/* File header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <FileText size={24} className="text-rose-500" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{r.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="default">{r.pageCount} pages</Badge>
                  <Badge variant="default">{r.wordCount?.toLocaleString()} words</Badge>
                  {r.topics?.slice(0,2).map(t => <Badge key={t} variant="indigo">{t}</Badge>)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon={Download}>Export</Button>
              <Button variant="ghost" size="sm" icon={X} onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* AI Summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="AI Summary" icon={Brain} defaultOpen={true}>
          <div className="flex gap-2 mb-4">
            {['short', 'detailed', 'eli5'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}>
                {tab === 'eli5' ? 'ELI5' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button onClick={() => handleCopy(activeTab === 'eli5' ? r.eli5 : r.summary[activeTab])}
              className="ml-auto text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              {activeTab === 'eli5'
                ? <p>{r.eli5}</p>
                : r.summary[activeTab]?.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('**') ? 'font-semibold' : ''}
                      dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ))
              }
            </motion.div>
          </AnimatePresence>
        </Section>
      </motion.div>

      {/* Key concepts + Questions */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Section title="Key Concepts" icon={BookOpen} badge={`${r.keyPoints?.length}`} defaultOpen={true}>
            <ul className="space-y-2.5">
              {r.keyPoints?.map((kp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  {kp}
                </li>
              ))}
            </ul>
          </Section>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Section title="Important Questions" icon={HelpCircle} badge={`${r.importantQuestions?.length}`} defaultOpen={true}>
            <ol className="space-y-2.5">
              {r.importantQuestions?.map((q, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {i+1}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </Section>
        </motion.div>
      </div>

      {/* === VISUALIZATION SECTION === */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <PDFVisualization viz={r.visualization} />
      </motion.div>

      {/* Flowchart + Accuracy Chart */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Section title="Process Flowchart" icon={Eye} defaultOpen={false}>
            <div className="overflow-x-auto py-2">
              <Flowchart nodes={r.flowchart || []} />
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {[{c:'emerald',l:'Start/End'},{c:'indigo',l:'Process'},{c:'amber',l:'Decision'}].map(b => (
                <div key={b.l} className="flex items-center gap-1 text-xs text-slate-500">
                  <span className={`w-3 h-3 rounded-sm bg-${b.c}-200`} />
                  {b.l}
                </div>
              ))}
            </div>
          </Section>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Section title="Detected Data" icon={Zap} defaultOpen={false}>
            {r.numericalData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={r.numericalData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="algorithm" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip formatter={(v) => [`${v}%`, 'Score']} contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
                  <Bar dataKey="accuracy" fill="#6366f1" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">No numerical data detected</p>
            )}
          </Section>
        </motion.div>
      </div>

      {/* YouTube suggestions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Section title="Recommended YouTube Videos" icon={PlayCircle} badge="AI Curated" defaultOpen={true}>
          <div className="grid sm:grid-cols-2 gap-3">
            {r.youtubeVideos?.map((v, i) => {
              const youtubeUrl = v.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery || v.title)}`;
              return (
                <a
                  key={i}
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                    <PlayCircle size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{v.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{v.channel} · {v.duration} · {v.views} views</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-red-500 transition-colors shrink-0" />
                </a>
              );
            })}
          </div>
        </Section>
      </motion.div>
    </div>
  );
}
