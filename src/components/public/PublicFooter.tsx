import Link from "next/link";
import Logo from "@/components/Logo";
import { MapPin, Mail, Phone, Share2, Video } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size="md" light />
            <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-sm">
              AI-powered coaching platform for Maharashtra State Board students in Mumbai.
              Guided by Prem Sir's vision of "Smart Learning. Better Future."
            </p>
            <p className="text-blue-400 italic text-sm mt-3 font-medium">
              "Priyadarsani Classes — Where Learning Begins..."
            </p>
            <div className="flex gap-3 mt-4">
              {[
              { icon: Share2, label: "Instagram" },
              { icon: Video, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-slate-300 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "#home", label: "Home" },
                { href: "#about", label: "About Us" },
                { href: "#courses", label: "Courses" },
                { href: "#ai-learning", label: "AI Learning" },
                { href: "#teachers", label: "Teachers" },
                { href: "#contact", label: "Contact" },
                { href: "/login", label: "Student Login" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-slate-300 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>Mumbai, Maharashtra<br />(Address to be provided)</span>
              </li>
              <li className="flex gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>+91 [Number to be provided]</span>
              </li>
              <li className="flex gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>info@priyadarsaniclasses.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-slate-500 text-xs">
          <p>© 2024 Priyadarsani Classes. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
