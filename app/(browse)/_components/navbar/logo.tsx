import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-2 hover:opacity-75 transition">
        <div className="p-1 mr-12 shrink-0 lg:mr-0 lg:shrink">
          <Image
            src="/image/switched-logo.svg"
            alt="Switched.fun"
            height="40"
            width="40"
            className=""
          />
        </div>
        <div className={cn("hidden lg:block", font.className)}>
          <p className="text-lg font-regular">Switched.fun</p>
        </div>
      </div>
    </Link>
  );
};
