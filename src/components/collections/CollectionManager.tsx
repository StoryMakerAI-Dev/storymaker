import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Plus, Folder } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getUserCollections, createCollection, getCollectionStories, Collection } from '@/services/supabase/collectionsService';
import { toast } from '@/hooks/use-toast';

const CollectionManager: React.FC = () => {
  const { userId } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionStories, setCollectionStories] = useState<any[]>([]);

  const fetchCollections = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const { data, error } = await getUserCollections(userId);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load collections',
        variant: 'destructive',
      });
    } else if (data) {
      setCollections(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, [userId]);

  const handleCreateCollection = async () => {
    if (!userId || !name.trim()) {
      toast({
        title: 'Invalid input',
        description: 'Collection name is required',
        variant: 'destructive',
      });
      return;
    }

    const { data, error } = await createCollection(userId, name, description, color);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create collection',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Collection created!',
        description: `${name} has been added`,
      });
      setName('');
      setDescription('');
      setColor('#3b82f6');
      setIsDialogOpen(false);
      fetchCollections();
    }
  };

  const viewCollection = async (collectionId: string) => {
    setSelectedCollection(collectionId);
    const { data, error } = await getCollectionStories(collectionId);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load collection stories',
        variant: 'destructive',
      });
    } else if (data) {
      setCollectionStories(data);
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
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
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
            <FolderOpen className="h-5 w-5 text-primary" />
            <CardTitle>Story Collections</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
                <DialogDescription>
                  Organize your stories into collections
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Collection Name *</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Adventure Stories"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the collection"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input 
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCollection}>Create Collection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Organize stories into themed collections
        </CardDescription>
      </CardHeader>
      <CardContent>
        {collections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No collections yet. Create one to organize your stories!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-3">
              {collections.map((collection) => (
                <div 
                  key={collection.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => viewCollection(collection.id)}
                  style={{ borderColor: `${collection.color}33` }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${collection.color}22` }}
                    >
                      <Folder 
                        className="h-5 w-5"
                        style={{ color: collection.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {collection.name}
                      </h4>
                      {collection.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {collection.description}
                        </p>
                      )}
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

export default CollectionManager;