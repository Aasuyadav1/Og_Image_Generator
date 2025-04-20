import { Heart } from "lucide-react";
const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 py-6 mt-12">
      <div className="container flex items-center justify-center">
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          © {new Date().getFullYear()} - Made with 
          <Heart className="w-4 h-4 fill-red-500 text-red-500" /> 
          by{" "}
          <a 
            href="https://aasuyadav.com" 
            target="_blank"
            className="text-primary hover:text-primary/80 transition-colors underline decoration-dotted underline-offset-4"
          >
            Aasu
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;