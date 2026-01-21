import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowUpCircle, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { getUserPreferences } from '@/services/supabase/preferencesService';
import { toast } from '@/components/ui/use-toast';

interface UpgradeRequest {
  id: string;
  current_tier: string;
  requested_tier: string;
  status: string;
  reason: string | null;
  admin_notes: string | null;
  created_at: string;
}

const TIER_ORDER = ['free', 'basic', 'pro', 'enterprise'];

const TierUpgradeRequest = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [requestedTier, setRequestedTier] = useState<string>('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        // Get current tier
        const prefs = await getUserPreferences(user.id);
        setCurrentTier(prefs?.subscription_tier || 'free');

        // Get existing requests
        const { data, error } = await supabase
          .from('tier_upgrade_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching upgrade requests:', error);
        } else {
          setRequests(data as UpgradeRequest[] || []);
        }
      } catch (error) {
        console.error('Error loading upgrade request data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const availableTiers = TIER_ORDER.filter((tier) => {
    const currentIndex = TIER_ORDER.indexOf(currentTier);
    const tierIndex = TIER_ORDER.indexOf(tier);
    return tierIndex > currentIndex;
  });

  const hasPendingRequest = requests.some((r) => r.status === 'pending');

  const handleSubmit = async () => {
    if (!user?.id || !requestedTier) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('tier_upgrade_requests')
        .insert({
          user_id: user.id,
          current_tier: currentTier,
          requested_tier: requestedTier,
          reason: reason || null,
        });

      if (error) {
        console.error('Error submitting upgrade request:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit upgrade request. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Request Submitted',
          description: 'Your upgrade request has been sent to the administrators.',
        });
        setDialogOpen(false);
        setRequestedTier('');
        setReason('');
        
        // Refresh requests
        const { data } = await supabase
          .from('tier_upgrade_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        setRequests(data as UpgradeRequest[] || []);
      }
    } catch (error) {
      console.error('Error submitting upgrade request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-warning/50 bg-warning/10 text-warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-success/50 bg-success/10 text-success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (currentTier === 'enterprise') {
    return null; // Don't show upgrade option for enterprise users
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpCircle className="h-5 w-5 text-primary" />
          Upgrade Request
        </CardTitle>
        <CardDescription>
          Request an upgrade to a higher tier
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={hasPendingRequest}
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              {hasPendingRequest ? 'Request Pending' : 'Request Tier Upgrade'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Tier Upgrade</DialogTitle>
              <DialogDescription>
                Submit a request to upgrade your subscription tier. An administrator will review your request.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Tier</Label>
                <div className="p-3 rounded-lg bg-muted">
                  <span className="font-medium capitalize">{currentTier}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requested-tier">Requested Tier</Label>
                <Select value={requestedTier} onValueChange={setRequestedTier}>
                  <SelectTrigger id="requested-tier">
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTiers.map((tier) => (
                      <SelectItem key={tier} value={tier} className="capitalize">
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Tell us why you'd like to upgrade..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!requestedTier || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Request History */}
        {requests.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Recent Requests</Label>
            <div className="space-y-2">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="text-sm font-medium">
                        {request.current_tier} → {request.requested_tier}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TierUpgradeRequest;
