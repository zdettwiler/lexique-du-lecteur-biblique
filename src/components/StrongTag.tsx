export default function StrongTag({ strong }: { strong: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-1 text-xs font-sans font-semibold border border-gray-500">
      {strong}
    </span>
  );
}
