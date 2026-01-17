import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@clerk/clerk-react';
import { 
  getExportSchedules, 
  createExportSchedule, 
  updateExportSchedule, 
  deleteExportSchedule,
  getExportArchives,
  deleteExportArchive,
  ExportSchedule,
  ExportArchive,
  CRON_PRESETS 
} from '@/services/supabase/exportService';
import { EXPORT_TEMPLATES } from '@/utils/exportTemplates';
import { Clock, Plus, Trash2, Download, Calendar, Archive, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ScheduledExportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScheduledExportsDialog: React.FC<ScheduledExportsDialogProps> = ({ open, onOpenChange }) => {
  const { userId } = useAuth();
  const [schedules, setSchedules] = useState<ExportSchedule[]>([]);
  const [archives, setArchives] = useState<ExportArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedules' | 'archives'>('schedules');
  
  // Form state
  const [scheduleName, setScheduleName] = useState('');
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [templateId, setTemplateId] = useState('classic');
  const [deliveryMethod, setDeliveryMethod] = useState('archive');
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open && userId) {
      fetchData();
    }
  }, [open, userId]);

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [schedulesData, archivesData] = await Promise.all([
        getExportSchedules(userId),
        getExportArchives(userId),
      ]);
      setSchedules(schedulesData);
      setArchives(archivesData);
    } catch (error) {
      console.error('Error fetching export data:', error);
      toast.error('Failed to load export data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!userId || !scheduleName.trim()) {
      toast.error('Please enter a schedule name');
      return;
    }

    if (deliveryMethod === 'email' && !deliveryEmail.trim()) {
      toast.error('Please enter delivery email');
      return;
    }

    setCreating(true);
    try {
      await createExportSchedule({
        user_id: userId,
        schedule_name: scheduleName,
        cron_expression: cronExpression,
        export_format: exportFormat,
        template_id: templateId,
        delivery_method: deliveryMethod,
        delivery_email: deliveryMethod === 'email' ? deliveryEmail : null,
        cloud_provider: null,
        is_active: true,
      });
      
      toast.success('Schedule created successfully');
      setShowCreateForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('Failed to create schedule');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleSchedule = async (schedule: ExportSchedule) => {
    try {
      await updateExportSchedule(schedule.id, { is_active: !schedule.is_active });
      setSchedules(prev => prev.map(s => 
        s.id === schedule.id ? { ...s, is_active: !s.is_active } : s
      ));
      toast.success(`Schedule ${schedule.is_active ? 'disabled' : 'enabled'}`);
    } catch (error) {
      toast.error('Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await deleteExportSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast.success('Schedule deleted');
    } catch (error) {
      toast.error('Failed to delete schedule');
    }
  };

  const handleDeleteArchive = async (id: string) => {
    try {
      await deleteExportArchive(id);
      setArchives(prev => prev.filter(a => a.id !== id));
      toast.success('Archive deleted');
    } catch (error) {
      toast.error('Failed to delete archive');
    }
  };

  const resetForm = () => {
    setScheduleName('');
    setCronExpression('0 0 * * *');
    setExportFormat('pdf');
    setTemplateId('classic');
    setDeliveryMethod('archive');
    setDeliveryEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Exports
          </DialogTitle>
          <DialogDescription>
            Automatically export and backup your stories on a schedule
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 border-b pb-2">
          <Button
            variant={activeTab === 'schedules' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('schedules')}
          >
            <Clock className="h-4 w-4 mr-2" />
            Schedules
          </Button>
          <Button
            variant={activeTab === 'archives' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('archives')}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archives ({archives.length})
          </Button>
        </div>

        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeTab === 'schedules' ? (
            <div className="space-y-4 py-4">
              {!showCreateForm ? (
                <Button onClick={() => setShowCreateForm(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Schedule
                </Button>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">New Export Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Schedule Name</Label>
                      <Input
                        placeholder="Daily Backup"
                        value={scheduleName}
                        onChange={(e) => setScheduleName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Schedule (Cron)</Label>
                        <Select value={cronExpression} onValueChange={setCronExpression}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CRON_PRESETS.map((preset) => (
                              <SelectItem key={preset.value} value={preset.value}>
                                {preset.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="docx">DOCX</SelectItem>
                            <SelectItem value="txt">Text</SelectItem>
                            <SelectItem value="md">Markdown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Template</Label>
                        <Select value={templateId} onValueChange={setTemplateId}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPORT_TEMPLATES.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Delivery Method</Label>
                        <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="archive">Downloadable Archive</SelectItem>
                            <SelectItem value="email">Email Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {deliveryMethod === 'email' && (
                      <div className="space-y-2">
                        <Label>Delivery Email</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={deliveryEmail}
                          onChange={(e) => setDeliveryEmail(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateSchedule} disabled={creating}>
                        {creating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Schedule'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {schedules.length === 0 && !showCreateForm ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No export schedules yet</p>
                </div>
              ) : (
                schedules.map((schedule) => (
                  <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{schedule.schedule_name}</h4>
                            <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                              {schedule.is_active ? 'Active' : 'Paused'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {schedule.export_format.toUpperCase()} • {schedule.delivery_method} • {
                              CRON_PRESETS.find(p => p.value === schedule.cron_expression)?.label || schedule.cron_expression
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={schedule.is_active}
                            onCheckedChange={() => handleToggleSchedule(schedule)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3 py-4">
              {archives.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Archive className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No export archives yet</p>
                </div>
              ) : (
                archives.map((archive) => (
                  <Card key={archive.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{archive.file_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {archive.story_count} stories • {archive.export_format.toUpperCase()} • {
                              formatDistanceToNow(new Date(archive.created_at), { addSuffix: true })
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(archive.file_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteArchive(archive.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledExportsDialog;
