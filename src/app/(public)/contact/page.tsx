import ContactSection from "@/components/public/ContactSection";

export default function ContactPage() {
  return (
    <div className="pt-10 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
          Have questions or want to book a free demo? We would love to hear from you. Reach out to us using the form below.
        </p>
      </div>
      <ContactSection />
    </div>
  );
}
