"use client";
import { motion } from "framer-motion";

const features = [
  { id: "01", title: "Real-time Feedback", desc: "Instant analysis of your responses and technical accuracy." },
  { id: "02", title: "Persona Engine", desc: "Practice against aggressive or technical interviewers." },
  { id: "03", title: "Adaptive Flow", desc: "The AI evolves based on your performance in real-time." },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {features.map((f) => (
          <motion.div 
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group"
          >
            <span className="text-white/30 font-mono text-xs">{f.id} {"/"}/</span>
            <h3 className="text-white font-bold text-lg mt-2 uppercase tracking-tight">{f.title}</h3>
            <p className="text-neutral-500 text-sm mt-3 leading-relaxed group-hover:text-neutral-300 transition-colors">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}