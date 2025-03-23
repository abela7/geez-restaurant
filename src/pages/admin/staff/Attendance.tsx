import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";

const Attendance = () => {
  return (
    <>
      <PageHeader 
        heading={<T text="Staff Attendance" />}
        description={<T text="Track and manage staff attendance records" />}
        actions={
          <Button>
            <T text="Export Report" />
          </Button>
        }
      />
    </>
  );
};

export default Attendance;
