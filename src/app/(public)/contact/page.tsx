"use client";
// ============================================
// Contact Page — Get in Touch
// ============================================
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import PageHero from "@/components/PageHero";
import { Input, Button } from "@/components/ui";
import { addContactMessage } from "@/lib/firestore";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set([formRef.current, infoRef.current], { opacity: 0, y: 40 });
    tl.to(formRef.current, { opacity: 1, y: 0, duration: 0.7, delay: 0.3 })
      .to(infoRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      await addContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        createdAt: new Date(),
        read: false,
      });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: "ri-map-pin-line", label: "Address", value: "123 Fitness Street, Andheri West, Mumbai 400058" },
    { icon: "ri-phone-line", label: "Phone", value: "+91 98765 43210" },
    { icon: "ri-mail-line", label: "Email", value: "hello@ironstone.gym" },
    { icon: "ri-time-line", label: "Hours", value: "Mon–Sat: 6 AM – 10 PM | Sun: 8 AM – 6 PM" },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-16">
        <PageHero
          badge="Get in Touch"
          badgeIcon="ri-chat-3-fill"
          title="Contact Us"
          highlight="Contact"
          description="Have a question or want to visit? Drop us a message and we'll get back to you within 24 hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
                  <i className="ri-error-warning-line mr-2"></i>
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-900/30 border border-green-800 rounded-xl text-green-400 text-sm">
                  <i className="ri-check-line mr-2"></i>
                  Message sent! We'll get back to you soon.
                </div>
              )}

              <Input
                label="Name"
                name="name"
                icon="ri-user-line"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                icon="ri-mail-line"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                icon="ri-phone-line"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
              />

              {/* Textarea — styled to match Input */}
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="auth-input w-full resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
              >
                Send Message
                <i className="ri-send-plane-fill ml-2"></i>
              </Button>
            </form>
          </div>

          {/* Contact Info + Map */}
          <div ref={infoRef} className="space-y-6">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 bg-surface-100 border border-zinc-800/50 rounded-2xl p-5
                           hover:border-zinc-600 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shrink-0">
                  <i className={`${item.icon} text-white text-lg`}></i>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">
                    {item.label}
                  </p>
                  <p className="text-white text-sm">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-zinc-800/50 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.9981768456!2d72.8367!3d19.1365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA4JzExLjQiTiA3MsKwNTAnMTIuMSJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="IronStone Gym Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
