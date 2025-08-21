'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Business' },
  { value: 'finance', label: 'Finance' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'travel', label: 'Travel' },
];

interface MultiSelectCategoriesProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  placeholder?: string;
  className?: string;
  category: { value: string; label: string }[];
}

export function MultiSelectCategories({
  category,
  selectedCategories,
  onCategoriesChange,
  placeholder = 'Select categories...',
  className,
}: MultiSelectCategoriesProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (categoryValue: string) => {
    if (selectedCategories.includes(categoryValue)) {
      onCategoriesChange(
        selectedCategories.filter((cat) => cat !== categoryValue)
      );
    } else {
      onCategoriesChange([...selectedCategories, categoryValue]);
    }
  };

  const handleRemove = (categoryValue: string) => {
    onCategoriesChange(
      selectedCategories.filter((cat) => cat !== categoryValue)
    );
  };

  const selectedCategoryLabels = selectedCategories.map(
    (value) => categories.find((cat) => cat.value === value)?.label || value
  );

  return (
    <div className={cn('w-full', className)}>
      {/* <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild> */}
      <Button
        disabled
        type='button'
        variant='outline'
        role='combobox'
        // aria-expanded={open}
        className='w-full justify-between min-h-10 h-auto bg-transparent'
      >
        <div className='flex flex-wrap gap-1 flex-1'>
          {selectedCategories.length === 0 ? (
            <span className='text-muted-foreground font-normal'>
              {placeholder}
            </span>
          ) : (
            selectedCategories.map((categoryValue) => {
              const category = categories.find(
                (cat) => cat.value === categoryValue
              );
              return (
                <Badge
                  key={categoryValue}
                  variant='secondary'
                  className='text-xs'
                >
                  {category?.label || categoryValue}
                  <span
                    className='ml-1 cursor-pointer ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    role='button'
                    onClick={() => handleRemove(categoryValue)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                  </span>
                </Badge>
              );
            })
          )}
        </div>
        {/* <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' /> */}
      </Button>
      {/* </PopoverTrigger> */}
      {/* <PopoverContent className='w-full p-0' align='start'>
          <Command>
            <CommandInput placeholder='Search categories...' />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {category.map((cat) => (
                  <CommandItem
                    key={cat.value}
                    value={cat.value}
                    onSelect={() => handleSelect(cat.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCategories.includes(cat.value)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {cat.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover> */}
    </div>
  );
}
