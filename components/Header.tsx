// components/Header.tsx
"use client";

import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  // Удаляем неиспользуемое состояние
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full  ">
      <div className="max-w-7xl mx-auto ">
        <div className="flex h-[80px] justify-between items-center ">
          <div className="flex items-center">
              <div className="cursor-default" aria-label="Sahara AI Logo">
                <Image
                  src="/logo.svg"
                  alt="Sahara AI Logo"
                  width={160}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
 
            <LanguageSwitcher />
          </nav>

        
        </div>
      </div>


    </header>
  );
}
