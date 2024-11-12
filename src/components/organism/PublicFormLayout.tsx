import Image from 'next/image';
import logo from '/assets/logo.svg';

export function PublicFormLayout({
    children,
    onSubmit,

    title
}: {
    children: JSX.Element | JSX.Element[];
    onSubmit?: () => void;

    title?: string;
}) {
    return (
        <section
            className={`flex md:w-[500px] w-full p-8 
            rounded-lg md:h-auto max-h-[900px] m-auto mt-auto ml-auto mr-auto flex-col gap-2 `}
        >
            <Image
                src={logo}
                alt="Logo"
                className="mb-10 self-center  w-[200px]"
            />
            <h2 className="mb-4">{title}</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit && onSubmit();
                }}
                className="flex flex-col gap-6"
            >
                {children}
            </form>
        </section>
    );
}
