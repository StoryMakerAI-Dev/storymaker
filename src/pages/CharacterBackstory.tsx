import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PageSeo } from '@/components/seo/PageSeo';

const GENRES = ['General Fiction', 'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Thriller', 'Historical', 'Horror', 'Adventure'];

const CharacterBackstory: React.FC = () => {
  const { getToken } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [setting, setSetting] = useState('');
  const [traits, setTraits] = useState('');
  const [genre, setGenre] = useState('General Fiction');
  const [backstory, setBackstory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    setIsLoading(true);
    setBackstory('');
    try {
      const token = await getToken().catch(() => null);
      const { data, error } = await supabase.functions.invoke('generate-backstory', {
        body: { name, role, setting, traits, genre },
        headers: token ? { 'x-clerk-token': token } : undefined,
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setBackstory(data.backstory);
    } catch (e) {
      toast({
        title: 'Could not generate backstory',
        description: e instanceof Error ? e.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackstory = () => {
    navigator.clipboard.writeText(backstory);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSeo
        title="Character Backstory Generator — StoryMaker AI"
        description="Generate rich, original character backstories with AI. Enter a name, role, setting, and traits to create a detailed history that gives your story characters real depth."
        path="/characters/backstory"
      />
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-display font-bold text-foreground mb-3">
          Character Backstory Generator
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Great stories are built on characters with real history. A well-crafted backstory explains
          why your character wants what they want, fears what they fear, and chooses what they choose.
          Enter a few details below and let AI create a rich, original past for your character.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Character details</CardTitle>
            <CardDescription>The more you share, the more tailored the backstory.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="char-name">Name</Label>
                <Input id="char-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Elara Venn" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-role">Role in story</Label>
                <Input id="char-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. reluctant hero, villain, mentor" maxLength={100} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-setting">Setting / world</Label>
              <Input id="char-setting" value={setting} onChange={(e) => setSetting(e.target.value)} placeholder="e.g. a crumbling space station orbiting a dying star" maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-traits">Key traits</Label>
              <Textarea id="char-traits" value={traits} onChange={(e) => setTraits(e.target.value)} placeholder="e.g. stubborn, secretly compassionate, haunted by a past mistake" maxLength={500} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-genre">Genre</Label>
              <select
                id="char-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <Button onClick={generate} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Writing backstory…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Generate backstory</>
              )}
            </Button>
          </CardContent>
        </Card>

        {backstory && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>{name ? `${name}'s backstory` : 'Character backstory'}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyBackstory}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={generate} disabled={isLoading}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap font-story text-foreground">
                {backstory}
              </div>
            </CardContent>
          </Card>
        )}

        <section className="mt-12 space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-display font-semibold text-foreground">Why character depth matters</h2>
          <p>
            Readers connect with characters who feel lived-in. A backstory gives your character
            motivations that make sense, flaws that create conflict, and a voice that stays consistent
            from the first page to the last. Even details that never appear in your story shape how a
            character speaks and reacts — and readers can feel the difference.
          </p>
          <p>
            Use the generated history as a starting point: keep the details that spark ideas, rewrite
            the ones that don't fit your world, and let the character's past inform every scene they
            appear in.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CharacterBackstory;
