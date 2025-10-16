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
  minSearchLength?: number; // Minimum characters before showing results
  maxResults?: number; // Maximum number of results to display
  searchPrompt?: string; // Message to show before minimum search length
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className = "",
  emptyMessage = "No options available",
  minSearchLength = 0,
  maxResults = 100,
  searchPrompt = "Start typing to search..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search term - wait 300ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter options based on debounced search term with memoization
  const filteredOptions = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm.trim();
    
    // If search term is below minimum length, return empty array (will show prompt)
    if (minSearchLength > 0 && trimmedSearch.length < minSearchLength) {
      return [];
    }
    
    // If no search term and minSearchLength is 0, show all options (original behavior)
    if (!trimmedSearch && minSearchLength === 0) {
      return options.slice(0, maxResults);
    }

    const lowerSearch = trimmedSearch.toLowerCase();
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(lowerSearch)
    );

    // Debug logging
    console.log('🔍 SearchableSelect - Debounced search term:', debouncedSearchTerm);
    console.log('📊 SearchableSelect - Filtered count:', filtered.length, '/', options.length);
    console.log('📝 SearchableSelect - First 5 filtered:', filtered.slice(0, 5).map(o => o.label));

    // Limit results to prevent performance issues
    return filtered.slice(0, maxResults);
  }, [options, debouncedSearchTerm, minSearchLength, maxResults]);

  // Get selected option label
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setDebouncedSearchTerm("");
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
        setDebouncedSearchTerm("");
      }
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
      setDebouncedSearchTerm("");
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
            {searchTerm && searchTerm !== debouncedSearchTerm ? (
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 px-1 flex items-center space-x-1">
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching...</span>
              </p>
            ) : minSearchLength > 0 && debouncedSearchTerm.length < minSearchLength ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                Type at least {minSearchLength} characters to search ({options.length.toLocaleString()} options)
              </p>
            ) : filteredOptions.length > 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                Showing {filteredOptions.length}{filteredOptions.length === maxResults ? '+' : ''} of {options.length.toLocaleString()} options
              </p>
            ) : null}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-60">
            {minSearchLength > 0 && debouncedSearchTerm.length < minSearchLength ? (
              <div className="px-4 py-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchPrompt}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {options.length.toLocaleString()} options available
                </p>
              </div>
            ) : filteredOptions.length > 0 ? (
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
                {debouncedSearchTerm ? `No results found for "${debouncedSearchTerm}"` : emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
