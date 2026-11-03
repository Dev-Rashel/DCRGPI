import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import type { TeamMemberDTO } from "@/lib/types";
import { initials } from "@/lib/utils";

export function TeamCard({ member }: { member: TeamMemberDTO }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition duration-500 hover:border-gold-400/30">
      <div className="relative aspect-[4/5] overflow-hidden">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover grayscale-[35%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900">
            <span className="font-display text-5xl text-gold-400/40">{initials(member.name)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-300">
            {member.designation}
          </p>
          <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight text-cream">{member.name}</h3>
          {member.department && (
            <p className="mt-1 text-[0.7rem] text-cream/50">{member.department}</p>
          )}
        </div>
        <div className="absolute right-4 top-4 flex translate-y-2 flex-col gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {member.socialLinks.facebook && (
            <a
              href={member.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Facebook`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/80 text-cream/80 backdrop-blur transition hover:bg-gold-400 hover:text-ink-950"
            >
              <Facebook className="h-3.5 w-3.5" />
            </a>
          )}
          {member.socialLinks.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/80 text-cream/80 backdrop-blur transition hover:bg-gold-400 hover:text-ink-950"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          )}
          {member.socialLinks.instagram && (
            <a
              href={member.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Instagram`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/80 text-cream/80 backdrop-blur transition hover:bg-gold-400 hover:text-ink-950"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
          )}
          {member.socialLinks.email && (
            <a
              href={`mailto:${member.socialLinks.email}`}
              aria-label={`Email ${member.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/80 text-cream/80 backdrop-blur transition hover:bg-gold-400 hover:text-ink-950"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
      {member.bio && (
        <p className="line-clamp-2 px-5 py-4 text-xs leading-relaxed text-cream/50">{member.bio}</p>
      )}
    </article>
  );
}
