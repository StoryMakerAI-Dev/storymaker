import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, MessageCircle, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Wand2,
      label: 'Create Story',
      description: 'Generate a new story',
      color: 'from-primary to-primary-glow',
      onClick: () => navigate('/'),
    },
    {
      icon: MessageCircle,
      label: 'AI Chat',
      description: 'Brainstorm ideas',
      color: 'from-secondary to-secondary-glow',
      onClick: () => navigate('/chat-assistant'),
    },
    {
      icon: BookOpen,
      label: 'My Stories',
      description: 'View saved stories',
      color: 'from-accent to-accent-glow',
      onClick: () => {
        const element = document.getElementById('saved-stories');
        element?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      icon: Users,
      label: 'Community',
      description: 'Explore shared stories',
      color: 'from-storyforge-purple to-storyforge-accent',
      onClick: () => navigate('/share-stories'),
    },
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex flex-col items-start p-4 hover:shadow-md transition-all duration-300 group"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} mb-2 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-sm">{action.label}</span>
              <span className="text-xs text-muted-foreground">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;