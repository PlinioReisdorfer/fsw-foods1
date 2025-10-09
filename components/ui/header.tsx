"use client";

import Image from "next/image";
import { Button } from "./button";
import { HeartIcon, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, ScrollTextIcon } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";


const Header = () => {
  const {data} = useSession();

  const handleSignOutClick = () => signOut();
  const handleSignInClick = () => signIn();

  return (
    <div className="flex justify-between px-5 pt-6">
      <div className="relative h-[30px] w-[100px]">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="FSW foods"
            fill
            className="object-cover"
          />
        </Link>
      </div>
      
      <Sheet>
        <SheetTrigger >
          <Button
          size="icon"
          variant="outline"
          className="b g-transparent border-none"
          >
        <MenuIcon/>
      </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          
          {data?.user ? <>
          <div className="flex justify-between pt-6">
            <div className="flex items-center gap-3">
              <Avatar>
              <AvatarImage className="rounded-full" src={data?.user?.image as string | undefined} />
              <AvatarFallback>{data?.user?.name?.split(" ")[0][0]}{data?.user?.name?.split(" ")[0][0]}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold">{data?.user?.name}</h3>
              <span className="block text-xs text-muted-foreground">{data?.user?.email}</span>
            </div>
            </div>

            
          </div>
          </> : (
            <>
              <div className="flex justify-between items-center pt-10">
               <h2 className="font-semibold">Olá, Faça seu Login</h2>
               <Button size="icon" onClick={handleSignInClick}><LogInIcon/></Button>
              </div>
            </>
          )}
        
        <div className="py-06">
          <Separator />
        </div>

          <div className="pt-5 space-y-1">
            <Button variant = "ghost" className="space-x-3 w-full justify-start text-sm font-normal rounded-full">
              <HomeIcon size={16}/>
              <span className="block">Inicio</span>
            </Button>

            {data?.user && (
              <>
              <Button variant = "ghost" className="space-x-3 w-full justify-start text-sm font-normal rounded-full">
              <ScrollTextIcon size={16}/>
              <span className="block">Meus Pedidos</span>
            </Button>

            <Button variant = "ghost" className="space-x-3 w-full justify-start text-sm font-normal rounded-full">
              <HeartIcon size={16}/>
              <span className="block">Restaurantes Favoritos</span>
            </Button>
            </>
            )}

          </div>
            <Separator/>


            {data?.user &&(
              <div className="py-6">
              <Button variant = "ghost" className="space-x-3 w-full justify-start text-sm font-normal rounded-full" onClick={handleSignOutClick}>
              <LogOutIcon size={16}/>
              <span className="block">Sair da Conta</span>
            </Button>
            </div>
            )}


        </SheetContent>
        </Sheet>
    </div>
  );
};

export default Header;
