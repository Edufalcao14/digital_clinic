
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

type ToothCondition = 
  | 'healthy' 
  | 'decayed' 
  | 'filled' 
  | 'missing' 
  | 'crown' 
  | 'bridge' 
  | 'implant'
  | 'root-canal';

type ToothPart = 'top' | 'right' | 'bottom' | 'left' | 'center';

type ToothData = {
  condition: ToothCondition;
  parts: Record<ToothPart, ToothCondition>;
};

interface OdontogramProps {
  onChange?: (teeth: Record<number, ToothData>) => void;
  initialData?: Record<number, ToothData>;
  readOnly?: boolean;
}

const defaultToothData: ToothData = {
  condition: 'healthy',
  parts: {
    top: 'healthy',
    right: 'healthy',
    bottom: 'healthy',
    left: 'healthy',
    center: 'healthy',
  },
};

// Represents FDI notation (international tooth numbering)
// Each quadrant has teeth numbered 1-8
const adultTeeth = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
  lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
};

const conditionColors: Record<ToothCondition, string> = {
  'healthy': 'bg-white',
  'decayed': 'bg-yellow-500',
  'filled': 'bg-blue-500',
  'missing': 'bg-gray-300',
  'crown': 'bg-gray-500',
  'bridge': 'bg-purple-500',
  'implant': 'bg-green-500',
  'root-canal': 'bg-red-500',
};

const Odontogram: React.FC<OdontogramProps> = ({ 
  onChange, 
  initialData = {}, 
  readOnly = false 
}) => {
  const [selectedCondition, setSelectedCondition] = useState<ToothCondition>('decayed');
  const [teethData, setTeethData] = useState<Record<number, ToothData>>(() => {
    const data: Record<number, ToothData> = {};
    
    // Initialize all teeth with default data
    [...adultTeeth.upperRight, ...adultTeeth.upperLeft, ...adultTeeth.lowerRight, ...adultTeeth.lowerLeft].forEach(
      (toothId) => {
        data[toothId] = initialData[toothId] || { ...defaultToothData };
      }
    );
    
    return data;
  });

  const handleToothPartClick = (toothId: number, part: ToothPart) => {
    if (readOnly) return;
    
    setTeethData((prev) => {
      const updatedData = {
        ...prev,
        [toothId]: {
          ...prev[toothId],
          parts: {
            ...prev[toothId].parts,
            [part]: selectedCondition,
          },
        },
      };
      
      onChange?.(updatedData);
      return updatedData;
    });
  };

  const handleToothClick = (toothId: number) => {
    if (readOnly) return;
    
    setTeethData((prev) => {
      const updatedData = {
        ...prev,
        [toothId]: {
          ...prev[toothId],
          condition: selectedCondition,
          parts: {
            top: selectedCondition,
            right: selectedCondition,
            bottom: selectedCondition,
            left: selectedCondition,
            center: selectedCondition,
          },
        },
      };
      
      onChange?.(updatedData);
      return updatedData;
    });
  };

  const renderTooth = (toothId: number) => {
    const toothData = teethData[toothId] || defaultToothData;
    
    return (
      <div 
        key={toothId} 
        className="relative w-12 h-12 m-1 select-none"
        onClick={() => handleToothClick(toothId)}
      >
        <div className="absolute text-xs font-semibold left-0 -top-4 w-full text-center">
          {toothId}
        </div>
        
        {/* Top part */}
        <div 
          className={cn(
            "absolute top-0 left-1/4 w-1/2 h-1/4 border border-gray-400 cursor-pointer",
            conditionColors[toothData.parts.top]
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleToothPartClick(toothId, 'top');
          }}
        />
        
        {/* Right part */}
        <div 
          className={cn(
            "absolute top-1/4 right-0 w-1/4 h-1/2 border border-gray-400 cursor-pointer",
            conditionColors[toothData.parts.right]
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleToothPartClick(toothId, 'right');
          }}
        />
        
        {/* Bottom part */}
        <div 
          className={cn(
            "absolute bottom-0 left-1/4 w-1/2 h-1/4 border border-gray-400 cursor-pointer",
            conditionColors[toothData.parts.bottom]
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleToothPartClick(toothId, 'bottom');
          }}
        />
        
        {/* Left part */}
        <div 
          className={cn(
            "absolute top-1/4 left-0 w-1/4 h-1/2 border border-gray-400 cursor-pointer",
            conditionColors[toothData.parts.left]
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleToothPartClick(toothId, 'left');
          }}
        />
        
        {/* Center part */}
        <div 
          className={cn(
            "absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-gray-400 cursor-pointer",
            conditionColors[toothData.parts.center]
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleToothPartClick(toothId, 'center');
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Odontogram</h3>
      
      {!readOnly && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Select Condition:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(conditionColors).map(([condition, colorClass]) => (
              <button
                key={condition}
                className={cn(
                  "px-3 py-1 text-xs rounded border border-gray-300",
                  selectedCondition === condition ? "ring-2 ring-dental-500" : "",
                  condition === 'healthy' ? "bg-white" : colorClass,
                  condition === 'healthy' || condition === 'missing' ? "text-gray-800" : "text-white"
                )}
                onClick={() => setSelectedCondition(condition as ToothCondition)}
              >
                {condition.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="odontogram-container">
        {/* Upper jaw */}
        <div className="flex justify-center mb-8">
          <div className="flex">
            {adultTeeth.upperRight.map(renderTooth)}
          </div>
          <div className="flex">
            {adultTeeth.upperLeft.map(renderTooth)}
          </div>
        </div>
        
        {/* Jaw separator */}
        <div className="h-0.5 bg-gray-300 mx-10 mb-8"></div>
        
        {/* Lower jaw */}
        <div className="flex justify-center">
          <div className="flex">
            {adultTeeth.lowerRight.map(renderTooth)}
          </div>
          <div className="flex">
            {adultTeeth.lowerLeft.map(renderTooth)}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(conditionColors).map(([condition, colorClass]) => (
            <div key={condition} className="flex items-center">
              <div className={cn("w-4 h-4 mr-1 border border-gray-400", colorClass)}></div>
              <span className="text-xs">{condition.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Odontogram;
