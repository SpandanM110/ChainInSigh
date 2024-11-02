import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white font-bold text-lg">ChainInsight</div>
      <div>
        <ul className="flex items-center space-x-4"> {/* Ensures all items are centered vertically */}
          <li>
            <Link href="/" className="text-white">About</Link>
          </li>
          <li>
            <Link href="/generate" className="text-white">Odos AI</Link>
          </li>
          <li>
            <Link href="/NovesAPI" className="text-white">Noves AI</Link>
          </li>
          <li>
            <Link href="/describe" className="text-white">Describe Transaction</Link>
          </li>
          <li> {/* Wrap the ThemeToggle in a list item for consistent styling */}
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
