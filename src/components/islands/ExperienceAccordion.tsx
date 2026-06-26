/* ExperienceAccordion.tsx — expand/collapse roles; first open by default.
   All content arrives pre-localized as props (no astro:content on the client). */
import { useState } from 'react';
import { ChevronIcon } from './icons';

export interface TechMeta {
  name: string;
  logo: string | null;
  color: string;
  fg: string;
}

export interface ExpItem {
  company: string;
  logo: string | null;
  initials: string;
  color: string;
  dates: string;
  location: string;
  typeLabel: string;
  isPresent: boolean;
  position: string;
  fullDesc: string;
  achievements: string[];
  tech: TechMeta[];
}

interface Props {
  items: ExpItem[];
  labels: { keyAchievements: string; technologies: string; present: string };
}

function TechChip({ t }: { t: TechMeta }) {
  return (
    <span className="tech-chip">
      {t.logo ? (
        <span className="tech-ico tech-ico--logo" title={t.name}>
          <img src={t.logo} alt={`${t.name} logo`} loading="lazy" />
        </span>
      ) : (
        <span className="tech-ico" style={{ background: t.color, color: t.fg }} title={t.name}>
          {t.name.slice(0, 2)}
        </span>
      )}
      {t.name}
    </span>
  );
}

export default function ExperienceAccordion({ items, labels }: Props) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="exp-list">
      {items.map((item, i) => {
        const open = openIndex === i;
        const bodyId = `exp-body-${i}`;
        return (
          <div
            className={`exp-card ${open ? 'open' : ''} ${item.isPresent ? 'current' : ''}`.trim()}
            key={item.company + i}
          >
            <button
              type="button"
              className="exp-head"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => setOpenIndex(open ? -1 : i)}
            >
              <span
                className="exp-logo"
                style={item.logo ? undefined : { background: item.color }}
              >
                {item.logo ? (
                  <img src={item.logo} alt={`${item.company} logo`} loading="lazy" />
                ) : (
                  item.initials
                )}
              </span>
              <span className="exp-meta">
                <span className="exp-title-row">
                  {item.isPresent && <span className="exp-now-pill">{labels.present}</span>}
                  <span className="exp-position">{item.position}</span>
                </span>
                <span className="exp-company">{item.company}</span>
              </span>
              <span className="exp-right">
                <span className="exp-dates">{item.dates}</span>
                <span className="exp-loc">
                  {item.location} · {item.typeLabel}
                </span>
              </span>
              <ChevronIcon className="exp-chevron" size={20} />
            </button>
            {open && (
              <div className="exp-body" id={bodyId} role="region">
                {item.tech.length > 0 && (
                  <div className="exp-tech-row">
                    {item.tech.map((t) => (
                      <TechChip key={t.name} t={t} />
                    ))}
                  </div>
                )}
                <p className="exp-full">{item.fullDesc}</p>
                {item.achievements.length > 0 && (
                  <>
                    <h4 className="exp-section-h">{labels.keyAchievements}</h4>
                    <ul className="exp-achievements">
                      {item.achievements.map((a, j) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
