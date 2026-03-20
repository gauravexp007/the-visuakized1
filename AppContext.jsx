import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Clock, Flame, Target, TrendingUp, BookOpen, Code2,
  Lightbulb, ChevronRight, Star, Calendar, Zap,
} from 'lucide-react';
import Card, { StatCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
  dailyStudyData, platformDistribution, weeklyTrend, aiSuggestions,
} from '../data/mockData';
import { useApp } from '../context/AppContext';

// ── Animation helpers ────────────────────────────────────────────────────────
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

// ── Custom tooltip for charts ────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-xs">
          {p.name}: <span className="font-bold">{p.value}{p.unit || ''}</span>
        </p>
      ))}
    </div>
  );
}

// ── Progress ring ────────────────────────────────────────────────────────────
function ProgressRing({ value, max, size = 120, strokeWidth = 10, color = '#6366f1' }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="currentColor" strokeWidth={strokeWidth}
        className="text-slate-200 dark:text-slate-800" />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - pct) }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
}

// ── AI Suggestion card ───────────────────────────────────────────────────────
function SuggestionCard({ s, delay }) {
  const icons = { BookOpen, Code2, Lightbulb };
  const Icon = icons[s.icon] || Lightbulb;
  const styles = {
    warning: { bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900', icon: 'text-amber-500', dot: 'bg-amber-500' },
    success: { bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900', icon: 'text-emerald-500', dot: 'bg-emerald-500' },
    info:    { bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900', icon: 'text-blue-500', dot: 'bg-blue-500' },
  };
  const st = styles[s.type];
  return (
    <motion.div {...fadeIn(delay)} className={`p-4 rounded-xl border ${st.bg} flex gap-3`}>
      <div className={`p-2 rounded-lg bg-white dark:bg-slate-900/50 ${st.icon} shrink-0`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{s.title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">{s.body}</p>
      </div>
    </motion.div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { studyGoal, todayHours, streak } = useApp();
  const totalWeekHours = dailyStudyData.reduce((s, d) => s + d.hours, 0).toFixed(1);
  const avgDay = (totalWeekHours / 7).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div {...fadeIn(0)}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-6 text-white">
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-indigo-200 text-sm mb-1 flex items-center gap-1">
                <Calendar size={13} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h2 className="text-2xl font-bold mb-1">Good morning, Alex! 👋</h2>
              <p className="text-indigo-200 text-sm">You're on a {streak}-day streak. Keep it up!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <ProgressRing value={todayHours} max={studyGoal} size={96} strokeWidth={8} color="#fff" />
                <div className="absolute text-center">
                  <p className="text-xl font-bold leading-tight">{todayHours}h</p>
                  <p className="text-xs text-indigo-200">/ {studyGoal}h</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-indigo-200">Today's Goal</p>
                <p className="text-lg font-bold">{Math.round((todayHours/studyGoal)*100)}%</p>
                <Badge variant="default" className="bg-white/20 text-white text-xs mt-1">
                  {todayHours >= studyGoal ? '✓ Achieved' : `${(studyGoal - todayHours).toFixed(1)}h left`}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock,       label: 'Today',         value: `${todayHours}h`, sub: `Goal: ${studyGoal}h`, color: 'indigo', trend: 12 },
          { icon: Flame,       label: 'Day Streak',    value: `${streak} days`, sub: 'Personal best!', color: 'amber', trend: 0 },
          { icon: Target,      label: 'Weekly Hours',  value: `${totalWeekHours}h`, sub: `Avg ${avgDay}h/day`, color: 'emerald', trend: 8 },
          { icon: TrendingUp,  label: 'Progress Score',value: '84%', sub: 'Week 4 performance', color: 'purple', trend: 16 },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeIn(i * 0.08)}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <motion.div {...fadeIn(0.2)} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Daily Study Hours</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This week — breakdown by activity</p>
              </div>
              <Badge variant="indigo">
                <Zap size={10} /> {totalWeekHours}h total
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyStudyData} barSize={22} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 6 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="coding"  name="Coding"  fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="reading" name="Reading" fill="#8b5cf6" radius={[4,4,0,0]} />
                <Bar dataKey="videos"  name="Videos"  fill="#06b6d4" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Pie chart */}
        <motion.div {...fadeIn(0.3)}>
          <Card className="h-full">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Time Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Platform breakdown</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={platformDistribution}
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {platformDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Share']}
                  contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.95)', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {platformDistribution.map(p => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{p.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{p.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Progress trend + AI suggestions */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Line chart */}
        <motion.div {...fadeIn(0.35)}>
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Progress Trend</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Monthly performance score</p>
              </div>
              <Badge variant="success">↑ 22 pts this month</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone" dataKey="score" name="Score" unit="%"
                  stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* AI suggestions */}
        <motion.div {...fadeIn(0.4)}>
          <Card className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Star size={14} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">AI Suggestions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personalized recommendations</p>
              </div>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((s, i) => (
                <SuggestionCard key={s.id} s={s} delay={0.45 + i * 0.08} />
              ))}
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium py-2">
              View all suggestions <ChevronRight size={13} />
            </button>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div {...fadeIn(0.5)}>
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Uploaded PDF', detail: 'Introduction to Machine Learning.pdf', time: '2h ago', color: 'indigo' },
              { action: 'Completed Quiz',detail: 'Neural Networks — 9/10 correct',      time: '3h ago', color: 'emerald' },
              { action: 'Chatbot Q&A',   detail: '12 questions answered in a session',  time: '4h ago', color: 'purple' },
              { action: 'Email Replied', detail: 'Interview invitation from TechCorp',  time: '5h ago', color: 'cyan' },
              { action: 'Study session', detail: 'React.js — 1h 30m',                  time: 'Yesterday', color: 'amber' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className={`w-2 h-2 rounded-full shrink-0 bg-${a.color}-500`} style={{ background: { indigo:'#6366f1', emerald:'#10b981', purple:'#8b5cf6', cyan:'#06b6d4', amber:'#f59e0b' }[a.color] }} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{a.action}: </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{a.detail}</span>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
