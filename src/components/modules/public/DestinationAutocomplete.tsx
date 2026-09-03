import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Train, 
  Bus, 
  Plane, 
  X, 
  Check, 
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { TransportDestination, searchDestinations } from '../../../data/transportDestinations';

interface DestinationAutocompleteProps {
  id: string;
  label: string;
  sublabel?: string;
  value: string;
  onChange: (value: string) => void;
  mode: 'Train' | 'Bus' | 'Flight';
  placeholder?: string;
  required?: boolean;
}

export const DestinationAutocomplete: React.FC<DestinationAutocompleteProps> = ({
  id,
  label,
  sublabel,
  value,
  onChange,
  mode,
  placeholder,
  required = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<TransportDestination[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLUListElement | null>(null);

  // Sync internal query when value prop changes from parent (e.g. Swap or Route Chips)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Query search service whenever query or mode changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    searchDestinations(query, mode).then((results) => {
      if (!isCancelled) {
        setSuggestions(results);
        setIsLoading(false);
        setHighlightedIndex(-1);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [query, mode]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (dest: TransportDestination) => {
    const formatted = dest.code ? `${dest.name} (${dest.code})` : dest.name;
    setQuery(formatted);
    onChange(formatted);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Helper for mode-specific icon & badge
  const renderModeIcon = () => {
    if (mode === 'Train') return <Train className="w-3.5 h-3.5 text-emerald-600" />;
    if (mode === 'Bus') return <Bus className="w-3.5 h-3.5 text-blue-600" />;
    return <Plane className="w-3.5 h-3.5 text-indigo-600" />;
  };

  const getModeTypeName = () => {
    if (mode === 'Train') return 'Station';
    if (mode === 'Bus') return 'Bus Terminal';
    return 'Airport / City';
  };

  // Highlight matching letters in text
  const highlightMatch = (text: string, q: string) => {
    if (!q || !q.trim()) return text;
    const regex = new RegExp(`(${q.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === q.trim().toLowerCase() ? (
        <span key={i} className="bg-amber-200 text-gray-950 font-black px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className="relative space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-[11px] font-black uppercase text-gray-700">
          {label} {required && '*'}
        </label>
        {sublabel && (
          <span className="text-[10px] text-emerald-700 font-semibold">{sublabel}</span>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        <input
          id={id}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${id}-suggestions`}
          required={required}
          value={query}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            onChange(next);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            (mode === 'Train'
              ? 'Type station name or city (e.g. M, Mumbai, Delhi)...'
              : mode === 'Bus'
              ? 'Type bus stand or city (e.g. M, Manali, Pune)...'
              : 'Type airport, city or country (e.g. D, Dubai, Delhi)...')
          }
          className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 focus:border-[#009E73] focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm font-bold text-gray-900 bg-white shadow-2xs transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title="Clear destination"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-2xl border-2 border-emerald-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-98 duration-150">
          {/* Header Bar */}
          <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              {renderModeIcon()}
              <span>{mode} Suggestions ({suggestions.length})</span>
            </span>
            <span className="text-emerald-700">Type letters to filter</span>
          </div>

          {suggestions.length > 0 ? (
            <ul
              id={`${id}-suggestions`}
              ref={listboxRef}
              role="listbox"
              className="max-h-60 overflow-y-auto divide-y divide-gray-100 py-1 focus:outline-hidden"
            >
              {suggestions.map((dest, idx) => {
                const isSelected = value.includes(dest.name);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={dest.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(dest)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isHighlighted
                        ? 'bg-emerald-50 text-emerald-950'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                        {renderModeIcon()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-gray-900 truncate flex items-center gap-1.5">
                          <span>{highlightMatch(dest.name, query)}</span>
                          {dest.code && (
                            <span className="px-1.5 py-0.2 rounded bg-gray-200 text-gray-700 text-[10px] font-mono font-bold">
                              {dest.code}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {dest.city}, {dest.stateOrCountry} • <span className="text-[10px] font-medium text-gray-400">{getModeTypeName()}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#009E73] shrink-0" />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                No {mode.toLowerCase()} destinations found for "{query}"
              </p>
              <p className="text-[11px] text-gray-400">
                Try searching by city name (e.g. Mumbai, Delhi, Pune, Dubai)
              </p>
            </div>
          )}

          {/* Footer Bar */}
          <div className="bg-gray-50/80 px-3 py-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
            <span>Press <kbd className="font-mono bg-white border border-gray-200 px-1 rounded">↑</kbd> <kbd className="font-mono bg-white border border-gray-200 px-1 rounded">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-white border border-gray-200 px-1 rounded">Enter</kbd> to select</span>
          </div>
        </div>
      )}
    </div>
  );
};
