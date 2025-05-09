import React, { useState } from 'react';

const TagInput = ({ tags, onChange }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newTags = [...tags, input.trim()];
      setInput('');
      onChange(newTags);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      const newTags = tags.slice(0, -1);
      onChange(newTags);
    }
  };


  return (
    <div className="flex flex-wrap items-center gap-2 border px-3 py-2 rounded w-full">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
        >
          {tag}
        </span>
      ))}
      <input
        className="flex-grow text-sm outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter"
      />
    </div>
  );
};

export default TagInput;
