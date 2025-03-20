import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import AppLayout from "@/components/Layout";
import { InventoryNav } from "@/components/inventory/InventoryNav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart2,
  PieChart,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { InventoryExport } from "@/components/inventory/InventoryExport";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#A3A3A3'];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name} ${(percent * 100).toFixed(0)}%`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Value: ${value})`}
      </text>
    </g>
  );
};

interface SectorProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
}

const Sector = (props: SectorProps) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  const RADIAN = Math.PI / 180;
  const start = { x: cx + outerRadius * Math.cos(-RADIAN * startAngle), y: cy + outerRadius * Math.sin(-RADIAN * startAngle) };
  const end = { x: cx + outerRadius * Math.cos(-RADIAN * endAngle), y: cy + outerRadius * Math.sin(-RADIAN * endAngle) };
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  const d = `M${start.x},${start.y} A${outerRadius},${outerRadius} 0 ${largeArcFlag},1 ${end.x},${end.y} L${cx + innerRadius * Math.cos(-RADIAN * endAngle)},${cy + innerRadius * Math.sin(-RADIAN * endAngle)} A${innerRadius},${innerRadius} 0 ${largeArcFlag},0 ${cx + innerRadius * Math.cos(-RADIAN * startAngle)},${cy + innerRadius * Math.sin(-RADIAN * startAngle)} Z`;
  return <path d={d} fill={fill} />;
};

