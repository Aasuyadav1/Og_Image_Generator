
import { Template, TEMPLATES } from "@/lib/pattern-utils";
import { generatePatternUrl } from "@/lib/pattern-utils";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4 animate-slide-up">      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {TEMPLATES.map((template) => {
            const patternStyle = {
              backgroundImage: generatePatternUrl(template.pattern),
              background: template.pattern.background,
            };

            return (
              <CarouselItem key={template.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <Card 
                  className="overflow-hidden cursor-pointer border-white/10 hover:border-white/30 transition-all duration-200 transform hover:scale-[1.02]"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div 
                    className="h-32 relative"
                    style={patternStyle as React.CSSProperties}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                      {template.content.logo && (
                        <div className="mb-1 max-w-[25%] max-h-[25%]">
                          <img 
                            src={template.content.logo} 
                            alt="Logo" 
                            className="max-h-full max-w-full object-contain" 
                          />
                        </div>
                      )}
                      <p className="text-xs font-medium text-white leading-tight">{template.content.title}</p>
                      <p className="text-[10px] text-white/70 mt-1">{template.content.subtitle}</p>
                    </div>
                  </div>
                  <CardContent className="p-3 bg-black/40 flex items-center justify-between">
                    <p className="text-xs">{template.name}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="flex items-center justify-end mt-2">
          <CarouselPrevious className="relative static left-auto -translate-y-0 mr-2 h-8 w-8" />
          <CarouselNext className="relative static right-auto -translate-y-0 h-8 w-8" />
        </div>
      </Carousel>
    </div>
  );
};

export default TemplateSelector;
