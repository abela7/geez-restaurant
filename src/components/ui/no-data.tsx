
import React from "react";
import { LayoutGrid } from "lucide-react";

interface NoDataProps {
  message: string;
  icon?: React.ReactNode;
}

const NoData = ({ message, icon }: NoDataProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon || <LayoutGrid className="h-12 w-12 text-muted-foreground mb-2" />}
      <p className="text-muted-foreground mt-2">{message}</p>
    </div>
  );
};

export default NoData;
