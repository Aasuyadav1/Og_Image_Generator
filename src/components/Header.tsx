import React from "react";

const Header = () => {
  return (
    <header className="w-full max-w-screen-xl mx-auto mt-6  py-6 px-4 glass-morphism rounded-lg mb-8 animate-fade-in">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#4a90e2]/10 text-[#4a90e2] text-xs font-medium mb-2">
            OG Image Generator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Create Beautiful Social Previews
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mt-2">
            Design eye-catching images for social media platforms with our
            intuitive editor
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
