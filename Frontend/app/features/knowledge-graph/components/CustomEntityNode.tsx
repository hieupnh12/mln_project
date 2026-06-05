import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { MindmapNode } from '../types';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function CustomEntityNode({ id, data, selected, isConnectable }: NodeProps<MindmapNode>) {
  // Determine icon and color based on entity type
  const isChapter = data.entityType === 'CHAPTER';
  const { setNodes } = useReactFlow();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(data.title || '');
  }, [data.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isConnectable) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    if (title !== data.title) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, title },
            };
          }
          return node;
        })
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(data.title || '');
      setIsEditing(false);
    }
  };

  const bgColor = (data as any).branchColor || 'var(--color-surface-container-highest)';
  const textColor = (data as any).branchColor ? '#ffffff' : 'var(--color-on-surface)';

  return (
    <div 
      className={`
        relative px-5 py-3 w-[280px] rounded-full
        transition-all duration-200 flex items-center justify-center
        ${selected ? 'ring-4 ring-white/50 ring-offset-2 ring-offset-black/10' : ''}
      `}
      style={{
        backgroundColor: bgColor,
        boxShadow: selected ? '0 10px 25px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.1)',
        color: textColor,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Handles for connections are now hidden at the bottom */}

      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
          style={{
            backgroundColor: isChapter ? 'var(--color-secondary-container)' : 'var(--color-primary-fixed)',
            color: isChapter ? 'var(--color-on-secondary-container)' : 'var(--color-on-primary-fixed)'
          }}
        >
          {isChapter ? <BookOpen size={16} /> : <GraduationCap size={16} />}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <span 
            className="text-[10px] uppercase font-bold tracking-wider opacity-80"
          >
            {isChapter ? 'Chương' : 'Bài học'}
          </span>
          
          {isEditing ? (
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="font-medium text-[var(--text-label-md)] leading-tight mt-0.5 bg-white border border-[var(--color-outline)] rounded px-1 w-full outline-none focus:border-[var(--color-secondary)]"
            />
          ) : (
            <span 
              className="font-medium text-[var(--text-label-md)] leading-tight mt-0.5 line-clamp-2"
              title={data.title}
            >
              {data.title || 'Chưa có tiêu đề'}
            </span>
          )}
        </div>
      </div>

      {/* Handles with IDs for precise edge routing */}
      <Handle id="target-left" type="target" position={Position.Left} className="opacity-0 w-0 h-0" />
      <Handle id="source-left" type="source" position={Position.Left} className="opacity-0 w-0 h-0" />
      <Handle id="target-right" type="target" position={Position.Right} className="opacity-0 w-0 h-0" />
      <Handle id="source-right" type="source" position={Position.Right} className="opacity-0 w-0 h-0" />
      
      <Handle id="target-top" type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
      <Handle id="source-top" type="source" position={Position.Top} className="opacity-0 w-0 h-0" />
      <Handle id="target-bottom" type="target" position={Position.Bottom} className="opacity-0 w-0 h-0" />
      <Handle id="source-bottom" type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />
    </div>
  );
}
