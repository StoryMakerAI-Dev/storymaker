import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getUserCharacters, createCharacter, deleteCharacter, Character } from '@/services/supabase/charactersService';
import { toast } from '@/hooks/use-toast';

interface CharacterLibraryProps {
  onSelectCharacter?: (character: Character) => void;
}

const CharacterLibrary: React.FC<CharacterLibraryProps> = ({ onSelectCharacter }) => {
  const { userId } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [traits, setTraits] = useState('');
  const [backstory, setBackstory] = useState('');

  const fetchCharacters = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const { data, error } = await getUserCharacters(userId);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load characters',
        variant: 'destructive',
      });
    } else if (data) {
      setCharacters(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCharacters();
  }, [userId]);

  const handleCreateCharacter = async () => {
    if (!userId || !name.trim() || !description.trim()) {
      toast({
        title: 'Invalid input',
        description: 'Name and description are required',
        variant: 'destructive',
      });
      return;
    }

    const { data, error } = await createCharacter(userId, name, description, traits, backstory);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create character',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Character created!',
        description: `${name} has been added to your library`,
      });
      setName('');
      setDescription('');
      setTraits('');
      setBackstory('');
      setIsDialogOpen(false);
      fetchCharacters();
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    const { error } = await deleteCharacter(characterId);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete character',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Character deleted',
        description: 'Character removed from library',
      });
      fetchCharacters();
    }
  };

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
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            <CardTitle>Character Library</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Character
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Character</DialogTitle>
                <DialogDescription>
                  Save a character to reuse in multiple stories
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Sarah the Explorer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the character"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Traits</Label>
                  <Input 
                    value={traits}
                    onChange={(e) => setTraits(e.target.value)}
                    placeholder="e.g., Brave, curious, kind-hearted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Backstory</Label>
                  <Textarea 
                    value={backstory}
                    onChange={(e) => setBackstory(e.target.value)}
                    placeholder="Character's background and history"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCharacter}>Create Character</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Save and reuse characters across stories
        </CardDescription>
      </CardHeader>
      <CardContent>
        {characters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No characters yet. Create one to get started!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {characters.map((character) => (
                <div 
                  key={character.id} 
                  className="p-4 border rounded-lg hover:shadow-md hover:border-primary transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{character.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {character.description}
                      </p>
                      {character.traits && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <span className="font-medium">Traits:</span> {character.traits}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {onSelectCharacter && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onSelectCharacter(character)}
                        >
                          Use
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteCharacter(character.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterLibrary;