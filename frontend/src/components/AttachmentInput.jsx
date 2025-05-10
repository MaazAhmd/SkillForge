import React, { useState, useRef } from 'react';
import { Image, File, Paperclip } from 'lucide-react';

const AttachmentInput = ({ onFileSelect }) => {
  const [mode, setMode] = useState(null); // 'image' | 'file' 
  const inputRef = useRef();

  const chooseMode = m => {
    setMode(m);
    setTimeout(() => inputRef.current?.click(), 0);
  };

  const handleChange = e => {
    const file = e.target.files[0];
    if (file) onFileSelect({ file, mode });
    setMode(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMode(mode ? null : 'choose')}
        className="mr-2 p-1 hover:bg-gray-200 rounded"
      >
        <Paperclip size={20} />
      </button>

      {mode === 'choose' && (
        <div className="absolute bg-white border rounded p-2 flex space-x-2 shadow">
          <button onClick={() => chooseMode('image')} title="Image">
            <Image size={24} />
          </button>
          <button onClick={() => chooseMode('file')} title="File">
            <File size={24} />
          </button>
        </div>
      )}

      {(mode === 'image' || mode === 'file') && (
        <input
          ref={inputRef}
          type="file"
          accept={mode === 'image' ? 'image/*' : '*/*'}
          className="hidden"
          onChange={handleChange}
          onClick={e => e.target.value = null}
        />
      )}
    </div>
  );
};

export default AttachmentInput;