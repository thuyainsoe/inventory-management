import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectCellProps {
  value: string | null | undefined;
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SelectCell({ 
  value, 
  options,
  onValueChange,
  placeholder = "Select...",
  className = "min-w-[150px]",
  disabled = false
}: SelectCellProps) {
  if (!onValueChange) {
    // Read-only mode - just display the selected value
    const selectedOption = options.find(opt => opt.value === value);
    return (
      <div className={className}>
        {selectedOption?.label || '-'}
      </div>
    );
  }

  return (
    <div className={className}>
      <Select 
        value={value || ''} 
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}