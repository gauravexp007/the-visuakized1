import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:  'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/25',
  secondary:'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300',
  ghost:    'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  danger:   'bg-rose-600 hover:bg-rose-700 text-white',
  success:  'bg-emerald-600 hover:bg-emerald-700 text-white',
  outline:  'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
};

const SIZES = {
  xs: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
  sm: 'text-sm px-3 py-2 rounded-xl gap-2',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-5 py-3 rounded-xl gap-2.5',
};

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false,
  icon: Icon, iconRight: IconRight,
  className = '', onClick, type = 'button',
  fullWidth = false,
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${VARIANTS[variant]} ${SIZES[size]}
                  ${fullWidth ? 'w-full' : ''}
                  ${className}`}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'xs' ? 13 : size === 'lg' ? 18 : 15} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={size === 'xs' ? 13 : 15} />}
    </motion.button>
  );
}
