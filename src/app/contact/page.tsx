import { Mail, MapPin } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 bg-bg-elevated border border-border-card rounded-3xl p-8 md:p-12 shadow-level-2">
        <div>
          <h1 className="text-4xl font-display font-bold mb-6 text-text-primary">
            Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue-500 to-cyan-400">great.</span>
          </h1>
          <p className="text-text-secondary mb-12 text-lg">
            Whether you have a question, a project in mind, or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-text-secondary hover:text-electric-blue-500 transition-colors">
              <div className="w-12 h-12 bg-bg-card border border-border-card rounded-full flex items-center justify-center text-electric-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <a href="mailto:jaiswal.sumit0789@gmail.com" className="text-lg font-medium">jaiswal.sumit0789@gmail.com</a>
            </div>
            
            <div className="flex items-center gap-4 text-text-secondary">
              <div className="w-12 h-12 bg-bg-card border border-border-card rounded-full flex items-center justify-center text-electric-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-lg font-medium">India</span>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <a href="https://github.com/kumarsumitjais" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-bg-card border border-border-card rounded-full flex items-center justify-center text-text-secondary hover:text-electric-blue-500 transition-colors hover:border-electric-blue-500/50">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/sumit-kr-jaiswal-4979132ba" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-bg-card border border-border-card rounded-full flex items-center justify-center text-text-secondary hover:text-electric-blue-500 transition-colors hover:border-electric-blue-500/50">
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="bg-bg-card border border-border-card rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-electric-blue-500/5 to-transparent pointer-events-none" />
          <h3 className="text-xl font-bold text-text-primary mb-6">Send a quick message</h3>
          <form className="space-y-4 relative z-10" action="mailto:jaiswal.sumit0789@gmail.com" method="GET" encType="text/plain">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Name / Subject</label>
              <input type="text" name="subject" className="w-full bg-bg-elevated border border-border-card rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-electric-blue-500 transition-shadow" placeholder="Hi Sumit!" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Message</label>
              <textarea name="body" rows={4} className="w-full bg-bg-elevated border border-border-card rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-electric-blue-500 transition-shadow resize-none" placeholder="How can I help you?"></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-electric-blue-500 text-white font-medium rounded-xl hover:bg-electric-blue-400 transition-colors shadow-level-1 hover:shadow-level-2 hover:-translate-y-0.5">
              Open Mail App
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
