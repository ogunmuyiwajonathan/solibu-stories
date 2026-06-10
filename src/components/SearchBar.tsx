import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search novels...', className = '' }: SearchBarProps) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D7C5A3] transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 bg-[#241A13] border border-[#5D4A36] rounded-full text-[#F4E8D5] placeholder:text-[#A88F6C] focus:outline-none focus:border-[#C89B5A] focus:ring-2 focus:ring-[#C89B5A]/20 transition-all duration-300 shadow-inner"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A88F6C] hover:text-[#F4E8D5] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

