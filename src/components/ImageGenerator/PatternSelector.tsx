import { useState, useEffect } from "react";
import { PatternSettings, PatternType, generatePatternUrl } from "@/lib/pattern-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HelpCircle, Grid, Circle, Hash, TrendingUp, Hexagon, CloudFog } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface PatternSelectorProps {
  pattern: {
    patternStyle: PatternSettings;
    background: string;
    content: {
      title: string;
      subtitle: string;
      image?: string;
    };
  };
  onChange: (pattern: PatternSettings) => void;
}

const PatternSelector = ({ pattern, onChange }: PatternSelectorProps) => {
  const [currentPattern, setCurrentPattern] = useState<PatternSettings>(pattern.patternStyle);
  const [activeTab, setActiveTab] = useState<PatternType>(pattern.patternStyle.type);

  // Add useEffect to sync the local state with props when they change
  useEffect(() => {
    setCurrentPattern(pattern.patternStyle);
    setActiveTab(pattern.patternStyle.type);
  }, [pattern.patternStyle]);

  const handlePatternChange = (type: PatternType) => {
    const updatedPattern = { ...currentPattern, type };
    setCurrentPattern(updatedPattern);
    setActiveTab(type);
    onChange(updatedPattern);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPattern = { ...currentPattern, color: e.target.value };
    setCurrentPattern(updatedPattern);
    onChange(updatedPattern);
  };

  const handleOpacityChange = (value: number[]) => {
    const updatedPattern = { ...currentPattern, opacity: value[0] };
    setCurrentPattern(updatedPattern);
    onChange(updatedPattern);
  };

  const handleScaleChange = (value: number[]) => {
    const updatedPattern = { ...currentPattern, scale: value[0] };
    setCurrentPattern(updatedPattern);
    onChange(updatedPattern);
  };

  const patternPreviewStyle = {
    backgroundImage: generatePatternUrl(currentPattern),
    backgroundSize: `${currentPattern.scale * 2}px`,
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Pattern Overlay</h3>
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select and customize your pattern overlay</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="glass-morphism rounded-lg px-4 py-8">
        <Tabs 
          value={activeTab || 'grid'} 
          className="w-full" 
          onValueChange={(value) => handlePatternChange(value as PatternType)}
        >
          <TabsList className="grid !border !border-neutral-700 h-full p-2 grid-cols-6 w-full mb-4">
            <TabsTrigger value="grid" className="flex flex-col items-center gap-1.5 p-2">
              <Grid className="h-4 w-4" />
              <span className="text-xs">Grid</span>
            </TabsTrigger>
            <TabsTrigger value="dots" className="flex flex-col items-center gap-1.5 p-2">
              <Circle className="h-4 w-4" />
              <span className="text-xs">Dots</span>
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex flex-col items-center gap-1.5 p-2">
              <Hash className="h-4 w-4" />
              <span className="text-xs">Graph</span>
            </TabsTrigger>
            <TabsTrigger value="diagonal" className="flex flex-col items-center gap-1.5 p-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Lines</span>
            </TabsTrigger>
            <TabsTrigger value="honeycomb" className="flex flex-col items-center gap-1.5 p-2">
              <Hexagon className="h-4 w-4" />
              <span className="text-xs">Hex</span>
            </TabsTrigger>
            <TabsTrigger value="noise" className="flex flex-col items-center gap-1.5 p-2">
              <CloudFog className="h-4 w-4" />
              <span className="text-xs">Noise</span>
            </TabsTrigger>
          </TabsList>

          <div className="h-16 w-full rounded-md overflow-hidden mb-4 transition-all duration-300 border border-neutral-700 shadow-md" 
            style={patternPreviewStyle as React.CSSProperties}
          />
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="pattern-color">Pattern Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <div className="!w-10 h-10 rounded border border-white/10 overflow-hidden">
                    <input 
                      type="color" 
                      id="pattern-color" 
                      value={currentPattern.color} 
                      onChange={handleColorChange}
                      className="h-12 w-12 -m-1 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={currentPattern.color} 
                    onChange={handleColorChange}
                    className="bg-black/20 border border-white/10 rounded px-3 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-3">
                  <Label htmlFor="pattern-opacity">Opacity</Label>
                  <span className="text-xs text-muted-foreground">{Math.round(currentPattern.opacity * 100)}%</span>
                </div>
                <Slider 
                  id="pattern-opacity"
                  min={0.01} 
                  max={0.3} 
                  step={0.01} 
                  value={[currentPattern.opacity]} 
                  onValueChange={handleOpacityChange}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-3">
                  <Label htmlFor="pattern-scale">Pattern Size</Label>
                  <span className="text-xs text-muted-foreground">{currentPattern.scale}px</span>
                </div>
                <Slider 
                  id="pattern-scale"
                  min={5} 
                  max={50} 
                  step={1} 
                  value={[currentPattern.scale]} 
                  onValueChange={handleScaleChange}
                />
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default PatternSelector;