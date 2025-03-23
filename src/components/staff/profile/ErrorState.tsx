
import React from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-medium mb-2"><T text="Error" /></h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex space-x-4">
          <Button onClick={() => navigate(-1)}>
            <T text="Go Back" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/staff/directory")}>
            <T text="Return to Staff Directory" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
