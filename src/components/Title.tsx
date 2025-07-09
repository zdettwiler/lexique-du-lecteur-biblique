import Link from "next/link";
import Image from "next/image";

export default function Title() {
  return (
    <div className="mt-5 p-5">
      <Link href="/">
        <Image
          className="m-auto my-12 dark:invert"
          src="/img/logo-llb.svg"
          alt="logo llb"
          width={50}
          height={50}
          priority
        />
        <h1 className='font-serif text-5xl uppercase tracking-widest text-center mb-5'>Lexique du lecteur biblique</h1>
      </Link>
      <p className='font-serif text-xl italic text-center'>Lexique verset par verset pour le lecteur de la Bible dans ses langues originales.</p>
    </div>
  );
}
