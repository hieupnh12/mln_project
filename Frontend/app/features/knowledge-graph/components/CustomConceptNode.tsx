import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomConceptNode({ id, data, selected }: NodeProps) {
  const label = (data?.label as string) || 'Chưa có tiêu đề';
  const level = (data?.level as number) || 0;
  const cluster = (data?.cluster as number) !== undefined ? (data?.cluster as number) : -1;
  const hasChildren = !!data?.hasChildren;
  const isCollapsed = !!data?.isCollapsed;

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
  const direction = (data?.direction as 'left' | 'right' | undefined) || 'right';
  const isLeft = direction === 'left';

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
  const branchColor = data?.branchColor as string | undefined;

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
        relative flex items-center justify-center
        ${level === 0 ? 'aspect-square min-w-[96px] max-w-[180px] rounded-full p-4' : 'px-5 py-2 min-w-[60px] max-w-[300px] rounded-full'}
        ${branchColor ? '' : theme.bg}
        ${selected ? 'ring-4 ring-white/50 ring-offset-2 ring-offset-black/10' : ''}
      `}
      style={{
        backgroundColor: branchColor || undefined,
        color: branchColor ? '#111827' : undefined,
        boxShadow: selected ? '6px 6px 16px rgba(0,0,0,0.5)' : '4px 4px 8px rgba(0,0,0,0.4)',
      }}
    >
      {/* Handles with IDs for precise edge routing */}
      <Handle id="target-left" type="target" position={Position.Left} className="opacity-0 w-0 h-0" />
      <Handle id="source-left" type="source" position={Position.Left} className="opacity-0 w-0 h-0" />
      <Handle id="target-right" type="target" position={Position.Right} className="opacity-0 w-0 h-0" />
      <Handle id="source-right" type="source" position={Position.Right} className="opacity-0 w-0 h-0" />
      
      <Handle id="target-top" type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
      <Handle id="source-top" type="source" position={Position.Top} className="opacity-0 w-0 h-0" />
      <Handle id="target-bottom" type="target" position={Position.Bottom} className="opacity-0 w-0 h-0" />
      <Handle id="source-bottom" type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />

      <div className="flex flex-col gap-1.5 w-full">
        {isEditing ? (
          <textarea
            autoFocus
            value={localEditValue}
            onChange={(e) => setLocalEditValue(e.target.value)}
            onBlur={() => onSaveEdit?.(localEditValue)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSaveEdit?.(localEditValue);
              }
              if (e.key === 'Escape') onCancelEdit?.();
            }}
            rows={Math.max(2, Math.min(5, Math.ceil(localEditValue.length / 35)))}
            className="w-full bg-white/95 text-gray-900 px-2.5 py-1.5 rounded-md font-semibold outline-none ring-2 ring-blue-500/70 focus:ring-blue-600 border-none shadow-inner nodrag resize-none leading-snug text-sm"
          />
        ) : (
          <p className="leading-snug break-words font-semibold text-center">
            {label}
          </p>
        )}
      </div>

      {/* Toggle Collapse/Expand Button */}
      {hasChildren && onToggleCollapse && (
        <div className={`absolute ${isLeft ? '-left-3' : '-right-3'} top-1/2 -translate-y-1/2 z-10 nodrag`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(id);
            }}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-[var(--color-outline-variant)] shadow-xs text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
            type="button"
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {isLeft ? (
              isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />
            ) : (
              isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
