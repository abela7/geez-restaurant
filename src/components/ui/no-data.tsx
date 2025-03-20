
import React from "react";
import { FolderX } from "lucide-react";

interface NoDataProps {
  message: string;
  icon?: React.ReactNode;
}

const NoData: React.FC<NoDataProps> = ({ message, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-muted-foreground">
        {icon || <FolderX className="h-12 w-12" />}
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default NoData;
