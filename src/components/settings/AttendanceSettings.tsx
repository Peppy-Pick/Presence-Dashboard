import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getConfigData, updateConfigData } from '@/lib/api/config';

const AttendanceSettings = () => {
  const [lateBufferMinutes, setLateBufferMinutes] = useState('10');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const config = await getConfigData();
        if (config.attendance_settings?.late_buffer_minutes) {
          setLateBufferMinutes(config.attendance_settings.late_buffer_minutes.toString());
        }
      } catch (error) {
        console.error('Error loading attendance settings:', error);
        toast.error('Failed to load attendance settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const minutes = parseInt(lateBufferMinutes);
      if (isNaN(minutes) || minutes < 0 || minutes > 60) {
        throw new Error('Buffer time must be between 0 and 60 minutes');
      }

      await updateConfigData({
        attendance_settings: {
          late_buffer_minutes: minutes,
          allow_manual_time: true,
          max_time_adjustment: 30,
          require_approval: true
        }
      });

      toast.success('Attendance settings saved successfully');
    } catch (error) {
      console.error('Error saving attendance settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Late Attendance Settings</CardTitle>
        <CardDescription>
          Configure when an employee's attendance should be marked as late
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="buffer-time">Late Buffer Time (minutes)</Label>
          <Input
            id="buffer-time"
            type="number"
            value={lateBufferMinutes}
            onChange={(e) => setLateBufferMinutes(e.target.value)}
            min="0"
            max="60"
            placeholder="Enter buffer time in minutes"
          />
          <p className="text-sm text-muted-foreground">
            Employees will be marked late if they check in after their shift start time plus this buffer period.
            For example, if shift starts at 9:00 AM and buffer is 10 minutes, employees will be marked late after 9:10 AM.
          </p>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttendanceSettings;