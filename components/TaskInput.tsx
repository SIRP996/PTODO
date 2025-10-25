import React, { useState, KeyboardEvent } from 'react';
import { Plus, X, Flag } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (text: string, tags: string[], dueDate: string | null, isUrgent: boolean, recurrenceRule: 'none' | 'daily' | 'weekly' | 'monthly') => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim().toLowerCase())) {
        setTags([...tags, currentTag.trim().toLowerCase()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text, tags, dueDate || null, isUrgent, recurrenceRule);
      setText('');
      setDueDate('');
      setTags([]);
      setCurrentTag('');
      setIsUrgent(false);
      setRecurrenceRule('none');
    }
  };
  
  const recurrenceOptions: Array<{id: 'none' | 'daily' | 'weekly' | 'monthly', label: string}> = [
      { id: 'none', label: 'Không lặp lại'},
      { id: 'daily', label: 'Hàng ngày'},
      { id: 'weekly', label: 'Hàng tuần'},
      { id: 'monthly', label: 'Hàng tháng'},
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-content" className="block text-sm font-medium text-slate-400 mb-1">Nội dung công việc</label>
        <textarea
          id="task-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ví dụ: Lên kế hoạch cho dự án mới..."
          className="w-full bg-[#293548] text-slate-200 border border-indigo-600 focus:border-indigo-500 focus:ring-0 rounded-lg px-4 py-2 transition"
          rows={3}
        />
      </div>
      
      <div>
        <label htmlFor="task-tags" className="block text-sm font-medium text-slate-400 mb-1">Thẻ (gõ rồi nhấn Enter)</label>
        <div className="flex flex-wrap items-center gap-2 p-2 bg-[#293548] border border-indigo-600 rounded-lg focus-within:border-indigo-500">
            {tags.map(tag => (
              <span key={tag} className="flex items-center bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 text-indigo-200 hover:text-white">
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              id="task-tags"
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length > 0 ? '' : 'Thêm thẻ...'}
              className="flex-grow bg-transparent focus:ring-0 border-0 p-0 text-sm"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="task-duedate" className="block text-sm font-medium text-slate-400 mb-1">Thời hạn (bắt buộc cho lặp lại)</label>
          <input
            id="task-duedate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-[#293548] text-slate-200 border border-indigo-600 focus:border-indigo-500 focus:ring-0 rounded-lg px-4 py-2 transition"
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Quy tắc lặp lại</label>
            <div className="flex items-center gap-1 p-1 bg-slate-900/50 border border-slate-700 rounded-lg">
                {recurrenceOptions.map(opt => (
                     <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRecurrenceRule(opt.id)}
                        disabled={!dueDate && opt.id !== 'none'}
                        className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed
                            ${recurrenceRule === opt.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-700'}`
                        }
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-2 pt-2">
            <button 
                type="button"
                onClick={() => setIsUrgent(!isUrgent)}
                className={`p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 ${isUrgent && '!bg-red-600 !text-white'}`}
                title="Đánh dấu là GẤP"
            >
                <Flag size={20} />
            </button>
            <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 disabled:bg-indigo-800 disabled:cursor-not-allowed"
                disabled={!text.trim() || (recurrenceRule !== 'none' && !dueDate)}
            >
                <Plus size={20} />
                <span>Thêm</span>
            </button>
      </div>
    </form>
  );
};

export default TaskInput;