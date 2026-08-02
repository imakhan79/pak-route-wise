import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/zicon-logo.png';
import { MagneticButton } from './MagneticButton';

const NAV_LINKS = ['Products', 'Solutions', 'Industries', 'Resources', 'Pricing'];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[hsl(1,20%,8%)]/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Zicon Technology" className="h-9 w-auto drop-shadow-[0_0_12px_rgba(242,154,26,0.35)]" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="group relative text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {link}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[hsl(36,89%,53%)] to-[hsl(1,58%,45%)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/login" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Login
          </Link>
          <MagneticButton variant="secondary" className="!px-6 !py-2.5 !text-xs">
            Get Started
          </MagneticButton>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-[hsl(1,20%,8%)]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {NAV_LINKS.map((link) => (
                <a key={link} href="#" className="text-sm font-medium text-white/80">
                  {link}
                </a>
              ))}
              <Link to="/login" className="text-sm font-medium text-white/80">
                Login
              </Link>
              <MagneticButton variant="secondary" className="!px-6 !py-2.5 !text-xs w-fit">
                Get Started
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
