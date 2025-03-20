
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import ErrorDisplay from "@/components/staff/ErrorDisplay";
import { useLanguage, T } from "@/contexts/LanguageContext";

type ErrorStateProps = {
  error: string | null;
};

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        heading={<T text="Staff Profile" />}
        description={<T text="View and manage staff details" />}
      />
      <ErrorDisplay error={error || "Staff member not found"} />
      <div className="text-center py-8">
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate("/admin/staff")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <T text="Back to Staff Management" />
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
