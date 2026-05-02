import React, { useRef } from 'react';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aarav Mehta',
    role: 'CTO, NovaByte',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    quote: 'True Link replaced three tools for us. The call quality alone is worth every penny.',
  },
  {
    id: 2,
    name: 'Sofia Reyes',
    role: 'Product Lead, Stackly',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    quote: 'Our remote standups went from chaotic to seamless overnight. Genuinely impressive.',
  },
  {
    id: 3,
    name: 'James Okafor',
    role: 'Founder, Verdesk',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    quote: 'The no-account join feature alone convinced our entire client base to switch.',
  },
  {
    id: 4,
    name: 'Priya Nair',
    role: 'Engineering Manager, Flux',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    quote: 'Screen sharing that actually works without lag. Finally.',
  },
  {
    id: 5,
    name: 'Lucas Bauer',
    role: 'Co-founder, Archon',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    quote: 'End-to-end encryption gave our legal team the confidence to move fully remote.',
  },
  {
    id: 6,
    name: 'Aisha Kamara',
    role: 'Head of Design, Luma',
    img: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&q=80',
    quote: 'The UI is the cleanest I have seen in any comms tool. Our team adopted it in a day.',
  },
  {
    id: 7,
    name: 'Rohan Verma',
    role: 'DevOps Lead, Cloudpeak',
    img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80',
    quote: 'Smart popups meant zero missed messages during our product launch crunch.',
  },
  {
    id: 8,
    name: 'Elena Sokolova',
    role: 'CEO, Mintflow',
    img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&q=80',
    quote: 'I recommended True Link to four other founders in the same week. It\'s that good.',
  },
];

// Split into two rows
const ROW1 = TESTIMONIALS.slice(0, 8);

// ── Flip Card ─────────────────────────────────────────────────────────────────
function FlipCard({ person }) {
  return (
    <div className="flip-card">
      <div className="flip-inner">
        {/* FRONT */}
        <div className="flip-front">
          <img src={person.img} alt={person.name} className="flip-photo" />
          <div className="flip-front-info">
            <span className="flip-name">{person.name}</span>
            <span className="flip-role">{person.role}</span>
          </div>
        </div>
        {/* BACK */}
        <div className="flip-back">
          <div className="flip-quote-icon">"</div>
          <p className="flip-quote">{person.quote}</p>
          <div className="flip-back-info">
            <span className="flip-name">{person.name}</span>
            <span className="flip-role">{person.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Marquee Row ───────────────────────────────────────────────────────────────
function MarqueeRow({ items, reverse = false }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-row ${reverse ? 'marquee-row--reverse' : ''}`}>
      <div className={`marquee-track ${reverse ? 'marquee-track--reverse' : ''}`}>
        {doubled.map((person, i) => (
          <FlipCard key={`${person.id}-${i}`} person={person} />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export const Testimonials = () => {
  return (
    <section className="testimonials-section">
      {/* Header */}
      <div className="testi-header">
        <p className="testi-eyebrow">Loved by teams worldwide</p>
        <h2 className="testi-heading">
         True Link grows with you!
        </h2>
        <p className="testi-sub">
          Thousands of teams use True Link every day. Here's what they say.
        </p>
      </div>

      <div className="marquee-container">
        <MarqueeRow items={ROW1} />
      </div>
      <div className="marquee-fade-left" />
    </section>
  );
};
