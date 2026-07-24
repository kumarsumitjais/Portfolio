import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-border-card bg-bg-base py-12 md:py-16 mt-20">
      <div className="container mx-auto px-5 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-display font-semibold tracking-tight inline-block mb-4 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm">
              Sumit Kr. Jaiswal<span className="text-electric-blue-500">.</span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-xs">
              Behind Every Great Prediction Is an Even Better Question.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
              <span className="text-sm font-medium text-text-primary">Available for opportunities</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm inline-block">About</Link></li>
              <li><Link href="/skills" className="text-sm text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm inline-block">Skills</Link></li>
              <li><Link href="/blog" className="text-sm text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm inline-block">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Work</h3>
            <ul className="space-y-3">
              <li><Link href="/projects" className="text-sm text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm inline-block">Projects</Link></li>
              <li><Link href="/research" className="text-sm text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm inline-block">Research</Link></li>
              <li><Link href="/experience" className="text-sm text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm inline-block">Experience</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Connect</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm inline-block">Contact</Link></li>
              <li><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm inline-block">Resume</a></li>
              <li className="flex items-center gap-4 pt-2">
                <a href="https://github.com/kumarsumitjais" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm">
                  <FaGithub className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/in/sumit-kr-jaiswal-4979132ba" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-text-secondary hover:text-electric-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border-card/50">
          <p className="text-xs text-text-secondary mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Sumit Kr. Jaiswal. All rights reserved. 
            <span className="mx-2 opacity-50">|</span> 
            <span className="font-mono text-[10px]">build: a1b2c3d</span>
          </p>
          
          <button 
            // NOTE: In App Router, smooth scrolling to top requires a client component wrapper if we want to use onClick directly.
            // But for simplicity in a server component, we can use an anchor link to top or handle it cautiously.
            // Since Footer is often imported in a server layout, we shouldn't use onClick if it's a Server Component.
            // Changing to <a href="#"> for now.
            aria-label="Back to top"
            className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm"
          >
            <a href="#" className="flex items-center gap-2">Back to top <ArrowUp className="w-3 h-3" /></a>
          </button>
        </div>
      </div>
    </footer>
  );
}
