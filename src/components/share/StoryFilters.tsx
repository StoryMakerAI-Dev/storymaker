
import React from 'react';
import { Button } from "@/components/ui/button";

interface StoryFiltersProps {
  activeTab: string;
  onFilterChange: (filter: string) => void;
}

const StoryFilters: React.FC<StoryFiltersProps> = ({ activeTab, onFilterChange }) => {
  const filters = [
    { key: "latest", label: "Latest" },
    { key: "popular", label: "Most Popular" },
    { key: "fantasy", label: "Fantasy" },
    { key: "scifi", label: "Sci-Fi" },
    { key: "mystery", label: "Mystery" }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(filter => (
        <Button 
          key={filter.key}
          variant={activeTab === filter.key ? "default" : "outline"} 
          size="sm"
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default StoryFilters;
