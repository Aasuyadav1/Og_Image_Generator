import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const InfoSection = () => {
  return (
    <section className="mt-6 max-w-screen-xl mx-auto mb-20 animate-fade-in">
      <div className="glass-morphism rounded-lg p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          What are OG Images?
        </h2>

        <div className="grid grid-cols-1 mt-10 md:grid-cols-2 gap-8">
          <div className="">
            <h3 className="text-xl font-semibold text-[#4a90e2]">
              The Power of Open Graph
            </h3>
            <p className="text-muted-foreground mt-3">
              Open Graph (OG) images are the visual previews that appear when
              your content is shared on social media platforms. They
              significantly increase engagement, click-through rates, and share
              counts by providing a visual representation of your content.
            </p>

            <h3 className="text-xl font-semibold text-[#4a90e2] mt-10">
              Where OG Images Appear
            </h3>
            <ul className="space-y-2 mt-3 ml-2 text-muted-foreground list-disc list-inside">
              <li>Social media feeds (Twitter/X, Facebook, LinkedIn)</li>
              <li>Messaging apps like Discord, Slack, and WhatsApp</li>
              <li>Search engine results with rich snippets</li>
              <li>Link preview cards in various applications</li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-xl font-semibold text-[#4a90e2]">
              How to Use OG Images
            </h3>
            <p className="text-muted-foreground mt-3">
              Add the following meta tags to your HTML{" "}
              <code className="bg-secondary/50 px-1.5 py-0.5 rounded text-xs">
                &lt;head&gt;
              </code>{" "}
              section:
            </p>

            <div className="bg-black/30 mt-3 p-4 rounded-md overflow-x-auto text-sm">
              <pre className="text-xs md:text-sm text-white/90">
                {`<meta property="og:image" content="https://yourdomain.com/your-og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:title" content="Your Page Title" />
<meta property="og:description" content="Your page description here" />`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold text-[#4a90e2] mt-8">
              Why They Matter
            </h3>
            <p className="text-muted-foreground mt-3">
              Content with compelling OG images receives up to{" "}
              <span className="text-white font-medium">
                40% more engagement
              </span>{" "}
              than content without. They create a professional impression and
              help your content stand out in crowded social feeds.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a href="https://kaydee.net/blog/open-graph-image/" target="_blank">
            <Button className="bg-[#4a90e2]/80 hover:bg-[#4a90e2] text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn More About Open Graph
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
