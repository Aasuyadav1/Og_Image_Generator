
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ContentEditorProps {
  title: string;
  subtitle: string;
  logo?: string;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  onLogoChange: (logo?: string) => void;
}

const ContentEditor = ({
  title,
  subtitle,
  logo,
  onTitleChange,
  onSubtitleChange,
  onLogoChange,
}: ContentEditorProps) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTitleChange(e.target.value);
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSubtitleChange(e.target.value);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large. Maximum size is 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        onLogoChange(event.target?.result as string);
        toast.success("Logo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large. Maximum size is 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        onLogoChange(event.target?.result as string);
        toast.success("Logo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onLogoChange(undefined);
    toast.success("Logo removed");
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Textarea
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter your title here"
          className="resize-none bg-black/20 border-white/10 focus:border-white/20"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Textarea
          id="subtitle"
          value={subtitle}
          onChange={handleSubtitleChange}
          placeholder="Enter your subtitle here"
          className="resize-none bg-black/20 border-white/10 focus:border-white/20"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo or Image</Label>
        <div
          className={`h-32 rounded-lg border-2 border-dashed transition-colors ${
            dragging
              ? "border-primary/70 bg-primary/5"
              : "border-white/10 hover:border-white/30"
          } flex items-center justify-center relative cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {logo ? (
            <div className="relative w-full h-full flex items-center justify-center p-3">
              <img
                src={logo}
                alt="Logo preview"
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeLogo();
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600/80 transition-colors"
                aria-label="Remove logo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="text-center p-4">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to upload your logo
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG or SVG (max 2MB)
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            id="logo"
            accept="image/*"
            className="sr-only"
            onChange={handleLogoUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
