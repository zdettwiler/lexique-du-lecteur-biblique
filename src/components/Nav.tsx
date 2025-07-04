import DarkModeSwitch from '@/components/DarkModeSwitch'

export default async function Nav() {
  return (
    <nav className="p-3 flex flex-row-reverse items-end">
      <DarkModeSwitch />
    </nav>
  )
};
