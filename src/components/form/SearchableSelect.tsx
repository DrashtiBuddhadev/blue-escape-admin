import React, { useState, useRef, useEffect, useMemo } from "react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className = "",
  emptyMessage = "No options available"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term with memoization
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;

    const lowerSearch = searchTerm.toLowerCase().trim();
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(lowerSearch)
    );

    // Debug logging
    console.log('🔍 SearchableSelect - Search term:', searchTerm);
    console.log('📊 SearchableSelect - Filtered count:', filtered.length, '/', options.length);
    console.log('📝 SearchableSelect - First 5 filtered:', filtered.slice(0, 5).map(o => o.label));

    return filtered;
  }, [options, searchTerm]);

  // Get selected option label
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between ${className}`}
      >
        <span className={!value ? "text-gray-500 dark:text-gray-400" : ""}>
          {displayValue}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          key={filteredOptions.length}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {filteredOptions.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                Showing {filteredOptions.length} of {options.length} options
              </p>
            )}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-60">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={`${option.value}-${index}`}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    option.value === value
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                {searchTerm ? `No results found for "${searchTerm}"` : emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
