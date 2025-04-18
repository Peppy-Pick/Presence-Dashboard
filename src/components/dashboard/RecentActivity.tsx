import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, X } from 'lucide-react';

interface RecentActivityItem {
  employee_id: string;
  name: string;
  action: string;
  time: string;
  is_late: boolean;
}

interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  time: string;
  isLate: boolean;
  delay: number;
}

const ActivityItem = ({ avatar, name, action, time, isLate, delay }: ActivityItemProps) => {
  const getActionIcon = () => {
    if (action.includes('late') || isLate) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    } else if (action.includes('clocked in')) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (action.includes('clocked out')) {
      return <Clock className="h-4 w-4 text-blue-500" />;
    } else if (action.includes('absent')) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return <Check className="h-4 w-4 text-green-500" />;
  };

  // Enhanced time formatting function that handles various formats and ensures IST display
  const formatTimeToIST = (timeString: string): string => {
    if (!timeString || timeString === '-') return timeString;
    
    try {
      // If the time is already in a time format like "08:45 AM"
      if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(timeString)) {
        // Convert the time to 24-hour format, add the IST offset, then format back
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        // Convert to 24-hour format if needed
        if (period && period.toUpperCase() === 'PM' && hours < 12) {
          hours += 12;
        } else if (period && period.toUpperCase() === 'AM' && hours === 12) {
          hours = 0;
        }
        
        // Create a date object and add the IST offset
        const date = new Date();
        date.setHours(hours + 5); // Add 5 hours for IST
        date.setMinutes(minutes + 30); // Add 30 minutes for IST
        date.setSeconds(0);
        
        // Format using the formatter
        const options: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        };
        
        return new Intl.DateTimeFormat('en-IN', options).format(date);
      }

      // Try to parse as ISO date or other formats
      let date = new Date(timeString);
      
      // Check if date parsing was successful
      if (isNaN(date.getTime())) {
        // If we couldn't parse it as a date, manually add +5:30 if it looks like a time
        if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
          // It looks like a 24-hour time format, let's try to parse it and add offset
          const [hours, minutes] = timeString.split(':').map(Number);
          
          // Create today's date with the specified time
          date = new Date();
          date.setHours(hours + 5); // Add 5 hours for IST
          date.setMinutes(minutes + 30); // Add 30 minutes for IST
          date.setSeconds(0);
        } else {
          // We couldn't parse it at all, return as is
          return timeString;
        }
      } else {
        // If we did parse it as a date, add the IST offset (+5:30)
        date = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);
      }
      
      // Format options for time display
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      return new Intl.DateTimeFormat('en-IN', options).format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  // Format the time before displaying
  const formattedTime = formatTimeToIST(time);

  return (
    <div className={`flex items-center gap-2 sm:gap-3 py-2 sm:py-3 animate-fade-in`} style={{ animationDelay: `${delay}ms` }}>
      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-border flex-shrink-0">
        <img src={avatar} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium truncate">{name}</p>
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
          <span className="truncate max-w-[150px]">{action}</span>
          <span className="text-muted-foreground/50 hidden sm:inline">•</span>
          <span className="hidden sm:inline">{formattedTime}</span>
          {isLate && <span className="ml-1 text-amber-500">(late)</span>}
        </div>
      </div>
      <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
        {getActionIcon()}
      </div>
    </div>
  );
};

interface RecentActivityProps {
  activities: RecentActivityItem[];
  isLoading?: boolean;
}

const RecentActivity = ({ activities = [], isLoading = false }: RecentActivityProps) => {
  // Remove duplicate activities based on combined key of employee_id, action, and time
  const uniqueActivities = activities.reduce((acc: RecentActivityItem[], curr) => {
    const key = `${curr.employee_id}-${curr.action}-${curr.time}`;
    if (!acc.find(item => `${item.employee_id}-${item.action}-${item.time}` === key)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  // Transform the API data into the format needed for the ActivityItem component
  const activityItems = uniqueActivities.map((activity, index) => {
    // Get default avatar based on employee ID
    const avatarNumber = parseInt(activity.employee_id.replace('EMP', '')) % 100;
    const gender = avatarNumber % 2 === 0 ? 'men' : 'women';
    
    return {
      avatar: `https://randomuser.me/api/portraits/${gender}/${avatarNumber}.jpg`,
      name: activity.name,
      action: activity.action,
      time: activity.time, // This will be formatted in the ActivityItem component
      isLate: activity.is_late,
      delay: 100 + (index * 100)
    };
  });

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-1 pt-3 px-3 sm:px-4 sm:pt-4 sm:pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 py-2 animate-pulse">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-2 sm:h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-md bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activityItems.length > 0 ? (
              activityItems.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No recent activity found</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
