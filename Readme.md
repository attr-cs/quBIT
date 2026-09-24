<div align="center">
  <img src="client/public/logo.png" alt="quBIT logo" width="84" />
  <h1>quBIT</h1>
  <p><strong>Code together. Build from anywhere.</strong></p>
  <p>A workspace for code, projects, and the people building them — evolving into a real-time collaborative coding platform.</p>
  <p>
    <a href="#the-vision">The vision</a> ·
    <a href="#the-roadmap">Roadmap</a> ·
    <a href="#use-cases">Use cases</a> ·
    <a href="#run-it-locally">Get started</a>
  </p>
</div>


## The vision

**What if writing code together felt like sitting at the same desk?** No screen sharing, no guessing which file someone means, no waiting for a teammate to save before you can see their idea.

quBIT is being built to make a workspace feel *alive*: open a project, see who's there and what they're viewing, jump into the same file, watch each other's cursors, and turn an idea into working code together. The existing workspace and editor are the foundation; the multiplayer experience is what comes next.

### The multiplayer experience we're building

| Planned capability | What it will feel like |
| :-- | :-- |
| **⚡ Live co-editing** | Multiple people type in the same file and see changes as they happen, without passing copies back and forth. |
| **🖱️ Named cursors and selections** | See where each teammate is typing or highlighting code, with a recognizable color and name. |
| **👀 Presence and active viewers** | Know who's online in a workspace, who's looking at a file, and who's actively editing it. |
| **🌲 Shared project activity** | New files, folders, and workspace changes appear for everyone without a manual refresh. |
| **🔑 Collaboration with boundaries** | Invite the right people into public or private spaces and build toward meaningful owner, editor, and viewer permissions. |
| **🔄 Smooth reconnects** | Rejoin a session and catch up with the latest shared state instead of losing your place. |

Beyond the core multiplayer experience, we're interested in **follow-a-teammate navigation, inline discussions, activity history, and better ways to review changes together**. These are ideas to explore, not features shipped today.

## Use cases

The same live workspace could help very different teams work together:

| For | Imagine... |
| :-- | :-- |
| **Pair programming** | Two developers exploring the same file, exchanging ideas through live edits and visible cursors. |
| **Remote teams** | Knowing who's working where instead of coordinating every change over chat or screen share. |
| **Classrooms & mentoring** | An instructor guiding students through code while everyone can see the context and each other's progress. |
| **Technical interviews** | Candidate and interviewer solving a problem together in one browser-based editor. |
| **Hackathons** | A small team creating a project quickly in shared workspaces, with files and teammates in one place. |
| **Open-source collaboration** | Walking a contributor through a tricky part of the codebase without sending screenshots or line numbers. |

> [!NOTE]
> These are **use cases for the planned real-time experience**. Today, quBIT supports browser-based workspaces and saving files, but it does not yet stream edits, cursors, or presence between users.

## The roadmap

| Stage | Status | What it includes |
| :-- | :-- | :-- |
| **01 · Workspace foundation** | Available in local development | Accounts, public/private workspaces, membership flows, nested files and folders, a Monaco code editor, tabs, and manual file saving. |
| **02 · Multiplayer core** | Planned | Shared document synchronization, live cursors and selections, presence, active file viewers, and real-time project updates. |
| **03 · Team workflow** | Exploring | Follow mode, discussions or comments, activity and revision history, and richer collaboration controls. |

**What's there today:** register or sign in, create and rename a workspace, toggle its visibility, join a public workspace or request access to a private one, organize files in a nested explorer, and edit in Monaco with syntax highlighting and <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>S</kbd> to save. The private-request approval API exists, but the owner's request inbox is not yet wired into the active page.

**What isn't there yet:** Socket.IO establishes a connection, but file edits are currently saved via HTTP, not synchronized across browsers. Yjs is included as a dependency for the intended collaborative direction; it has not been integrated into the editor or backend yet.

## How it's built

| Part | Technologies |
| :-- | :-- |
| **Browser** | React 19, TypeScript, Vite 7, Tailwind CSS 4, Monaco Editor, React Arborist |
| **Application state** | TanStack Query and Zustand |
| **API** | Express 5, JWT cookie authentication, Socket.IO connection handling |
| **Persistence** | PostgreSQL, Prisma 7, `@prisma/adapter-pg` |
| **Real-time direction** | Yjs + Socket.IO for planned document sync, cursors, and presence |

```mermaid
flowchart LR
    A["Teammate A<br/>React + Monaco"] -->|HTTP today| API["Express API<br/>auth · workspaces · files"]
    B["Teammate B<br/>React + Monaco"] -->|HTTP today| API
    API -->|Prisma| DB[(PostgreSQL)]
    A -.->|planned live edits| RT["Collaboration layer<br/>Yjs + Socket.IO"]
    B -.->|planned cursors + presence| RT
    RT -.->|planned persistence| DB
```

<details>
<summary><strong>Explore the repository</strong></summary>

```text
quBIT/
├── client/
│   ├── public/              # Logo and static assets
│   └── src/
│       ├── api/             # HTTP and Socket.IO clients
│       ├── components/      # Monaco editor, file tree, workspace controls
│       ├── pages/           # Authentication and workspace screens
│       └── store/           # Local user and editor state
├── docs/                    # README concept illustration
├── server/
│   ├── db/                  # PostgreSQL / Prisma connection
│   ├── prisma/              # Data model and migrations
│   ├── src/                 # Routes, controllers, middleware, sockets
│   └── server.js            # Express + Socket.IO entry point
└── package.json             # Starts frontend and backend together
```

</details>

## Run it locally

### Requirements

- Node.js **20.19+ (Node 20)** or **22.12+**, with npm
- A running PostgreSQL server and an empty `qubit` database (for example, `createdb -U postgres qubit`)

### Set up

```bash
git clone https://github.com/attr-cs/quBIT.git
cd quBIT

npm ci
npm ci --prefix client
npm ci --prefix server
```

Create `server/.env` with your own local database credentials and a random JWT secret:

```dotenv
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/qubit?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
```

Initialize a **fresh, disposable local database** and generate the Prisma client:

```bash
cd server
npx prisma db push
npx prisma generate
cd ..
```

Start the app:

```bash
npm run dev
```

Open **[localhost:5173](http://localhost:5173)** for the browser app; the API runs at **[localhost:3000](http://localhost:3000)**. The checked-in `client/.env.development` already targets `http://localhost:3000/api`. If you change the local ports, also update the hard-coded Socket.IO URL in `client/src/api/socket.ts` and CORS origin in `server/server.js`.

<details>
<summary><strong>Development notes</strong></summary>

- The checked-in migrations have not caught up with `server/prisma/schema.prisma`. Use `prisma db push` **only for a fresh development database**; create and review migrations before using existing data or deploying.
- The frontend's `npm run build --prefix client` and `npm run lint --prefix client` currently report existing TypeScript and ESLint errors; use `npm run dev` for local exploration.
- Cookie settings, per-file authorization, and localhost-only networking need hardening before public deployment.

</details>

## Contributing

Want to help bring multiplayer coding to life? [Open an issue](https://github.com/attr-cs/quBIT/issues), pick a roadmap item, or submit a focused pull request. Contributions to real-time sync, presence, permissions, documentation, and build health are all welcome.

## License

The root [`package.json`](package.json) declares the **ISC** license; a standalone `LICENSE` file has not yet been added.
