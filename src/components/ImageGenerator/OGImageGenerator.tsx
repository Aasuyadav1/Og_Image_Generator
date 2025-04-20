import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Download,
  RefreshCw,
  Copy,
  PanelLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import PatternSelector from "./PatternSelector";
import ContentEditor from "./ContentEditor";
import PlatformPreview from "./PlatformPreview";
import TemplateSelector from "./TemplateSelector";
import {
  PatternSettings,
  defaultPatternSettings,
  generatePatternUrl,
  Template,
  TEMPLATES,
} from "@/lib/pattern-utils";
import GradientSelector from "./GradientSelector";
import ImagePreview from "./ImagePreview";

interface OGImageState {
  content: {
    title: string;
    subtitle: string;
    image?: string;
    layout:
      | "centered"
      | "left-image"
      | "right-image"
      | "bottom-image"
      | "top-image"
      | "overlay";
    textAlign?: "left" | "center" | "right";
  };
  patternStyle: PatternSettings;
  background: string;
}

const OGImageGenerator = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("design");
  const [patternUrl, setPatternUrl] = useState<string>("");
  const [state, setState] = useState<OGImageState>(() => {
    const initialState = {
      content: {
        title: "Create Beautiful OG Images",
        subtitle: "Generate perfect social media previews in seconds",
        image: undefined,
        layout: "centered" as const,
        textAlign: "center" as const,
      },
      patternStyle: defaultPatternSettings,
      background: "linear-gradient(225deg, #2A2A2A 0%, #121212 100%)",
    };
    return initialState;
  });
  const previewRef = useRef<HTMLDivElement>(null);

  // Initial state as a constant for reset
  const initialState: OGImageState = {
    content: {
      title: "Create Beautiful OG Images",
      subtitle: "Generate perfect social media previews in seconds",
      image: undefined,
      layout: "centered",
      textAlign: "center",
    },
    patternStyle: defaultPatternSettings,
    background: "linear-gradient(225deg, #2A2A2A 0%, #121212 100%)",
  };

  useEffect(() => {
    setPatternUrl(generatePatternUrl(state.patternStyle));
  }, [state.patternStyle]);

  const handleTemplateSelect = (template: Template) => {
    setState({
      content: { ...template.content },
      patternStyle: { ...template.pattern },
      background: template.background,
    });

    toast.success(`Applied template: ${template.name}`);
  };

  const handleResetChanges = () => {
    setState(initialState);
    toast.success("Reset to default settings");
  };

  const handlePatternChange = (newPattern: PatternSettings) => {
    setState((prev) => ({
      ...prev,
      patternStyle: newPattern,
    }));
  };

  const handleGradientChange = (newGradient: { background: string }) => {
    setState((prev) => ({
      ...prev,
      background: newGradient.background,
    }));
  };

  const handleLayoutChange = (layout: OGImageState["content"]["layout"]) => {
    setState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        layout,
      },
    }));
  };

  const handleTextAlignChange = (textAlign: "left" | "center" | "right") => {
    setState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        textAlign,
      },
    }));
  };

  const renderPreviewContent = () => {
    const { layout, title, subtitle, image, textAlign } = state.content;

    // Common text styles
    const titleClass = `font-bold text-white leading-tight mb-3 transition-all ${
      textAlign === "left"
        ? "text-left"
        : textAlign === "right"
        ? "text-right"
        : "text-center"
    }`;
    const subtitleClass = `text-white/80 transition-all ${
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
              <div className="w-1/2 mt-14 h-full flex items-center justify-center">
                <img
                  src={image}
                  alt="Featured"
                  className="h-full max-w-full object-right object-cover rounded-tr-xl"
                />
              </div>
            )}
            <div
              className={`${
                image ? "w-1/2" : "w-full"
              } h-full flex flex-col justify-center p-8`}
            >
              <h2
                className={`text-xl !text-left sm:text-2xl md:text-3xl ${titleClass}`}
              >
                {title}
              </h2>
              <p className={`text-sm !text-left sm:text-base ${subtitleClass}`}>
                {subtitle}
              </p>
            </div>
          </div>
        );

      case "right-image":
        return (
          <div className="flex flex-row h-full w-full">
            <div
              className={`${
                image ? "w-1/2" : "w-full"
              } h-full flex flex-col justify-center p-8`}
            >
              <h2
                className={`text-xl !text-left sm:text-2xl md:text-3xl ${titleClass}`}
              >
                {title}
              </h2>
              <p className={`text-sm !text-left sm:text-base ${subtitleClass}`}>
                {subtitle}
              </p>
            </div>
            {image && (
              <div className="w-1/2 h-full flex items-center justify-center mt-14">
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
            <div className="flex-1 flex flex-col justify-center p-8">
              <h2
                className={`text-xl sm:text-2xl !text-center md:text-3xl ${titleClass}`}
              >
                {title}
              </h2>
              <p
                className={`text-sm sm:text-base !text-center ${subtitleClass}`}
              >
                {subtitle}
              </p>
            </div>
            {image && (
              <div className="w-full mt-0 flex items-center justify-center ">
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
              <div className="w-full mb-auto">
                <img
                  src={image}
                  alt="Featured"
                  className="w-full object-cover"
                  style={{ maxHeight: "50%" }}
                />
              </div>
            )}
            <div className="flex-1 flex flex-col justify-center p-8">
              <h2 className={`text-xl sm:text-2xl md:text-3xl ${titleClass}`}>
                {title}
              </h2>
              <p className={`text-sm sm:text-base ${subtitleClass}`}>
                {subtitle}
              </p>
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
            <div className="relative flex flex-col h-full w-full items-center justify-center p-8 text-center">
              <h2 className={`text-xl sm:text-2xl md:text-3xl ${titleClass}`}>
                {title}
              </h2>
              <p className={`text-sm sm:text-base ${subtitleClass}`}>
                {subtitle}
              </p>
            </div>
          </div>
        );

      case "centered":
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            {image && (
              <div className="mb-6 max-w-[30%] max-h-[15%]">
                <img
                  src={image}
                  alt="Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            <h2 className={`text-xl sm:text-2xl md:text-3xl ${titleClass}`}>
              {title}
            </h2>
            <p className={`text-sm sm:text-base ${subtitleClass}`}>
              {subtitle}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        {/* <header className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              OG Image Generator
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetChanges}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </header> */}

        {/* <div className="p-6 pb-0">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-lg font-medium mb-4">Templates</h2>
            <TemplateSelector onSelectTemplate={handleTemplateSelect} />
          </div>
        </div> */}

        <div className="flex-1 p-6 ">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div
                className={`${!showSidebar && "hidden"} lg:block lg:col-span-5`}
              >
                <div className="glass-morphism rounded-lg border border-white/10 mb-6 overflow-hidden">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="design">Design</TabsTrigger>
                      <TabsTrigger value="content">Content</TabsTrigger>
                      {/* <TabsTrigger value="layout">Layout</TabsTrigger> */}
                    </TabsList>

                    <div className="p-6">
                      <TabsContent value="design" className="mt-0 space-y-6">
                        <PatternSelector
                          pattern={state}
                          onChange={handlePatternChange}
                        />
                        <GradientSelector
                          pattern={state}
                          onChange={handleGradientChange}
                        />
                      </TabsContent>

                      <TabsContent value="content" className="mt-0">
                        <ContentEditor
                          title={state.content.title}
                          subtitle={state.content.subtitle}
                          logo={state.content.image}
                          onTitleChange={(title) =>
                            setState((prev) => ({
                              ...prev,
                              content: { ...prev.content, title },
                            }))
                          }
                          onSubtitleChange={(subtitle) =>
                            setState((prev) => ({
                              ...prev,
                              content: { ...prev.content, subtitle },
                            }))
                          }
                          onLogoChange={(logo) =>
                            setState((prev) => ({
                              ...prev,
                              content: { ...prev.content, image: logo },
                            }))
                          }
                        />
                      </TabsContent>

                      {/* <TabsContent value="layout" className="mt-0 space-y-6">
                        <div>
                          <h3 className="text-sm font-medium mb-3">Layout Style</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {(['centered', 'left-image', 'right-image', 'bottom-image', 'top-image', 'overlay'] as const).map((layout) => (
                              <Button 
                                key={layout}
                                variant={state.content.layout === layout ? "default" : "outline"}
                                size="sm"
                                className="justify-start"
                                onClick={() => handleLayoutChange(layout)}
                              >
                                {layout.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-3">Text Alignment</h3>
                          <div className="flex gap-2">
                            {(['left', 'center', 'right'] as const).map((align) => (
                              <Button 
                                key={align}
                                variant={state.content.textAlign === align ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleTextAlignChange(align)}
                              >
                                {align.charAt(0).toUpperCase() + align.slice(1)}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </TabsContent> */}
                    </div>
                  </Tabs>
                </div>
              </div>

              <div className="lg:col-span-7 relative h-full">
                {/* <h2 className="text-lg font-medium ">Preview</h2>
                <div
                  className="sticky top-4 mb-4 mt-4 bg-background"
                  style={{ position: "-webkit-sticky" }}
                >
                  <div
                    ref={previewRef}
                    className="aspect-[1200/630] w-full rounded-lg overflow-hidden border border-white/10 shadow-xl animate-scale-in relative"
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: state.background }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: patternUrl,
                        backgroundSize: `${state.patternStyle.scale * 2}px`,
                      }}
                    />
                    <div className="relative w-full h-full">
                      {renderPreviewContent()}
                    </div>
                  </div>
                  <ImagePreview
                  content={state.content}
                  patternStyle={state.patternStyle}
                  background={state.background}
                  patternUrl={patternUrl}
                />
                  <div className="mt-6 glass-morphism rounded-lg border border-white/10 p-4">
                    <h3 className="text-lg font-medium mb-2">
                      About OG Images
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Open Graph (OG) images are essential for creating engaging
                      social media previews when your content is shared online.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>
                          OG images appear when your content is shared on
                          platforms like Twitter, Facebook, LinkedIn, and
                          Discord.
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>
                          High-quality OG images can significantly increase
                          engagement and click-through rates for your content.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div> */}
  
                <ImagePreview
                  content={state.content}
                  patternStyle={state.patternStyle}
                  background={state.background}
                  patternUrl={patternUrl}
                  onSelectTemplate={handleTemplateSelect}
                />

                {/* <div className="space-y-4 animate-slide-up">
                  <h3 className="text-base font-medium mb-3">
                    Platform Previews
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <PlatformPreview
                      canvasRef={previewRef}
                      pattern={patternUrl}
                      background={state.background}
                      title={state.content.title}
                      subtitle={state.content.subtitle}
                      logo={state.content.image}
                      platform="twitter"
                    />
                    <PlatformPreview
                      canvasRef={previewRef}
                      pattern={patternUrl}
                      background={state.background}
                      title={state.content.title}
                      subtitle={state.content.subtitle}
                      logo={state.content.image}
                      platform="linkedin"
                    />
                    <PlatformPreview
                      canvasRef={previewRef}
                      pattern={patternUrl}
                      background={state.background}
                      title={state.content.title}
                      subtitle={state.content.subtitle}
                      logo={state.content.image}
                      platform="facebook"
                    />
                    <PlatformPreview
                      canvasRef={previewRef}
                      pattern={patternUrl}
                      background={state.background}
                      title={state.content.title}
                      subtitle={state.content.subtitle}
                      logo={state.content.image}
                      platform="discord"
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OGImageGenerator;