
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { MenuDesignType } from '@/types/menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface LayoutSettingsProps {
  design: MenuDesignType;
  onChange: (field: keyof MenuDesignType, value: any) => void;
  isLoading?: boolean;
}

export const LayoutSettings: React.FC<LayoutSettingsProps> = ({ 
  design, 
  onChange,
  isLoading = false
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>
          <T text="Layout Type" />
        </Label>
        <RadioGroup 
          value={design.layout}
          onValueChange={(value) => onChange('layout', value)}
          className="flex flex-col space-y-1"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="grid" id="grid" />
            <Label htmlFor="grid"><T text="Grid Layout" /></Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="list" id="list" />
            <Label htmlFor="list"><T text="List Layout" /></Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="compact" />
            <Label htmlFor="compact"><T text="Compact Layout" /></Label>
          </div>
        </RadioGroup>
      </div>

      {design.layout === 'grid' && (
        <div className="space-y-2">
          <Label>
            <T text="Number of Columns" />: {design.columns}
          </Label>
          <Slider
            value={[design.columns]}
            min={1}
            max={4}
            step={1}
            onValueChange={(value) => onChange('columns', value[0])}
            disabled={isLoading}
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="showImages">
            <T text="Show Images" />
          </Label>
          <Switch
            id="showImages"
            checked={design.showImages}
            onCheckedChange={(checked) => onChange('showImages', checked)}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="showDescriptions">
            <T text="Show Descriptions" />
          </Label>
          <Switch
            id="showDescriptions"
            checked={design.showDescriptions}
            onCheckedChange={(checked) => onChange('showDescriptions', checked)}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="showPrices">
            <T text="Show Prices" />
          </Label>
          <Switch
            id="showPrices"
            checked={design.showPrices}
            onCheckedChange={(checked) => onChange('showPrices', checked)}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="showBorders">
            <T text="Show Borders" />
          </Label>
          <Switch
            id="showBorders"
            checked={design.showBorders}
            onCheckedChange={(checked) => onChange('showBorders', checked)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          <T text="Page Size" />
        </Label>
        <Select 
          value={design.pageSize}
          onValueChange={(value) => onChange('pageSize', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Select page size")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a4">A4</SelectItem>
            <SelectItem value="a5">A5</SelectItem>
            <SelectItem value="letter">Letter</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          <T text="Page Orientation" />
        </Label>
        <RadioGroup 
          value={design.orientation}
          onValueChange={(value) => onChange('orientation', value as 'portrait' | 'landscape')}
          className="flex space-x-4"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="portrait" id="portrait" />
            <Label htmlFor="portrait"><T text="Portrait" /></Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="landscape" id="landscape" />
            <Label htmlFor="landscape"><T text="Landscape" /></Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>
          <T text="Spacing" />
        </Label>
        <RadioGroup 
          value={design.spacing}
          onValueChange={(value) => onChange('spacing', value as 'compact' | 'comfortable' | 'spacious')}
          className="flex flex-col space-y-1"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="spacing-compact" />
            <Label htmlFor="spacing-compact"><T text="Compact" /></Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="spacing-comfortable" />
            <Label htmlFor="spacing-comfortable"><T text="Comfortable" /></Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="spacious" id="spacing-spacious" />
            <Label htmlFor="spacing-spacious"><T text="Spacious" /></Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>
          <T text="Header Style" />
        </Label>
        <RadioGroup 
          value={design.headerStyle}
          onValueChange={(value) => onChange('headerStyle', value as 'centered' | 'left-aligned' | 'minimal')}
          className="flex flex-col space-y-1"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="centered" id="header-centered" />
            <Label htmlFor="header-centered"><T text="Centered" /></Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left-aligned" id="header-left" />
            <Label htmlFor="header-left"><T text="Left Aligned" /></Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minimal" id="header-minimal" />
            <Label htmlFor="header-minimal"><T text="Minimal" /></Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="footerText">
          <T text="Footer Text" />
        </Label>
        <Input
          id="footerText"
          value={design.footerText}
          onChange={(e) => onChange('footerText', e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label>
          <T text="Logo Position" />
        </Label>
        <Select
          value={design.logoPosition}
          onValueChange={(value) => onChange('logoPosition', value as 'top' | 'header' | 'none')}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Select logo position")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top"><T text="Top" /></SelectItem>
            <SelectItem value="header"><T text="In Header" /></SelectItem>
            <SelectItem value="none"><T text="No Logo" /></SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
