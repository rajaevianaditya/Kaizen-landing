"use client";

import {
  Sparkles,
  Shield,
  Users,
  Zap,
  Trophy,
  Heart,
  Star,
  Globe,
  Swords,
  Gem,
} from "lucide-react";

const ICON_MAP = {
  sparkles: Sparkles,
  shield: Shield,
  users: Users,
  zap: Zap,
  trophy: Trophy,
  heart: Heart,
  star: Star,
  globe: Globe,
  swords: Swords,
  gem: Gem,
};

export default function FeaturesSection({ features }) {
  if (!features || features.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <h2>Kenapa Main di Sini</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = ICON_MAP[feature.icon] || Sparkles;
            return (
              <div className="feature-card" key={feature.id}>
                <div className="feature-card__icon">
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);
