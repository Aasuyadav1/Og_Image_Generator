import { Template, TEMPLATES } from "@/lib/pattern-utils";
import { generatePatternUrl } from "@/lib/pattern-utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  const renderTemplateContent = (template: Template) => {
    const { layout, title, subtitle, image, textAlign } = template.content;

    // Common text styles matching renderPreviewContent
    const titleClass = `font-bold text-white leading-tight mb-1 transition-all text-xs ${
      textAlign === "left"
        ? "text-left"
        : textAlign === "right"
        ? "text-right"
        : "text-center"
    }`;
    const subtitleClass = `text-white/80 transition-all text-[10px] ${
      textAlign === "left"
        ? "text-left"
        : textAlign === "right"
        ? "text-right"
        : "text-center"
    }`;

    switch (layout) {
      case "left-image":
        return (
          <div className="flex flex-row h-full w-full">
            {image && (
              <div className="w-1/2 h-full flex items-center justify-center mt-4">
                <img
                  src={image}
                  alt="Featured"
                  className="h-full w-full object-right object-cover rounded-tr-xl"
                />
              </div>
            )}
            <div
              className={`${
                image ? "w-1/2" : "w-full"
              } h-full flex flex-col justify-center *:!text-left p-2`}
            >
              <h2 className={titleClass}>{title}</h2>
              <p className={subtitleClass}>{subtitle}</p>
            </div>
          </div>
        );

      case "right-image":
        return (
          <div className="flex flex-row h-full w-full">
            <div
              className={`${
                image ? "w-1/2" : "w-full"
              } h-full flex flex-col justify-center p-2`}
            >
              <h2 className={titleClass}>{title}</h2>
              <p className={subtitleClass}>{subtitle}</p>
            </div>
            {image && (
              <div className="w-1/2 h-full mt-4 flex items-center justify-center -z-0">
                <img
                  src={image}
                  alt="Featured"
                  className="h-full w-full object-left object-cover rounded-tl-xl"
                />
              </div>
            )}
          </div>
        );

      case "bottom-image":
        return (
          <div className="flex flex-col h-full w-full">
            <div className="flex-1 flex flex-col justify-center p-2">
              <h2 className={titleClass}>{title}</h2>
              <p className={subtitleClass}>{subtitle}</p>
            </div>
            {image && (
              <div className="w-full h-1/2 flex items-center justify-center">
                <img
                  src={image}
                  alt="Featured"
                  className="w-[95%] object-cover h-full rounded-t-xl"
                />
              </div>
            )}
          </div>
        );

      case "top-image":
        return (
          <div className="flex flex-col h-full w-full">
            {image && (
              <div className="w-full h-1/2">
                <img
                  src={image}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 flex flex-col justify-center p-2">
              <h2 className={titleClass}>{title}</h2>
              <p className={subtitleClass}>{subtitle}</p>
            </div>
          </div>
        );

      case "overlay":
        return (
          <div className="relative h-full w-full">
            {image && (
              <img
                src={image}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative flex flex-col h-full w-full items-center justify-center p-2 text-center">
              <h2 className={titleClass}>{title}</h2>
              <p className={subtitleClass}>{subtitle}</p>
            </div>
          </div>
        );

      case "centered":
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
            {image && (
              <div className="mb-1 max-w-[25%] max-h-[25%]">
                <img
                  src={image}
                  alt="Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            <h2 className={titleClass}>{title}</h2>
            <p className={subtitleClass}>{subtitle}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between mt-2">
          <h2 className="font-medium mb-4">Templates</h2>
          <div className="flex items-center">
            <CarouselPrevious className="relative  left-auto -translate-y-2 mr-2 h-8 w-8" />
            <CarouselNext className="relative right-auto -translate-y-2 h-8 w-8" />
          </div>
        </div>
        <CarouselContent className="-ml-2 md:-ml-4">
          {TEMPLATES.map((template) => {
            const patternStyle = {
              backgroundImage: generatePatternUrl(template.pattern),
              background: template.background,
            };

            return (
              <CarouselItem
                key={template.id}
                className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/3"
              >
                <Card
                  className="overflow-hidden cursor-pointer border-white/10 hover:border-white/30"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div
                    className="h-32 relative overflow-hidden"
                    style={patternStyle as React.CSSProperties}
                  >
                    {renderTemplateContent(template)}
                  </div>
                  <CardContent className="p-3 bg-black/40 flex items-center justify-between !z-[9999]">
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
      </Carousel>
    </div>
  );
};

export default TemplateSelector;
