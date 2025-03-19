
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

const ForecastParameters: React.FC = () => {
  return (
    <Card className="p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium"><T text="Forecasting Parameters" /></h3>
        <Button size="sm">
          <Save className="mr-2 h-4 w-4" />
          <T text="Update Forecast" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium"><T text="Revenue Growth Rate (%)" /></Label>
          <Input type="number" defaultValue="3.5" min="0" max="100" step="0.1" className="mt-1" />
        </div>
        <div>
          <Label className="text-sm font-medium"><T text="Cost Inflation Rate (%)" /></Label>
          <Input type="number" defaultValue="2.1" min="0" max="100" step="0.1" className="mt-1" />
        </div>
        <div>
          <Label className="text-sm font-medium"><T text="Labor Cost Increase (%)" /></Label>
          <Input type="number" defaultValue="3.0" min="0" max="100" step="0.1" className="mt-1" />
        </div>
        <div>
          <Label className="text-sm font-medium"><T text="Seasonal Adjustment (Holiday)" /></Label>
          <Input type="number" defaultValue="15" min="-100" max="100" step="1" className="mt-1" />
        </div>
        <div>
          <Label className="text-sm font-medium"><T text="New Menu Items Revenue (%)" /></Label>
          <Input type="number" defaultValue="5" min="0" max="100" step="1" className="mt-1" />
        </div>
        <div>
          <Label className="text-sm font-medium"><T text="Marketing ROI (%)" /></Label>
          <Input type="number" defaultValue="250" min="0" max="1000" step="10" className="mt-1" />
        </div>
      </div>
    </Card>
  );
};

export default ForecastParameters;
