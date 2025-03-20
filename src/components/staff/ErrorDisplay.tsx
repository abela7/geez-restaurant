
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

type ErrorDisplayProps = {
  error: string;
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-950/20">
      <div className="p-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="text-red-500">{error}</p>
      </div>
    </Card>
  );
};

export default ErrorDisplay;
