import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Brain } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelChange,
  disabled 
}) => {
  const models = [
    { value: 'google/gemini-2.5-flash', label: 'Gemini Flash (Fast & Balanced)', icon: '⚡' },
    { value: 'google/gemini-2.5-pro', label: 'Gemini Pro (Most Powerful)', icon: '🚀' },
    { value: 'openai/gpt-5-mini', label: 'ChatGPT Mini (Fast)', icon: '💨' },
    { value: 'openai/gpt-5', label: 'ChatGPT (Most Capable)', icon: '🧠' },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border">
      <Brain className="h-4 w-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">Model:</span>
      <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
        <SelectTrigger className="w-[240px] border-none bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <span className="flex items-center gap-2">
                <span>{model.icon}</span>
                <span>{model.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
