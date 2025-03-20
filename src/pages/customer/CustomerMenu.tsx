import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, ShoppingCart, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

// Mock data
const categories = [
  { id: 1, name: 'Main Dishes', amharic: 'ዋና ምግቦች' },
  { id: 2, name: 'Vegetarian', amharic: 'አትክልታዊ' },
  { id: 3, name: 'Sides', amharic: 'ጎን ምግቦች' },
  { id: 4, name: 'Beverages', amharic: 'መጠጦች' },
  { id: 5, name: 'Desserts', amharic: 'ጣፋጭ ምግቦች' },
];

interface MenuItem {
  id: number;
  name: string;
  amharic: string;
  description: string;
  amharicDescription: string;
  price: number;
  image: string;
  category: number;
  spiceLevel?: 1 | 2 | 3;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  containsNuts?: boolean;
  popular?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Doro Wat',
    amharic: 'ዶሮ ወጥ',
    description: 'Spicy chicken stew with boiled eggs, served with injera',
    amharicDescription: 'የተቀቀለ እንቁላል ያለው ሙቅ የዶሮ ወጥ ከእንጀራ ጋር',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1576877249349-a36c78632fd9', 
    category: 1,
    spiceLevel: 3,
    isSpicy: true,
    popular: true
  },
  {
    id: 2,
    name: 'Tibs',
    amharic: 'ጥብስ',
    description: 'Sautéed meat with vegetables and spices',
    amharicDescription: 'ከአትክልቶች እና ቅመሞች ጋር የተጠበሰ ሥጋ',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1575640599759-5f555c7aa224', 
    category: 1,
    spiceLevel: 2,
    isSpicy: true
  },
  {
    id: 3,
    name: 'Kitfo',
    amharic: 'ክትፎ',
    description: 'Minced raw beef seasoned with mitmita and niter kibbeh',
    amharicDescription: 'ከሚጥሚጣ እና ንጥር ቅቤ ጋር የተቀመመ ጥሬ የጥጃ ሥጋ',
    price: 20.99,
    image: 'https://images.unsplash.com/photo-1538523255692-e9e153e23f98', 
    category: 1,
    spiceLevel: 3,
    isSpicy: true,
    popular: true
  },
  {
    id: 4,
    name: 'Shiro',
    amharic: 'ሽሮ',
    description: 'Spiced chickpea stew, a staple in Ethiopian cuisine',
    amharicDescription: 'የተቀመመ የሺምብራ ወጥ፣ የኢትዮጵያ ምግብ ውስጥ ዋነኛ',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1571142346182-64c7fcdda2f2', 
    category: 2,
    spiceLevel: 2,
    isVegetarian: true,
    isVegan: true,
    isSpicy: true
  },
  {
    id: 5,
    name: 'Misir Wat',
    amharic: 'ምሥር ወጥ',
    description: 'Spiced red lentil stew',
    amharicDescription: 'የተቀመመ ቀይ ምሥር ወጥ',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1539522262621-f3d3be2a5af2', 
    category: 2,
    spiceLevel: 2,
    isVegetarian: true,
    isVegan: true,
    isSpicy: true
  },
  {
    id: 6,
    name: 'Gomen',
    amharic: 'ጎመን',
    description: 'Collard greens sautéed with spices',
    amharicDescription: 'በቅመማ ቅመሞች የተጠበሰ ጎመን',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1600204065493-eb671b7e720b', 
    category: 2,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    id: 7,
    name: 'Injera',
    amharic: 'እንጀራ',
    description: 'Sourdough flatbread, the base of Ethiopian meals',
    amharicDescription: 'በኢትዮጵያ ምግብ መሰረት ጣፋጭ ፓንኬክ',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1606070787111-09b7bb3f2d41', 
    category: 3,
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 8,
    name: 'Ayib',
    amharic: 'አይብ',
    description: 'Fresh Ethiopian cheese, mild and crumbly',
    amharicDescription: 'የኢትዮጵያ ጣፋጭ አይብ',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1553004883-8f1b19d7a36e', 
    category: 3,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 9,
    name: 'Ethiopian Coffee',
    amharic: 'ቡና',
    description: 'Traditional coffee served in a ceramic pot (jebena)',
    amharicDescription: 'በጀበና የሚገለገል ባህላዊ ቡና',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1608003152269-6d9b5a9b4c46', 
    category: 4,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    popular: true
  },
  {
    id: 10,
    name: 'Tej',
    amharic: 'ጠጅ',
    description: 'Honey wine, a sweet alcoholic Ethiopian beverage',
    amharicDescription: 'ጣፋጭ አልኮል ያለው የኢትዮጵያ መጠጥ፣ የሙር ወይን',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1550224869-9fec82340d7b', 
    category: 4,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    id: 11,
    name: 'Baklava',
    amharic: 'ባክላዋ',
    description: 'Sweet pastry made of layers of filo, honey, and nuts',
    amharicDescription: 'ጣፋጭ፣ ከፊሎ ሽፋኖች፣ ማር እና ከኑግ የተሰራ',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1655925517336-1149ba1a4ee8', 
    category: 5,
    isVegetarian: true,
    containsNuts: true
  },
  {
    id: 12,
    name: 'Halva',
    amharic: 'ሃልዋ',
    description: 'Sweet tahini-based dessert with pistachios',
    amharicDescription: 'ጣፋጭ፣ በታሂኒ ላይ የተመሰረተ ከፒስታቾ ጋር',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1554232682-e9ef2ae2f116', 
    category: 5,
    isVegetarian: true,
    containsNuts: true
  }
];

