import React, { useState, useRef, useEffect } from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Move, 
  RotateCcw, 
  Maximize, 
  Square, 
  Circle, 
  MousePointer,
  AlertTriangle 
} from "lucide-react";

import { Table, Room, TableStatus } from "@/services/table/types";
import { useTableFloorPlan } from "@/hooks/useTableFloorPlan";
import NoData from "@/components/ui/no-data";

interface TableElementProps {
  table: Table;
  selected: boolean;
  onSelect: (table: Table) => void;
  mode: EditMode;
  onPositionChange: (tableId: string, position_x: number, position_y: number) => void;
  onSizeChange: (tableId: string, width: number, height: number) => void;
  onRotationChange: (tableId: string, rotation: number) => void;
}

type EditMode = 'select' | 'move' | 'resize' | 'rotate';

const TableElement: React.FC<TableElementProps> = ({ 
  table, 
  selected, 
  onSelect,
  mode,
  onPositionChange,
  onSizeChange,
  onRotationChange
}) => {
  const { t } = useLanguage();
  const elementRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: table.position_x || 0, y: table.position_y || 0 });
  const [size, setSize] = useState({ width: table.width || 100, height: table.height || 100 });
  const [rotation, setRotation] = useState(table.rotation || 0);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startRotation, setStartRotation] = useState(0);

  useEffect(() => {
    setPosition({ x: table.position_x || 0, y: table.position_y || 0 });
    setSize({ width: table.width || 100, height: table.height || 100 });
    setRotation(table.rotation || 0);
  }, [table]);

  const getStatusColor = (status: TableStatus): string => {
    switch (status) {
      case "available":
        return "bg-green-500/20 border-green-500";
      case "occupied":
        return "bg-red-500/20 border-red-500";
      case "reserved":
        return "bg-blue-500/20 border-blue-500";
      case "cleaning":
        return "bg-purple-500/20 border-purple-500";
      default:
        return "bg-gray-500/20 border-gray-500";
    }
  };

  const getShapeClass = (): string => {
    return table.shape === 'circle' ? 'rounded-full' : 'rounded-md';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    onSelect(table);
    
    if (mode === 'move') {
      setDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
    } else if (mode === 'resize') {
      setResizing(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartSize({ width: size.width, height: size.height });
    } else if (mode === 'rotate') {
      const newRotation = (rotation + 45) % 360;
      setRotation(newRotation);
      onRotationChange(table.id, newRotation);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      const newPosition = {
        x: position.x + dx,
        y: position.y + dy
      };
      setPosition(newPosition);
      setStartPos({ x: e.clientX, y: e.clientY });
      onPositionChange(table.id, newPosition.x, newPosition.y);
    }
    
    if (resizing) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      
      const newSize = {
        width: Math.max(50, startSize.width + dx),
        height: Math.max(50, startSize.height + dy)
      };
      
      setSize(newSize);
      onSizeChange(table.id, newSize.width, newSize.height);
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
    }
    
    if (resizing) {
      setResizing(false);
    }
  };

  useEffect(() => {
    if (dragging || resizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, startPos, startSize, position, size]);

  return (
    <div
      ref={elementRef}
      className={`absolute flex items-center justify-center border-2 cursor-pointer ${getShapeClass()} ${getStatusColor(table.status)} ${selected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `rotate(${rotation}deg)`,
        zIndex: selected ? 10 : 1,
        transition: mode === 'move' || mode === 'resize' ? 'none' : 'box-shadow 0.2s ease'
      }}
      onClick={() => onSelect(table)}
      onMouseDown={handleMouseDown}
    >
      <div className="text-center font-medium">
        <div>{t("Table")} {table.table_number}</div>
        <div className="text-xs">({table.capacity} {t("seats")})</div>
      </div>
    </div>
  );
};

const FloorPlanView: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<EditMode>('select');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    tables,
    rooms,
    currentRoomId,
    isLoading,
    error,
    updateTablePosition,
    updateTableSize,
    updateTableRotation,
    changeRoom,
    saveChanges,
    hasUnsavedChanges
  } = useTableFloorPlan();

  const handleSelectTable = (table: Table) => {
    if (editMode === 'select') {
      setSelectedTable(table);
    }
  };

  const handleRoomChange = (roomId: string) => {
    setSelectedTable(null);
    changeRoom(roomId === "all" ? null : roomId);
  };

  const toggleEditMode = () => {
    if (isEditing && hasUnsavedChanges) {
      const confirmExit = confirm("You have unsaved changes. Do you want to save them before exiting?");
      if (confirmExit) {
        saveChanges().then(() => {
          setIsEditing(false);
          setEditMode('select');
          setSelectedTable(null);
        });
        return;
      }
    }
    
    setIsEditing(!isEditing);
    setEditMode('select');
    setSelectedTable(null);
  };

  const changeEditTool = (mode: EditMode) => {
    setEditMode(mode);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedTable(null);
    }
  };

  const getCurrentRoomName = (): string => {
    if (!currentRoomId) return t("All Rooms");
    const room = rooms.find(r => r.id === currentRoomId);
    return room ? room.name : t("Unknown Room");
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">
          <T text="Floor Plan" /> - {getCurrentRoomName()}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Select
            value={currentRoomId || "all"}
            onValueChange={handleRoomChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Select Room")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Rooms")}</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={toggleEditMode}
          >
            {isEditing ? t("Exit Edit Mode") : t("Edit Floor Plan")}
          </Button>
        </div>
      </CardHeader>

      {isEditing && (
        <div className="px-6 py-2 border-b flex items-center space-x-2">
          <div className="mr-2 text-sm font-medium"><T text="Editing Tools:" /></div>
          
          <Button
            variant={editMode === 'select' ? "default" : "outline"}
            size="sm"
            onClick={() => changeEditTool('select')}
          >
            <MousePointer className="h-4 w-4 mr-1" />
            <T text="Select" />
          </Button>
          
          <Button
            variant={editMode === 'move' ? "default" : "outline"}
            size="sm"
            onClick={() => changeEditTool('move')}
          >
            <Move className="h-4 w-4 mr-1" />
            <T text="Move" />
          </Button>
          
          <Button
            variant={editMode === 'resize' ? "default" : "outline"}
            size="sm"
            onClick={() => changeEditTool('resize')}
          >
            <Maximize className="h-4 w-4 mr-1" />
            <T text="Resize" />
          </Button>
          
          <Button
            variant={editMode === 'rotate' ? "default" : "outline"}
            size="sm"
            onClick={() => changeEditTool('rotate')}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            <T text="Rotate" />
          </Button>
          
          <div className="flex-1"></div>
          
          {hasUnsavedChanges && (
            <div className="flex items-center text-amber-500 mr-2">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm"><T text="Unsaved changes" /></span>
            </div>
          )}
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => saveChanges()}
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-4 w-4 mr-1" />
            <T text="Save Changes" />
          </Button>
        </div>
      )}

      <CardContent className="flex-1 p-0">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p><T text="Loading floor plan..." /></p>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-red-500">{error.message}</p>
          </div>
        ) : tables.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <NoData message={t("No tables found in this room. Add tables to get started.")} />
          </div>
        ) : (
          <div 
            ref={canvasRef}
            className="relative w-full h-full min-h-[500px] overflow-auto bg-gray-100 dark:bg-gray-800"
            onClick={handleCanvasClick}
          >
            <div className="absolute inset-0 bg-grid-pattern" />
            
            {tables.map((table) => (
              <TableElement
                key={table.id}
                table={table}
                selected={selectedTable?.id === table.id}
                onSelect={handleSelectTable}
                mode={editMode}
                onPositionChange={updateTablePosition}
                onSizeChange={updateTableSize}
                onRotationChange={updateTableRotation}
              />
            ))}
          </div>
        )}
      </CardContent>

      {selectedTable && (
        <div className="border-t p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium"><T text="Table" /> {selectedTable.table_number}</h3>
              <p className="text-sm text-muted-foreground">
                <T text="Status" />: <Badge variant={
                  selectedTable.status === 'available' ? 'default' :
                  selectedTable.status === 'occupied' ? 'destructive' :
                  selectedTable.status === 'reserved' ? 'secondary' :
                  'outline'
                }>{selectedTable.status}</Badge>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm"><T text="Capacity" />: {selectedTable.capacity} <T text="seats" /></p>
              <p className="text-sm text-muted-foreground">
                <T text="Position" />: ({selectedTable.position_x}, {selectedTable.position_y})
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FloorPlanView;
