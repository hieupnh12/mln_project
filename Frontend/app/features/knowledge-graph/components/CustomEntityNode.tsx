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

  return (
    <div 
      className={`
        relative px-4 py-3 min-w-[180px] rounded-[var(--radius-lg)] 
        transition-all duration-200 
        ${selected ? 'ring-2 ring-[var(--color-secondary)] ring-offset-2' : ''}
      `}
      style={{
        backgroundColor: 'var(--color-surface-container-highest)',
        border: '1px solid var(--color-outline-variant)',
        boxShadow: selected ? '0 10px 25px rgba(35, 39, 51, 0.1)' : '0 4px 6px rgba(35, 39, 51, 0.05)',
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Top Handle for incoming connections */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 border-2 border-white bg-[var(--color-secondary)]" 
      />

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
            className="text-[10px] uppercase font-bold tracking-wider"
            style={{ color: 'var(--color-outline)' }}
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
              style={{ color: 'var(--color-on-surface)' }}
              title={data.title}
            >
              {data.title || 'Chưa có tiêu đề'}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Handle for outgoing connections */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 border-2 border-white bg-[var(--color-secondary)]" 
      />
    </div>
  );
}
