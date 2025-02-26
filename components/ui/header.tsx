import Image from "next/image";
import { Button } from "./button";
import { MenuIcon } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between px-5 pt-6">
      <Image src="/logo.png" alt="FSW foods" height={30} width={100} />
      <Button
        size="icon"
        variant="outline"
        className="b g-transparent border-none"
      >
        <MenuIcon />
      </Button>
    </div>
  );
};

export default Header;
