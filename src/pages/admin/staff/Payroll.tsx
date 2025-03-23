import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";

const Payroll = () => {
  return (
    <>
      <PageHeader 
        heading={<T text="Staff Payroll" />}
        description={<T text="Manage staff payroll and compensation" />}
        actions={
          <Button>
            <T text="Export Report" />
          </Button>
        }
      />
    </>
  );
};

export default Payroll;
