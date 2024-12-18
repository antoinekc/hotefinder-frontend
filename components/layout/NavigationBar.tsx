import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from 'next/link';

export const NavigationBar = () => {

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {/* <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className="px-4 py-2">À propos</NavigationMenuLink>
          </Link> */}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};