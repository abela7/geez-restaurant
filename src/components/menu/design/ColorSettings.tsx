
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { MenuDesignType } from '@/types/menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface ColorSettingsProps {
  design: MenuDesignType;
  onChange: (field: keyof MenuDesignType, value: any) => void;
  isLoading?: boolean;
}

export const ColorSettings: React.FC<ColorSettingsProps> = ({ 
  design, 
  onChange,
  isLoading = false
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="primaryColor">
          <T text="Primary Color" />
        </Label>
        <div className="flex gap-2">
          <div 
            className="w-10 h-10 rounded-md border"
            style={{ backgroundColor: design.primaryColor }}
          />
          <Input
            id="primaryColor"
            type="color"
            value={design.primaryColor}
            onChange={(e) => onChange('primaryColor', e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          <T text="Used for headings and important text" />
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondaryColor">
          <T text="Secondary Color" />
        </Label>
        <div className="flex gap-2">
          <div 
            className="w-10 h-10 rounded-md border"
            style={{ backgroundColor: design.secondaryColor }}
          />
          <Input
            id="secondaryColor"
            type="color"
            value={design.secondaryColor}
            onChange={(e) => onChange('secondaryColor', e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          <T text="Used for category titles and accents" />
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">
          <T text="Background Color" />
        </Label>
        <div className="flex gap-2">
          <div 
            className="w-10 h-10 rounded-md border"
            style={{ backgroundColor: design.backgroundColor }}
          />
          <Input
            id="backgroundColor"
            type="color"
            value={design.backgroundColor}
            onChange={(e) => onChange('backgroundColor', e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">
          <T text="Text Color" />
        </Label>
        <div className="flex gap-2">
          <div 
            className="w-10 h-10 rounded-md border"
            style={{ backgroundColor: design.textColor }}
          />
          <Input
            id="textColor"
            type="color"
            value={design.textColor}
            onChange={(e) => onChange('textColor', e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accentColor">
          <T text="Accent Color" />
        </Label>
        <div className="flex gap-2">
          <div 
            className="w-10 h-10 rounded-md border"
            style={{ backgroundColor: design.accentColor }}
          />
          <Input
            id="accentColor"
            type="color"
            value={design.accentColor}
            onChange={(e) => onChange('accentColor', e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          <T text="Used for prices and highlights" />
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="borderColor">
          <T text="Border Color" />
        </Label>
        <div className="flex gap-2">
          <div 
            className="w-10 h-10 rounded-md border"
            style={{ backgroundColor: design.borderColor }}
          />
          <Input
            id="borderColor"
            type="color"
            value={design.borderColor}
            onChange={(e) => onChange('borderColor', e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          <T text="Border Radius" />: {design.borderRadius}px
        </Label>
        <Slider
          value={[design.borderRadius]}
          min={0}
          max={20}
          step={1}
          onValueChange={(value) => onChange('borderRadius', value[0])}
          disabled={isLoading}
        />
      </div>

      <div className="pt-4">
        <div className="p-4 rounded-md" style={{ 
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          borderRadius: `${design.borderRadius}px`,
          border: design.showBorders ? `1px solid ${design.borderColor}` : 'none'
        }}>
          <h3 style={{ color: design.primaryColor, fontWeight: 'bold' }}>
            <T text="Color Preview" />
          </h3>
          <p style={{ color: design.secondaryColor, borderBottom: `1px solid ${design.secondaryColor}`, paddingBottom: '4px', marginBottom: '8px' }}>
            <T text="Category Title" />
          </p>
          <div className="flex justify-between">
            <div>
              <T text="Item Name" />
            </div>
            <div style={{ color: design.accentColor, fontWeight: 'bold' }}>
              £14.99
            </div>
          </div>
          <p className="text-sm opacity-80 mt-1">
            <T text="Item description with details about the dish" />
          </p>
        </div>
      </div>
    </div>
  );
};
