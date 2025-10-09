import Link from "next/link";
import DarkModeSwitch from "@/components/DarkModeSwitch";

export default async function Nav() {
  return (
    <nav className="p-3 flex flex-row items-center justify-end space-x-4">
      {/* <Link href="" className="text-md font-medium text-gray-600 dark:text-gray-400">Télécharcher le LLB</Link> */}
      <DarkModeSwitch />
    </nav>
  );
}
