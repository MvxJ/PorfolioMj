/* llms.txt — machine-readable orientation file for LLMs / AI agents.
   Generated from the CMS content at build time. Served at /llms.txt. */
import type { APIRoute } from 'astro';
import { localize } from '../i18n';
import {
  getSite,
  getHero,
  getProjects,
  getExperience,
  getTech,
} from '../lib/content';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/+$/, '') ?? 'https://maks.dev';
  const s = await getSite();
  const hero = await getHero();
  const projects = await getProjects();
  const experience = await getExperience();
  const tech = await getTech();

  const name = s?.name ?? 'Maks Jachymczak';
  const role = localize(s?.role, 'en') ?? 'Senior Software Engineer';
  const tagline = localize(hero?.tagline, 'en') ?? '';
  const stack = tech.map((t) => t.data.name).join(', ');

  const lines: string[] = [];
  lines.push(`# ${name} — ${role}`);
  lines.push('');
  lines.push(`> ${tagline}`);
  lines.push('');
  lines.push(`Languages: Polish (default), English, Ukrainian. Based in Warsaw, Poland.`);
  lines.push(`Tech stack: ${stack}.`);
  lines.push('');
  lines.push('## Pages');
  lines.push(`- [Home](${origin}/en): intro, tech stack, featured projects`);
  lines.push(`- [About](${origin}/en/about): bio, skills, education, certifications`);
  lines.push(
    `- [Experience](${origin}/en/experience): roles at ${experience
      .map((e) => e.data.company)
      .join(', ')}`,
  );
  lines.push(`- [Projects](${origin}/en/projects): ${projects.length} selected projects`);
  lines.push(`- [Contact](${origin}/en/contact): how to get in touch`);
  lines.push('');
  lines.push('## Projects');
  for (const p of projects) {
    const title = localize(p.data.title, 'en') ?? p.id;
    const desc = localize(p.data.desc, 'en') ?? '';
    lines.push(`- [${title}](${origin}/en/projects/${p.id}) (${p.data.year}) — ${desc}`);
  }
  lines.push('');
  lines.push('## Contact');
  if (s?.email) lines.push(`- Email: ${s.email}`);
  for (const social of s?.socials ?? []) {
    lines.push(`- ${social.label}: ${social.url}`);
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
