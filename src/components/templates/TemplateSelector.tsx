import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookTemplate, Sparkles } from 'lucide-react';
import { getTemplates, StoryTemplate } from '@/services/supabase/templatesService';
import { toast } from '@/hooks/use-toast';

interface TemplateSelectorProps {
  onSelectTemplate: (template: StoryTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState<StoryTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await getTemplates();
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load story templates',
          variant: 'destructive',
        });
      } else if (data) {
        setTemplates(data);
      }
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookTemplate className="h-5 w-5 text-primary" />
          <CardTitle>Story Templates</CardTitle>
        </div>
        <CardDescription>
          Choose a template to jumpstart your story
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="p-4 border rounded-lg hover:shadow-md hover:border-primary transition-all duration-200 cursor-pointer group"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {template.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                  <Sparkles className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs">
                    {template.genre}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.age_group}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">
                  "{template.starter_text.substring(0, 80)}..."
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;