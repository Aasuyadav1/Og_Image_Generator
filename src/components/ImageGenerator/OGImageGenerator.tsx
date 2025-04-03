// OGImageGenerator.tsx
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

interface OGImageState {
  content: {
    title: string;
    subtitle: string;
    image?: string;
  };
  patternStyle: PatternSettings;
  background: string; // Keeping it as background as requested
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

    console.log("tempatle pater", template.pattern);
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

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6 border-b border-white/10">
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
        </header>

        <div className="p-6 pb-0">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-lg font-medium mb-4">Templates</h2>
            <TemplateSelector onSelectTemplate={handleTemplateSelect} />
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
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
                    </div>
                  </Tabs>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="mb-6 sticky top-0">
                  <h2 className="text-lg font-medium mb-4">Preview</h2>
                  <div
                    ref={previewRef}
                    className="aspect-[1200/630] w-full rounded-lg overflow-hidden border border-white/10 shadow-xl animate-scale-in relative"
                  >
                    {/* Background layer */}
                    <div
                      className="absolute inset-0"
                      style={{ background: state.background }}
                    />
                    {/* Pattern layer */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: patternUrl,
                        backgroundSize: `${state.patternStyle.scale * 2}px`,
                      }}
                    />
                    {/* Content layer */}
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center">
                      {state.content.image && (
                        <div className="mb-6 max-w-[30%] max-h-[15%]">
                          <img
                            src={state.content.image}
                            alt="Logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-3 transition-all">
                        {state.content.title}
                      </h2>
                      <p className="text-sm sm:text-base text-white/80 transition-all">
                        {state.content.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 animate-slide-up">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OGImageGenerator;
