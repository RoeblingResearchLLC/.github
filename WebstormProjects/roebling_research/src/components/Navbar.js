// components/Navbar.js
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-black text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-semibold">
                    <Link href="/" className="text-white hover:text-gray-400 transition-colors duration-300">
                        Roebling Research
                    </Link>
                </div>
                <ul className="flex space-x-8">
                    <li>
                        <Link href="/" className="text-sm uppercase hover:text-gray-400 transition-colors duration-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="text-sm uppercase hover:text-gray-400 transition-colors duration-300">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/services" className="text-sm uppercase hover:text-gray-400 transition-colors duration-300">
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="text-sm uppercase hover:text-gray-400 transition-colors duration-300">
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
