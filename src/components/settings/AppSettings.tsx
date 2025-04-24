import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AttendanceSettings from './AttendanceSettings';

const AppSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Configure various aspects of the application
          </CardDescription>
        </CardHeader>
      </Card>

      <AttendanceSettings />
    </div>
  );
};

export default AppSettings;