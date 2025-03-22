
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-extended';

const ColorCustomizationCard: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="warm-blend:glass-effect">
      <CardHeader>
        <CardTitle><T text="Color Customization" /></CardTitle>
        <CardDescription>
          <T text="Fine-tune the color scheme used in your application" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">
              <T text="Color Palette Preview" />
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="turmeric" className="border-none">Turmeric</Badge>
              <Badge variant="sand" className="border-none">Sand</Badge>
              <Badge variant="coffee" className="border-none">Coffee</Badge>
              <Badge variant="plum" className="border-none">Plum</Badge>
              <Badge variant="default" className="border-none">Default</Badge>
              <Badge variant="secondary" className="border-none">Secondary</Badge>
              <Badge variant="destructive" className="border-none">Destructive</Badge>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            <T text="Additional color customization options will be available in a future update." />
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorCustomizationCard;
