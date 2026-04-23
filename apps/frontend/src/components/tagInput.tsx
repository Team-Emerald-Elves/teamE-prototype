import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    remove: (string) => void;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>((props, ref) => {

    const { placeholder, tags, setTags, className, remove } = props;

    const [inputValue, setInputValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        remove(tagToRemove);
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div>
            <div className={`flex flex-wrap gap-2 rounded-md ${tags.length !== 0 && 'mb-3'}`}>
                {tags.map((tag, index) => (
                    <span key={index} className="transition-all border bg-gray-200 text-black hover:bg-gray-300 inline-flex h-5 items-center text-xs pl-2 rounded-sm">
                        {tag}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeTag(tag, remove)}
                            className={cn("py-1 px-3 h-full hover:bg-transparent")}
                        >
                            <X size={14} />
                        </Button>
                    </span>
                ))}
            </div>
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={className}
            />
        </div>
    );
});

TagInput.displayName = 'TagInput';

export { TagInput };