
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClockInOut } from "@/hooks/useClockInOut";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Clock, LogIn, LogOut, Loader2 } from "lucide-react";
import { T } from "@/contexts/LanguageContext";

interface ClockInOutCardProps {
  staffId: string;
  staffName: string;
}

const ClockInOutCard: React.FC<ClockInOutCardProps> = ({ staffId, staffName }) => {
  const [clockedIn, setClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  const { clockInOut, getCurrentAttendance, isLoading, error } = useClockInOut(staffId);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAttendanceStatus = async () => {
      setIsCheckingStatus(true);
      const attendance = await getCurrentAttendance();
      if (attendance && attendance.check_in && !attendance.check_out) {
        setClockedIn(true);
        setClockInTime(attendance.check_in);
      } else {
        setClockedIn(false);
        setClockInTime(null);
      }
      setIsCheckingStatus(false);
    };
    
    checkAttendanceStatus();
  }, [staffId]);
  
  const handleClockIn = async () => {
    const result = await clockInOut("in", notes);
    if (result) {
      setClockedIn(true);
      setClockInTime(result.check_in);
      setNotes("");
    }
  };
  
  const handleClockOut = async () => {
    const result = await clockInOut("out", notes);
    if (result) {
      setClockedIn(false);
      setClockInTime(null);
      setNotes("");
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className={clockedIn ? "bg-green-50 dark:bg-green-900/20" : "bg-blue-50 dark:bg-blue-900/20"}>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          <T text="Attendance Tracking" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        {isCheckingStatus ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium mb-1">
                <T text="Welcome" />, {staffName}
              </p>
              
              {clockedIn && clockInTime && (
                <p className="text-sm text-muted-foreground">
                  <T text="Clocked in at" />: {format(new Date(clockInTime), 'h:mm a')}
                </p>
              )}
              
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-2 ${
                clockedIn 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
              }`}>
                {clockedIn ? <T text="Currently Working" /> : <T text="Not Clocked In" />}
              </div>
            </div>
            
            <Textarea
              placeholder={clockedIn ? "Add notes about your shift (optional)" : "Add a note before clocking in (optional)"}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center pt-2 pb-6">
        {clockedIn ? (
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={handleClockOut}
            disabled={isLoading || isCheckingStatus}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <T text="Clock Out" />
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={handleClockIn}
            disabled={isLoading || isCheckingStatus}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            <T text="Clock In" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClockInOutCard;
