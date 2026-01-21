import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpCircle, Clock, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from '@/hooks/use-toast';

interface UpgradeRequest {
  id: string;
  user_id: string;
  current_tier: string;
  requested_tier: string;
  reason: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const UpgradeRequestsManager = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats?action=upgrade-requests`,
        {
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching upgrade requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const handleRequest = async (status: 'approved' | 'rejected') => {
    if (!selectedRequest) return;

    setProcessing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats?action=handle-upgrade-request`,
        {
          method: 'POST',
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestId: selectedRequest.id,
            status,
            adminNotes: adminNotes || null,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast({
          title: status === 'approved' ? 'Request Approved' : 'Request Rejected',
          description: result.message,
        });
        setSelectedRequest(null);
        setAdminNotes('');
        fetchRequests();
      } else {
        throw new Error('Failed to process request');
      }
    } catch (error) {
      console.error('Error handling request:', error);
      toast({
        title: 'Error',
        description: 'Failed to process the upgrade request',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="border-warning/50 bg-warning/10 text-warning">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="border-success/50 bg-success/10 text-success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-primary" />
              Upgrade Requests
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingCount} pending
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Review and manage tier upgrade requests from users
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRequests}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No upgrade requests yet
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Current → Requested</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-xs">
                      {request.user_id.slice(0, 12)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="capitalize">
                          {request.current_tier}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="default" className="capitalize">
                          {request.requested_tier}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {request.reason || <span className="text-muted-foreground italic">No reason provided</span>}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setAdminNotes('');
                          }}
                        >
                          Review
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {request.admin_notes || 'No notes'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Upgrade Request</DialogTitle>
              <DialogDescription>
                Approve or reject this tier upgrade request
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm">{selectedRequest.user_id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Requested</p>
                    <p className="text-sm">
                      {new Date(selectedRequest.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tier Change</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize text-lg">
                      {selectedRequest.current_tier}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge variant="default" className="capitalize text-lg">
                      {selectedRequest.requested_tier}
                    </Badge>
                  </div>
                </div>

                {selectedRequest.reason && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">User's Reason</p>
                    <p className="text-sm bg-muted p-3 rounded-lg">
                      {selectedRequest.reason}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Admin Notes (optional)</p>
                  <Textarea
                    placeholder="Add notes about this decision..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="destructive"
                onClick={() => handleRequest('rejected')}
                disabled={processing}
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Reject
              </Button>
              <Button
                onClick={() => handleRequest('approved')}
                disabled={processing}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UpgradeRequestsManager;
