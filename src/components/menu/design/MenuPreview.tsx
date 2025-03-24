
import React from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { MenuDesignType } from '@/types/menu';
import { useMenuItems } from '@/hooks/useMenuItems';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface MenuPreviewProps {
  design: MenuDesignType;
  fullWidth?: boolean;
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ design, fullWidth = false }) => {
  const { t } = useLanguage();
  const { menuItems, categories, isLoading } = useMenuItems();
  
  const previewStyle = {
    fontFamily: design.bodyFont,
    color: design.textColor,
    backgroundColor: design.backgroundColor,
    borderRadius: `${design.borderRadius}px`,
    border: design.showBorders ? `1px solid ${design.borderColor}` : 'none',
    padding: design.spacing === 'compact' ? '1rem' : design.spacing === 'comfortable' ? '2rem' : '3rem',
    maxWidth: fullWidth ? '100%' : design.pageSize === 'a4' ? '210mm' : design.pageSize === 'a5' ? '148mm' : '215mm',
    margin: '0 auto',
  };
  
  const headerStyle = {
    fontFamily: design.titleFont,
    textAlign: design.headerStyle === 'centered' ? 'center' : 'left',
    color: design.primaryColor,
    marginBottom: design.spacing === 'compact' ? '1rem' : design.spacing === 'comfortable' ? '2rem' : '3rem',
  };
  
  const categoryStyle = {
    fontFamily: design.subtitleFont,
    fontSize: `${design.subtitleSize}px`,
    color: design.secondaryColor,
    marginBottom: design.spacing === 'compact' ? '0.5rem' : '1rem',
    borderBottom: `2px solid ${design.secondaryColor}`,
    paddingBottom: '0.5rem',
  };
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${design.columns}, 1fr)`,
    gap: design.spacing === 'compact' ? '0.5rem' : design.spacing === 'comfortable' ? '1rem' : '1.5rem',
  };
  
  const itemStyle = {
    marginBottom: design.spacing === 'compact' ? '0.5rem' : '1rem',
  };
  
  const itemTitleStyle = {
    fontSize: `${design.bodySize + 2}px`,
    fontWeight: 'bold',
    color: design.textColor,
  };
  
  const itemPriceStyle = {
    fontWeight: 'bold',
    color: design.accentColor,
  };
  
  const footerStyle = {
    fontFamily: design.bodyFont,
    fontSize: `${design.bodySize - 2}px`,
    textAlign: 'center',
    color: design.textColor,
    opacity: 0.7,
    marginTop: design.spacing === 'compact' ? '1rem' : design.spacing === 'comfortable' ? '2rem' : '3rem',
    paddingTop: '1rem',
    borderTop: `1px solid ${design.borderColor}`,
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const categoryId = item.category_id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);
  
  return (
    <div style={previewStyle}>
      <div style={headerStyle as React.CSSProperties}>
        <h1 style={{ fontSize: `${design.titleSize}px` }}>Ge'ez Restaurant</h1>
        <p style={{ fontSize: `${design.bodySize}px`, opacity: 0.8 }}>
          <T text="Ethiopian & Eritrean Cuisine" />
        </p>
      </div>
      
      {categories.map(category => {
        const items = groupedItems[category.id] || [];
        if (items.length === 0) return null;
        
        return (
          <div key={category.id} className="mb-8">
            <h2 style={categoryStyle as React.CSSProperties}>{category.name}</h2>
            
            <div style={design.layout === 'grid' ? gridStyle : {}}>
              {items.map(item => (
                <div key={item.id} style={itemStyle}>
                  <div className="flex justify-between mb-1">
                    <div style={itemTitleStyle}>{item.name}</div>
                    {design.showPrices && (
                      <div style={itemPriceStyle}>£{item.price.toFixed(2)}</div>
                    )}
                  </div>
                  
                  {design.showImages && item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="rounded-md mb-2 object-cover w-full"
                      style={{ height: '120px' }}
                    />
                  )}
                  
                  {design.showDescriptions && item.description && (
                    <p style={{ fontSize: `${design.bodySize}px`, opacity: 0.8 }}>
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2 mt-1">
                    {item.is_vegetarian && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <T text="Vegetarian" />
                      </span>
                    )}
                    {item.is_vegan && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <T text="Vegan" />
                      </span>
                    )}
                    {item.is_spicy && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        <T text="Spicy" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      <div style={footerStyle as React.CSSProperties}>
        {design.footerText}
      </div>
    </div>
  );
};
