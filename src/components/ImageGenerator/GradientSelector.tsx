
import { useState } from "react";
import { PatternSettings } from "@/lib/pattern-utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PRESET_GRADIENTS, PRESET_COLORS } from "@/lib/gradient-utils";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GradientSelectorProps {
  pattern: PatternSettings;
  onChange: (pattern: PatternSettings) => void;
}

const GradientSelector = ({ pattern, onChange }: GradientSelectorProps) => {
  const [gradientAngle, setGradientAngle] = useState(135);
  const [colorStart, setColorStart] = useState("#3B82F6");
  const [colorEnd, setColorEnd] = useState("#8B5CF6");

  const handleGradientSelect = (gradient: string) => {
    const updatedPattern = { ...pattern, background: gradient };
    onChange(updatedPattern);
  };

  const handleCustomGradientChange = () => {
    const customGradient = `linear-gradient(${gradientAngle}deg, ${colorStart} 0%, ${colorEnd} 100%)`;
    const updatedPattern = { ...pattern, background: customGradient };
    onChange(updatedPattern);
  };

  const handleColorSelect = (color: string) => {
    const updatedPattern = { ...pattern, background: color };
    onChange(updatedPattern);
  };

  const handleSolidColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPattern = { ...pattern, background: e.target.value };
    onChange(updatedPattern);
  };

  const handleAngleChange = (value: number[]) => {
    setGradientAngle(value[0]);
    setTimeout(handleCustomGradientChange, 10);
  };

  const handleStartColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorStart(e.target.value);
    setTimeout(handleCustomGradientChange, 10);
  };

  const handleEndColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorEnd(e.target.value);
    setTimeout(handleCustomGradientChange, 10);
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Background</h3>
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose background style: gradient, custom, or solid color</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="glass-morphism rounded-lg p-4">
        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="preset">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="solid">Solid</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {PRESET_GRADIENTS.map((gradient, index) => (
                <div 
                  key={index}
                  className="h-20 rounded-md overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all"
                  style={{ background: gradient }}
                  onClick={() => handleGradientSelect(gradient)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-0">
            <div className="space-y-4">
              <div className="h-20 rounded-md overflow-hidden mb-4" 
                style={{ background: `linear-gradient(${gradientAngle}deg, ${colorStart} 0%, ${colorEnd} 100%)` }} 
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="angle">Gradient Angle</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Slider 
                      id="angle"
                      min={0} 
                      max={360} 
                      step={1} 
                      value={[gradientAngle]} 
                      onValueChange={handleAngleChange}
                    />
                    <span className="text-sm w-10 text-right">{gradientAngle}°</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="start-color">Start Color</Label>
                    <div className="flex gap-2 mt-1.5">
                      <div className="w-10 h-10 rounded border border-white/10 overflow-hidden">
                        <input 
                          type="color" 
                          id="start-color" 
                          value={colorStart} 
                          onChange={handleStartColorChange}
                          className="h-12 w-12 -m-1 cursor-pointer"
                        />
                      </div>
                      <input 
                        type="text" 
                        value={colorStart} 
                        onChange={handleStartColorChange}
                        className="flex-1 bg-black/20 border border-white/10 rounded px-3 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="end-color">End Color</Label>
                    <div className="flex gap-2 mt-1.5">
                      <div className="w-10 h-10 rounded border border-white/10 overflow-hidden">
                        <input 
                          type="color" 
                          id="end-color" 
                          value={colorEnd} 
                          onChange={handleEndColorChange}
                          className="h-12 w-12 -m-1 cursor-pointer"
                        />
                      </div>
                      <input 
                        type="text" 
                        value={colorEnd} 
                        onChange={handleEndColorChange}
                        className="flex-1 bg-black/20 border border-white/10 rounded px-3 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="solid" className="mt-0">
            <div className="space-y-4">
              <div 
                className="h-20 rounded-md overflow-hidden mb-4" 
                style={{ background: pattern.background.startsWith('#') || pattern.background.startsWith('rgb') ? pattern.background : '#000000' }} 
              />

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {PRESET_COLORS.map((color, index) => (
                  <div 
                    key={index}
                    className="h-10 rounded-md overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all"
                    style={{ background: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>

              <div>
                <Label htmlFor="solid-color">Custom Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <div className="w-10 h-10 rounded border border-white/10 overflow-hidden">
                    <input 
                      type="color" 
                      id="solid-color" 
                      value={pattern.background.startsWith('#') ? pattern.background : '#000000'} 
                      onChange={handleSolidColorChange}
                      className="h-12 w-12 -m-1 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={pattern.background} 
                    onChange={handleSolidColorChange}
                    placeholder="#000000 or rgb(0,0,0)"
                    className="flex-1 bg-black/20 border border-white/10 rounded px-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GradientSelector;
