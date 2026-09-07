import { Link, createFileRoute } from "@tanstack/react-router";
import { useHydrated, useNexus } from "@/lib/nexus/store";
import { visibleTranscript } from "@/lib/nexus/chat-tree";

export const Route = createFileRoute("/chats")({ component: Chats });

function Chats() {
  const hydrated = useHydrated();
  const storiesMap = useNexus((s) => s.stories);
  const chats = useNexus((s) => s.chats);
  const messages = useNexus((s) => s.messages);
  const characters = useNexus((s) => s.characters);
  const list = Object.values(storiesMap).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <main className="pb-8">
      <header className="px-4 pt-6 pb-4 pr-36 lg:px-8 lg:pr-40">
        <h1 className="font-display text-3xl tracking-tight">Chats</h1>
        <p className="mt-1 text-sm text-muted">Pick up the scene where you left it.</p>
      </header>
      {!hydrated && list.length === 0 ? (
        <div className="px-3">
          <div className="h-52 rounded-xl bg-surface" />
        </div>
      ) : list.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="font-display text-2xl">No chats yet</p>
          <p className="mt-2 text-sm text-muted">Open someone from Discover and begin.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 px-3 pb-6 lg:px-8">
          {list.map((story) => {
            const last = visibleTranscript(chats[story.chatId], messages).at(-1);
            const faces = story.characterIds.map((id) => characters[id]).filter(Boolean).slice(0, 3);
            return (
              <li key={story.id}>
                <Link
                  to="/play/$id"
                  params={{ id: story.id }}
                  className="relative block overflow-hidden rounded-xl bg-elevated"
                >
                  <div className="relative h-48 w-full sm:h-56">
                    {story.image ? (
                      <img src={story.image} alt="" className="size-full object-cover object-top" />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-display text-2xl text-fg">{story.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {last?.content.replace(/\s+/g, " ").slice(0, 140) || story.description}
                      </p>
                      <p className="mt-2 text-xs text-subtle">{faces.map((c) => c.name).join(" · ")}</p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
