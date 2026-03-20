import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, gradient = false, onClick }) {
  const base = `rounded-2xl border border-slate-200 dark:border-slate-800
    bg-white dark:bg-slate-900 p-5 ${hover ? 'card-hover cursor-pointer' : ''}
    ${gradient ? 'bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50' : ''}
    ${className}`;

  if (onClick) {
    return (
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={`${base} text-left w-full`}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <div className={base}>
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, sub, color = 'indigo', trend }) {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    cyan:   'from-cyan-500 to-cyan-600',
    emerald:'from-emerald-500 to-emerald-600',
    amber:  'from-amber-500 to-amber-600',
    rose:   'from-rose-500 to-rose-600',
  };
  const bgs = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40',
    purple: 'bg-purple-50 dark:bg-purple-950/40',
    cyan:   'bg-cyan-50 dark:bg-cyan-950/40',
    emerald:'bg-emerald-50 dark:bg-emerald-950/40',
    amber:  'bg-amber-50 dark:bg-amber-950/40',
    rose:   'bg-rose-50 dark:bg-rose-950/40',
  };

  return (
    <Card hover className="card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${bgs[color]}`}>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-sm`}>
            <Icon size={16} className="text-white" />
          </div>
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend >= 0
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
          }`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">{sub}</p>}
    </Card>
  );
}