const CustomerMenu: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  
  // Filter menu items based on search query
  const filteredItems = menuItems.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.amharic.includes(query) ||
      item.amharicDescription.includes(query)
    );
  });
  
  // Group items by category for display
  const getItemsByCategory = (categoryId: number) => {
    return filteredItems.filter(item => item.category === categoryId);
  };
  
  // Get popular items for featured section
  const popularItems = filteredItems.filter(item => item.popular);
  
  // Dietary & spice level badges
  const getDietaryBadges = (item: MenuItem) => {
    return (
      <div className="flex flex-wrap gap-1">
        {item.isVegetarian && (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <T text="Vegetarian" />
          </Badge>
        )}
        {item.isVegan && (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <T text="Vegan" />
          </Badge>
        )}
        {item.isGlutenFree && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <T text="Gluten Free" />
          </Badge>
        )}
        {item.containsNuts && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <T text="Contains Nuts" />
          </Badge>
        )}
      </div>
    );
  };
  
  const getSpiceLevelBadge = (level?: 1 | 2 | 3) => {
    if (!level) return null;
    
    let color;
    let text;
    
    switch (level) {
      case 1:
        color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        text = "Mild";
        break;
      case 2:
        color = "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
        text = "Medium";
        break;
      case 3:
        color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        text = "Hot";
        break;
    }
    
    return (
      <Badge variant="outline" className={color}>
        <T text={text} />
      </Badge>
    );
  };

  return (
    <Layout interface="customer">
      <PageHeader 
        title="Our Menu" 
        description="Explore our authentic Ethiopian and Eritrean dishes"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <QrCode className="mr-2 h-4 w-4" />
              <T text="Scan for Mobile Menu" />
            </Button>
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <T text="Order Now" />
            </Button>
          </div>
        }
      />
      
      <div className="relative w-full mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={currentLanguage === 'en' ? "Search our menu..." : "ምግብ ፈልግ..."}
          className="pl-10"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="featured" className="w-full mb-6">
        <ScrollArea className="w-full">
          <TabsList className="w-full justify-start h-12">
            <TabsTrigger value="featured">
              <T text="Featured" />
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={`category-${category.id}`}>
                <T text={category.name} />
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {popularItems.length > 0 ? (
              popularItems.map(item => (
                <MenuItemCard 
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedMenuItem(item)}
                  dietaryBadges={getDietaryBadges(item)}
                  spiceLevelBadge={getSpiceLevelBadge(item.spiceLevel)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  <T text="No featured items found" />
                </h3>
                <p className="text-muted-foreground">
                  <T text="Try adjusting your search query" />
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={`category-${category.id}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {getItemsByCategory(category.id).length > 0 ? (
                getItemsByCategory(category.id).map(item => (
                  <MenuItemCard 
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedMenuItem(item)}
                    dietaryBadges={getDietaryBadges(item)}
                    spiceLevelBadge={getSpiceLevelBadge(item.spiceLevel)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No items found in this category" />
                  </h3>
                  <p className="text-muted-foreground">
                    <T text="Try adjusting your search query" />
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Menu Item Detail Dialog */}
      <Dialog open={!!selectedMenuItem} onOpenChange={(open) => !open && setSelectedMenuItem(null)}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedMenuItem && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {currentLanguage === 'en' ? selectedMenuItem.name : selectedMenuItem.amharic}
                </DialogTitle>
                <DialogDescription>
                  {getSpiceLevelBadge(selectedMenuItem.spiceLevel)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img 
                    src={`${selectedMenuItem.image}?auto=format&fit=crop&w=600&h=300`}
                    alt={selectedMenuItem.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <p>
                  {currentLanguage === 'en' ? selectedMenuItem.description : selectedMenuItem.amharicDescription}
                </p>
                
                <div className="mt-2">
                  {getDietaryBadges(selectedMenuItem)}
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="text-2xl font-bold">£{selectedMenuItem.price.toFixed(2)}</div>
                  <Button>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <T text="Add to Order" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
  dietaryBadges: React.ReactNode;
  spiceLevelBadge: React.ReactNode;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onClick,
  dietaryBadges,
  spiceLevelBadge
}) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={`${item.image}?auto=format&fit=crop&w=600&h=300`}
          alt={item.name}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {currentLanguage === 'en' ? item.name : item.amharic}
          </CardTitle>
          <div className="text-lg font-bold">£{item.price.toFixed(2)}</div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground">
          {currentLanguage === 'en' ? item.description : item.amharicDescription}
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {dietaryBadges}
        </div>
        <div>
          {spiceLevelBadge}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CustomerMenu;