const InventoryReports = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [ingredients, setIngredients] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [activePieIndex, setActivePieIndex] = useState(0);

  const handlePieEnter = useCallback(
    (entry: any, index: number) => {
      setActivePieIndex(index);
    },
    [setActivePieIndex]
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*');

      if (ingredientsError) {
        console.error("Error fetching ingredients:", ingredientsError);
        return;
      }

      setIngredients(ingredientsData);

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('inventory_transactions')
        .select('*, ingredient:ingredient_id(*)').limit(50);

      if (transactionsError) {
        console.error("Error fetching transactions:", transactionsError);
        return;
      }

      setTransactions(transactionsData);

      // Calculate total inventory value
      const totalValue = ingredientsData.reduce((acc, ingredient) => {
        const cost = ingredient.cost || 0;
        const stock = ingredient.stock_quantity || 0;
        return acc + (cost * stock);
      }, 0);
      setTotalInventoryValue(totalValue);

      // Count low stock items
      const lowStock = ingredientsData.filter(
        (ingredient) => (ingredient.stock_quantity || 0) <= (ingredient.reorder_level || 0)
      ).length;
      setLowStockCount(lowStock);

      // Count out of stock items
      const outOfStock = ingredientsData.filter(
        (ingredient) => (ingredient.stock_quantity || 0) === 0
      ).length;
      setOutOfStockCount(outOfStock);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const lowStockIngredients = ingredients.filter(
    (ingredient) => (ingredient.stock_quantity || 0) <= (ingredient.reorder_level || 0)
  );

  const categoryData = ingredients.reduce((acc: any, ingredient: any) => {
    const category = ingredient.category || "Uncategorized";
    const cost = ingredient.cost || 0;
    const stock = ingredient.stock_quantity || 0;
    const value = cost * stock;

    const existingCategory = acc.find((item: any) => item.name === category);
    if (existingCategory) {
      existingCategory.value += value;
    } else {
      acc.push({ name: category, value: value });
    }
    return acc;
  }, []);

  const topIngredientsByValue = ingredients.sort((a, b) => {
    const valueA = (a.cost || 0) * (a.stock_quantity || 0);
    const valueB = (b.cost || 0) * (b.stock_quantity || 0);
    return valueB - valueA;
  }).slice(0, 5).map(ingredient => ({
    name: ingredient.name,
    value: (ingredient.cost || 0) * (ingredient.stock_quantity || 0)
  }));

  const transactionTypeData = transactions.reduce((acc: any, transaction: any) => {
    const type = transaction.transaction_type;
    const existingType = acc.find((item: any) => item.name === type);
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  const transactionsByDay = transactions.reduce((acc: any, transaction: any) => {
    const date = format(new Date(transaction.created_at), 'yyyy-MM-dd');
    const type = transaction.transaction_type;

    let dayData = acc.find((item: any) => item.date === date);
    if (!dayData) {
      dayData = { date: date, purchases: 0, consumption: 0, adjustments: 0 };
      acc.push(dayData);
    }

    switch (type) {
      case 'purchase':
        dayData.purchases += transaction.quantity;
        break;
      case 'consumption':
        dayData.consumption += Math.abs(transaction.quantity);
        break;
      case 'adjustment':
        dayData.adjustments += transaction.quantity;
        break;
      default:
        break;
    }

    return acc;
  }, []).sort((a: any, b: any) => a.date.localeCompare(b.date));

  const handleExport = () => {
    alert('Exporting data...');
  };

  return (
    <AppLayout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Inventory Reports" />}
          description={<T text="Analyze inventory data and generate reports" />}
          actions={
            <>
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={loadData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                <T text="Refresh" />
              </Button>
              <InventoryExport onExport={handleExport} />
            </>
          }
        />

        <InventoryNav />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart2 className="h-4 w-4 mr-2" />
              <T text="Overview" />
            </TabsTrigger>
            <TabsTrigger value="categories">
              <PieChart className="h-4 w-4 mr-2" />
              <T text="Categories" />
            </TabsTrigger>
            <TabsTrigger value="low-stock">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <T text="Low Stock" />
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <T text="Transactions" />
            </TabsTrigger>
            <TabsTrigger value="trends">
              <Calendar className="h-4 w-4 mr-2" />
              <T text="Trends" />
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <T text="Total Inventory Value" />
                  </CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    <T text="Based on current stock and costs" />
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <T text="Low Stock Items" />
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lowStockCount}</div>
                  <p className="text-xs text-muted-foreground">
                    <T text="Items below reorder level" />
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <T text="Out of Stock" />
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{outOfStockCount}</div>
                  <p className="text-xs text-muted-foreground">
                    <T text="Items with zero quantity" />
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle><T text="Top Ingredients by Value" /></CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topIngredientsByValue}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                          <YAxis type="category" dataKey="name" width={70} />
                          <Tooltip 
                            formatter={(value) => `$${Number(value).toFixed(2)}`}
                            labelFormatter={(label) => `${label}`}
                          />
                          <Bar dataKey="value" fill="#8884d8" barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle><T text="Stock Status" /></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={0}
                          activeShape={renderActiveShape}
                          data={[
                            { name: "Normal Stock", value: ingredients.length - lowStockCount - outOfStockCount },
                            { name: "Low Stock", value: lowStockCount - outOfStockCount },
                            { name: "Out of Stock", value: outOfStockCount }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: "Normal Stock", value: ingredients.length - lowStockCount - outOfStockCount },
                            { name: "Low Stock", value: lowStockCount - outOfStockCount },
                            { name: "Out of Stock", value: outOfStockCount }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#4CAF50' : index === 1 ? '#FFA000' : '#FF5252'} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => value} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle><T text="Inventory Value by Category" /></CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          activeIndex={activePieIndex}
                          activeShape={renderActiveShape}
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                          onMouseEnter={handlePieEnter}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle><T text="Categories Breakdown" /></CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead className="text-right"><T text="Items" /></TableHead>
                      <TableHead className="text-right"><T text="Value" /></TableHead>
                      <TableHead className="text-right"><T text="Average Cost" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.map((category) => {
                      const categoryItems = ingredients.filter(ing => ing.category === category.name);
                      const itemCount = categoryItems.length;
                      const avgCost = category.value / itemCount;
                      
                      return (
                        <TableRow key={category.name}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="text-right">{itemCount}</TableCell>
                          <TableCell className="text-right">${category.value.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${avgCost.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Low Stock Tab */}
          <TabsContent value="low-stock" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle><T text="Low Stock Ingredients" /></CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Ingredient" /></TableHead>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead><T text="Current Stock" /></TableHead>
                      <TableHead><T text="Reorder Level" /></TableHead>
                      <TableHead><T text="Status" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        </TableCell>
                      </TableRow>
                    ) : lowStockIngredients.length > 0 ? (
                      lowStockIngredients.map((ingredient) => {
                        const stockLevel = ingredient.stock_quantity || 0;
                        const reorderLevel = ingredient.reorder_level || 0;
                        const stockRatio = stockLevel / reorderLevel;
                        let statusBadge: { label: string; variant: string } = { label: "", variant: "" };
                        
                        if (stockLevel === 0) {
                          statusBadge = { label: t("Out of Stock"), variant: "destructive" };
                        } else if (stockRatio <= 0.25) {
                          statusBadge = { label: t("Critical"), variant: "destructive" };
                        } else if (stockRatio <= 1) {
                          statusBadge = { label: t("Low"), variant: "warning" };
                        }
                        
                        return (
                          <TableRow key={ingredient.id}>
                            <TableCell className="font-medium">{ingredient.name}</TableCell>
                            <TableCell>{ingredient.category || "-"}</TableCell>
                            <TableCell>{stockLevel} {ingredient.unit}</TableCell>
                            <TableCell>{reorderLevel} {ingredient.unit}</TableCell>
                            <TableCell>
                              <Badge variant={statusBadge.variant as any}>
                                {statusBadge.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <p className="text-muted-foreground"><T text="No low stock items found" /></p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle><T text="Transaction Types" /></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={transactionTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {transactionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => value} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle><T text="Recent Transactions" /></CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><T text="Date" /></TableHead>
                        <TableHead><T text="Ingredient" /></TableHead>
                        <TableHead><T text="Type" /></TableHead>
                        <TableHead><T text="Quantity" /></TableHead>
                        <TableHead><T text="Notes" /></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          </TableCell>
                        </TableRow>
                      ) : transactions.length > 0 ? (
                        transactions.slice(0, 10).map((tx) => {
                          const txDate = tx.created_at ? new Date(tx.created_at) : new Date();
                          
                          return (
                            <TableRow key={tx.id}>
                              <TableCell>
                                {format(txDate, "yyyy-MM-dd HH:mm")}
                              </TableCell>
                              <TableCell className="font-medium">
                                {tx.ingredient?.name || tx.ingredient_id}
                              </TableCell>
                              <TableCell>
                                <Badge className={`
                                  ${tx.transaction_type === 'purchase' ? 'bg-green-500' : ''}
                                  ${tx.transaction_type === 'consumption' ? 'bg-blue-500' : ''}
                                  ${tx.transaction_type === 'adjustment' ? 'bg-amber-500' : ''}
                                  ${tx.transaction_type === 'waste' ? 'bg-red-500' : ''}
                                `}>
                                  {tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className={`
                                ${tx.quantity > 0 ? 'text-green-600' : ''}
                                ${tx.quantity < 0 ? 'text-red-600' : ''}
                              `}>
                                {tx.quantity > 0 ? '+' : ''}{tx.quantity} {tx.unit}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {tx.notes || "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            <p className="text-muted-foreground"><T text="No transactions found" /></p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle><T text="Transaction Trends (30 Days)" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={transactionsByDay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MM/dd")} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="purchases" 
                        name={t("Purchases")}
                        stroke="#4CAF50" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="consumption" 
                        name={t("Consumption")}
                        stroke="#2196F3" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="adjustments" 
                        name={t("Adjustments")}
                        stroke="#FFA000" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle><T text="Monthly Stock Value Trend" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: 'Jan', value: 8500 },
                        { month: 'Feb', value: 9800 },
                        { month: 'Mar', value: 10300 },
                        { month: 'Apr', value: 9200 },
                        { month: 'May', value: 11000 },
                        { month: 'Jun', value: 10500 },
                        { month: 'Jul', value: 11200 },
                        { month: 'Aug', value: 12300 },
                        { month: 'Sep', value: totalInventoryValue },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Bar dataKey="value" name={t("Stock Value")} fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  <T text="Note: Historical data is simulated for demonstration purposes" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default InventoryReports;
