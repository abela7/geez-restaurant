
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { MenuDesignType } from '@/types/menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FontSettingsProps {
  design: MenuDesignType;
  onChange: (field: keyof MenuDesignType, value: any) => void;
  isLoading?: boolean;
}

export const FontSettings: React.FC<FontSettingsProps> = ({ 
  design, 
  onChange,
  isLoading = false
}) => {
  const { t } = useLanguage();
  
  const fontOptions = [
    'Playfair Display',
    'Open Sans',
    'Roboto',
    'Lato',
    'Montserrat',
    'Oswald',
    'Raleway',
    'Ubuntu',
    'Merriweather',
    'PT Sans',
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            <T text="Title Font" />
          </Label>
          <Select
            value={design.titleFont}
            onValueChange={(value) => onChange('titleFont', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select font")} />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>
            <T text="Title Size" />: {design.titleSize}px
          </Label>
          <Slider
            value={[design.titleSize]}
            min={16}
            max={72}
            step={1}
            onValueChange={(value) => onChange('titleSize', value[0])}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            <T text="Subtitle Font" />
          </Label>
          <Select
            value={design.subtitleFont}
            onValueChange={(value) => onChange('subtitleFont', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select font")} />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>
            <T text="Subtitle Size" />: {design.subtitleSize}px
          </Label>
          <Slider
            value={[design.subtitleSize]}
            min={12}
            max={48}
            step={1}
            onValueChange={(value) => onChange('subtitleSize', value[0])}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            <T text="Body Font" />
          </Label>
          <Select
            value={design.bodyFont}
            onValueChange={(value) => onChange('bodyFont', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select font")} />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>
            <T text="Body Size" />: {design.bodySize}px
          </Label>
          <Slider
            value={[design.bodySize]}
            min={10}
            max={24}
            step={1}
            onValueChange={(value) => onChange('bodySize', value[0])}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="pt-4">
        <div className="p-4 border border-dashed rounded-md">
          <h3 className="text-lg font-semibold" style={{ fontFamily: design.titleFont, fontSize: `${design.titleSize/2}px` }}>
            <T text="Font Preview" />
          </h3>
          <h4 className="my-2" style={{ fontFamily: design.subtitleFont, fontSize: `${design.subtitleSize/2}px` }}>
            <T text="This is a subtitle example" />
          </h4>
          <p style={{ fontFamily: design.bodyFont, fontSize: `${design.bodySize}px` }}>
            <T text="This is how your body text will appear on the menu. Proper typography helps customers read your menu easily." />
          </p>
        </div>
      </div>
    </div>
  );
};
