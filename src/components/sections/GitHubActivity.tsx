import { GitCommitHorizontal } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const USER = "kumarsumitjais";
const REVALIDATE = 3600; // refresh at most hourly; unauthenticated GitHub API allows 60 req/h

interface Day { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
interface Commit { repo: string; message: string; url: string; date: string }

const gh = (path: string) =>
  fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate: REVALIDATE },
  }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

async function getContributions(): Promise<{ total: number; days: Day[] } | null> {
  // GitHub only exposes the contribution calendar via GraphQL with a token,
  // so use the public jogruber proxy that scrapes the profile calendar.
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { total: data.total.lastYear, days: data.contributions };
  } catch {
    return null;
  }
}

async function getLatestCommits(): Promise<Commit[]> {
  try {
    const repos: { name: string; fork: boolean }[] = await gh(`/users/${USER}/repos?sort=pushed&per_page=4`);
    const perRepo = await Promise.all(
      repos
        .filter((r) => !r.fork)
        .slice(0, 3)
        .map(async (r) => {
          const commits: { sha: string; html_url: string; commit: { message: string; author: { date: string } } }[] =
            await gh(`/repos/${USER}/${r.name}/commits?per_page=2`).catch(() => []);
          return commits.map((c) => ({
            repo: r.name,
            message: c.commit.message.split("\n")[0],
            url: c.html_url,
            date: c.commit.author.date,
          }));
        })
    );
    return perRepo.flat().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  } catch {
    return [];
  }
}

const LEVEL_CLASS = [
  "bg-border-card/60",
  "bg-emerald-500/30",
  "bg-emerald-500/55",
  "bg-emerald-500/80",
  "bg-emerald-400",
];

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export async function GitHubActivity() {
  const [contrib, commits] = await Promise.all([getContributions(), getLatestCommits()]);
  if (!contrib && commits.length === 0) return null;

  // Pad the start so columns line up as Sun→Sat weeks, like GitHub's calendar.
  const days = contrib?.days ?? [];
  const pad = days.length ? new Date(days[0].date).getUTCDay() : 0;
  const cells: (Day | null)[] = [...Array(pad).fill(null), ...days];

  return (
    <section className="py-20 border-t border-border-card">
      <div className="container mx-auto px-5 md:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">Live from GitHub</h2>
            <p className="text-text-secondary max-w-xl">
              Pulled from the GitHub API, refreshed hourly. What I&apos;m actually shipping, not just what I list.
            </p>
          </div>
          <a
            href={`https://github.com/${USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-electric-blue-500 dark:text-electric-blue-400 hover:text-electric-blue-400"
          >
            <FaGithub className="w-4 h-4" /> @{USER}
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {contrib && (
            <div className="lg:col-span-3 bg-bg-elevated border border-border-card rounded-2xl p-6">
              <p className="font-mono text-sm text-text-secondary mb-4">
                <span className="text-text-primary font-bold">{contrib.total}</span> contributions in the last year
              </p>
              {/* rtl scroller starts at the right end, so narrow screens show the most recent weeks */}
              <div className="overflow-x-auto pb-2 [direction:rtl]">
                <div className="grid grid-rows-7 grid-flow-col gap-[3px] w-max [direction:ltr]" role="img" aria-label={`${contrib.total} GitHub contributions in the last year`}>
                  {cells.map((d, i) =>
                    d ? (
                      <div
                        key={d.date}
                        title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                        className={`w-[11px] h-[11px] rounded-[2px] ${LEVEL_CLASS[d.level]}`}
                      />
                    ) : (
                      <div key={`pad-${i}`} className="w-[11px] h-[11px]" />
                    )
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-1 mt-3 text-[11px] text-text-secondary font-mono">
                less {LEVEL_CLASS.map((c) => <span key={c} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />)} more
              </div>
            </div>
          )}

          {commits.length > 0 && (
            <div className="lg:col-span-2 bg-bg-elevated border border-border-card rounded-2xl p-6">
              <p className="font-mono text-sm text-text-secondary mb-4">latest commits</p>
              <ul className="space-y-4">
                {commits.map((c) => (
                  <li key={c.url} className="flex gap-3">
                    <GitCommitHorizontal className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-text-primary hover:text-electric-blue-400 truncate"
                        title={c.message}
                      >
                        {c.message}
                      </a>
                      <p className="text-xs font-mono text-text-secondary">
                        {c.repo} · {timeAgo(c.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
