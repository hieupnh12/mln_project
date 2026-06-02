import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomConceptNode({ id, data, selected }: NodeProps) {
  const label = (data?.label as string) || 'Chưa có tiêu đề';
  const level = (data?.level as number) || 0;
  const cluster = (data?.cluster as number) !== undefined ? (data?.cluster as number) : -1;
  const hasChildren = !!data?.hasChildren;
  const isCollapsed = !!data?.isCollapsed;
  const isCompleted = !!data?.isCompleted;

  const isEditing = !!data?.isEditing;
  const onSaveEdit = data?.onSaveEdit as ((label: string) => void) | undefined;
  const onCancelEdit = data?.onCancelEdit as (() => void) | undefined;
  const onDoubleClickEdit = data?.onDoubleClickEdit as (() => void) | undefined;

  const [localEditValue, setLocalEditValue] = useState(label);
  useEffect(() => {
    if (isEditing) setLocalEditValue(label);
  }, [isEditing, label]);
  const nodeRole = data?.nodeRole as string | undefined;
  const onToggleCollapse = data?.onToggleCollapse as ((id: string) => void) | undefined;

  // Determine styling based on Cluster & Level

  const getThemeStyles = () => {
    if (level === 0) {
      // Root Node style
      return {
        bg: 'bg-[var(--color-primary-container)] text-white border-2 border-[var(--color-primary)] font-bold shadow-lg',
        badge: 'bg-[var(--color-secondary)] text-[var(--color-secondary-fixed)]',
        badgeText: 'Nút gốc',
        handlesColor: 'bg-[var(--color-secondary)]',
      };
    }

    // Cluster based palette (Emerald, Amber, Indigo, Rose, Slate)
    const clusterIndex = cluster % 5;
    
    if (clusterIndex === 0) {
      // Emerald / Teal Theme
      if (level === 1) {
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 font-semibold shadow-sm',
          badge: 'bg-emerald-200 text-emerald-900',
          badgeText: 'Nhánh chính',
          handlesColor: 'bg-emerald-500',
        };
      }
      if (level === 2) {
        return {
          bg: 'bg-emerald-50 text-emerald-900 border border-emerald-300 text-sm shadow-xs',
          badge: 'bg-emerald-100 text-emerald-800',
          badgeText: 'Mục con',
          handlesColor: 'bg-emerald-400',
        };
      }
      return {
        bg: 'bg-emerald-50/40 text-emerald-800/90 border border-emerald-100 text-xs',
        badge: 'bg-emerald-50 text-emerald-700',
        badgeText: 'Ý chi tiết',
        handlesColor: 'bg-emerald-300',
      };
    }

    if (clusterIndex === 1) {
      // Amber / Gold Theme
      if (level === 1) {
        return {
          bg: 'bg-amber-100 text-amber-800 border-2 border-amber-400 font-semibold shadow-sm',
          badge: 'bg-amber-200 text-amber-900',
          badgeText: 'Nhánh chính',
          handlesColor: 'bg-amber-500',
        };
      }
      if (level === 2) {
        return {
          bg: 'bg-amber-50 text-amber-900 border border-amber-300 text-sm shadow-xs',
          badge: 'bg-amber-100 text-amber-800',
          badgeText: 'Mục con',
          handlesColor: 'bg-amber-400',
        };
      }
      return {
        bg: 'bg-amber-50/40 text-amber-800/90 border border-amber-100 text-xs',
        badge: 'bg-amber-50 text-amber-700',
        badgeText: 'Ý chi tiết',
        handlesColor: 'bg-amber-300',
      };
    }

    if (clusterIndex === 2) {
      // Indigo Theme
      if (level === 1) {
        return {
          bg: 'bg-indigo-100 text-indigo-800 border-2 border-indigo-400 font-semibold shadow-sm',
          badge: 'bg-indigo-200 text-indigo-900',
          badgeText: 'Nhánh chính',
          handlesColor: 'bg-indigo-500',
        };
      }
      if (level === 2) {
        return {
          bg: 'bg-indigo-50 text-indigo-900 border border-indigo-300 text-sm shadow-xs',
          badge: 'bg-indigo-100 text-indigo-800',
          badgeText: 'Mục con',
          handlesColor: 'bg-indigo-400',
        };
      }
      return {
        bg: 'bg-indigo-50/40 text-indigo-800/90 border border-indigo-100 text-xs',
        badge: 'bg-indigo-50 text-indigo-700',
        badgeText: 'Ý chi tiết',
        handlesColor: 'bg-indigo-300',
      };
    }

    if (clusterIndex === 3) {
      // Rose Theme
      if (level === 1) {
        return {
          bg: 'bg-rose-100 text-rose-800 border-2 border-rose-400 font-semibold shadow-sm',
          badge: 'bg-rose-200 text-rose-900',
          badgeText: 'Nhánh chính',
          handlesColor: 'bg-rose-500',
        };
      }
      if (level === 2) {
        return {
          bg: 'bg-rose-50 text-rose-900 border border-rose-300 text-sm shadow-xs',
          badge: 'bg-rose-100 text-rose-800',
          badgeText: 'Mục con',
          handlesColor: 'bg-rose-400',
        };
      }
      return {
        bg: 'bg-rose-50/40 text-rose-800/90 border border-rose-100 text-xs',
        badge: 'bg-rose-50 text-rose-700',
        badgeText: 'Ý chi tiết',
        handlesColor: 'bg-rose-300',
      };
    }

    // Default Slate Theme
    if (level === 1) {
      return {
        bg: 'bg-slate-100 text-slate-800 border-2 border-slate-400 font-semibold shadow-sm',
        badge: 'bg-slate-200 text-slate-900',
        badgeText: 'Nhánh chính',
        handlesColor: 'bg-slate-500',
      };
    }
    if (level === 2) {
      return {
        bg: 'bg-slate-50 text-slate-900 border border-slate-300 text-sm shadow-xs',
        badge: 'bg-slate-100 text-slate-800',
        badgeText: 'Mục con',
        handlesColor: 'bg-slate-400',
      };
    }
    return {
      bg: 'bg-slate-50/40 text-slate-800/90 border border-slate-100 text-xs',
      badge: 'bg-slate-50 text-slate-700',
      badgeText: 'Ý chi tiết',
      handlesColor: 'bg-slate-300',
      isPill: false,
    };
  };

  // Apply nodeRole overrides if present
  const getRoleBasedStyles = () => {
    const baseTheme = getThemeStyles();
    
    if (nodeRole === 'concept') {
      return { ...baseTheme, bg: 'bg-white text-blue-900 border-2 border-blue-400 shadow-sm' };
    }
    if (nodeRole === 'timeline') {
      return { ...baseTheme, bg: 'bg-white text-purple-900 border-2 border-purple-400 shadow-sm' };
    }
    if (nodeRole === 'example' || nodeRole === 'quote') {
      return { 
        ...baseTheme, 
        bg: 'bg-yellow-50 text-yellow-900 border border-yellow-300 shadow-xs italic', 
        isPill: true 
      };
    }
    return baseTheme;
  };

  const theme = getRoleBasedStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClickEdit?.();
      }}
      className={`
        relative px-4 py-3 min-w-[180px] max-w-[260px] 
        ${theme.isPill ? 'rounded-full px-6 py-2' : 'rounded-[var(--radius-lg)]'}
        ${theme.bg}
        ${selected ? 'ring-2 ring-[var(--color-secondary)] ring-offset-2' : ''}
        ${isCompleted ? 'ring-2 ring-emerald-500 border-emerald-500' : ''}
      `}
    >
      {/* Left Handle for incoming connections */}
      {level > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          className={`w-3 h-3 border-2 border-white ${theme.handlesColor}`}
        />
      )}

      {/* Completion checkmark */}
      {isCompleted && (
        <div className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm flex items-center justify-center w-5 h-5 z-10 animate-fade-up">
          <Check size={12} strokeWidth={3} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${theme.badge}`}>
            {theme.badgeText}
          </span>
          {level > 0 && (
            <span className="text-[9px] opacity-75 font-semibold">
              Cấp {level}
            </span>
          )}
        </div>

        {isEditing ? (
          <input
            autoFocus
            value={localEditValue}
            onChange={(e) => setLocalEditValue(e.target.value)}
            onBlur={() => onSaveEdit?.(localEditValue)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') onSaveEdit?.(localEditValue);
              if (e.key === 'Escape') onCancelEdit?.();
            }}
            className="w-full text-gray-900 px-1 py-0.5 rounded text-xs outline-none border border-blue-400 focus:border-blue-600 shadow-inner nodrag"
          />
        ) : (
          <p className="leading-snug break-words font-medium">
            {label}
          </p>
        )}
      </div>

      {/* Right Toggle Collapse/Expand Button */}
      {hasChildren && onToggleCollapse && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 nodrag">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(id);
            }}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-[var(--color-outline-variant)] shadow-xs text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
            type="button"
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      )}

      {/* Right Handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Right}
        className={`w-3 h-3 border-2 border-white ${theme.handlesColor}`}
      />
    </motion.div>
  );
}
