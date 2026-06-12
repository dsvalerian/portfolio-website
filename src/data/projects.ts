export interface Project {
	slug: string;
	number: string;
	name: string;
	tagline: string;
	year: string;
	tags: string[];
	brief: string;
	overview: string;
	problem: string;
	solution: string;
	stack: string[];
	outcome: string;
	links?: { label: string; url: string }[];
}

export const projects: Project[] = [
	{
		slug: "floor-supervisor",
		number: "01",
		name: "FLOORSUPERVISOR.COM",
		tagline: "DJ portfolio website",
		year: "2026",
		tags: ["REACT", "SANITY CMS", "TYPESCRIPT", "HTML", "CSS", "CLOUDFLARE"],
		brief: "A customizeable portfolio website for a local DJ, integrated into a headless CMS.",
		overview:
			"Dispatch is an internal event processing daemon built for a fintech client who needed reliable, ordered delivery of transaction events across 12 microservices — without Kafka's operational overhead. The constraint: a small team with no dedicated infrastructure engineers, and a hard requirement to never lose an event.",
		problem:
			"The existing system used a simple Redis pub/sub model that worked fine at low volume, but fell apart above ~3,000 events/second. Three root causes:\n\nFirst, no ordering guarantees — subscribers received events in arbitrary order, causing race conditions in downstream reconciliation services that silently produced wrong balances.\n\nSecond, no backpressure mechanism. A slow consumer caused unbounded queue growth until the process hit its memory limit and died, losing everything in the buffer.\n\nThird, no replay capability. If a consumer crashed mid-batch, those events were gone. The team was patching this with manual reconciliation jobs that ran nightly — a fragile and expensive workaround.",
		solution:
			"I designed a ring buffer-based pipeline with per-partition ordering. Each logical stream (one per account class) maps to a partition, and within a partition events are processed sequentially by a single goroutine. This eliminates races without requiring distributed locks.\n\nBackpressure is cooperative: producers call a blocking Publish() that parks the goroutine when the buffer exceeds 80% capacity, naturally throttling ingestion without dropping events or crashing.\n\nFor replay, every event is appended to a write-ahead log before being dispatched to consumers. The WAL uses a rotating segment file strategy with configurable retention (default 7 days). Consumers maintain a committed offset; on restart they seek to that offset and replay from there. Offset commits are explicit and idempotent — consumers acknowledge successful processing before the daemon advances the watermark.",
		stack: ["Go", "LevelDB", "Unix sockets", "gRPC", "Prometheus"],
		outcome:
			"Sustained 80k events/sec under load testing with a P99 dispatch latency under 4ms. Zero events lost across 6 months in production through two consumer crashes and one planned maintenance window. Replaced a Kafka cluster that had required a dedicated ops contractor to maintain.",
	},
	{
		slug: "wedding-website",
		number: "02",
		name: "TALITAANDDMITRI.COM",
		tagline: "My wedding website",
		year: "2026",
		tags: ["ASTRO", "TYPESCRIPT", "HTML", "CSS", "ClOUDFLARE"],
		brief: "Collaborative live-coding environment with real-time conflict resolution for simultaneous multi-user edits.",
		overview:
			"A browser-based collaborative code editor built for an internal hackathon platform. Multiple developers needed to edit the same file simultaneously during timed challenges, with changes merging automatically and cursor positions visible in real time. The product requirement was brutally simple: it had to feel like Google Docs, but for code.",
		problem:
			"Operational Transform (OT) — what Google Docs uses — requires a central server to serialize all operations. I couldn't accept that latency: the platform runs globally, and round-tripping every keystroke through a central server would make it feel sluggish for anyone not near that region.\n\nThe harder problem was awareness: showing where other users' cursors are as the document shifts under everyone's feet. If User A inserts 50 characters before User B's cursor, B's cursor position needs to update without B doing anything. Character-index based cursor positions break immediately under concurrent edits.\n\nFinally, the UX requirement: edits should feel instantaneous locally, even if the remote merge takes a moment. Pessimistic locking (only one editor at a time) was explicitly ruled out.",
		solution:
			"I used Yjs as the CRDT backbone — it implements a variant of the LSEQ algorithm for sequence CRDTs, which provides convergence guarantees without a central authority. Every client maintains a full replica of the document and applies remote operations locally; the algorithm guarantees all replicas converge to the same state regardless of operation order.\n\nFor awareness, I built a lightweight protocol layered on top of the WebSocket connection. Cursor positions are transmitted not as character indices but as relative positions within the Yjs document's internal node structure. This means they stay accurate under concurrent mutation — if someone inserts text before your cursor, your cursor shifts correctly on their screen without any additional coordination.\n\nThe editor itself is CodeMirror 6, bound to Yjs via a custom transaction adapter I wrote. CodeMirror's transaction model is synchronous; Yjs operations are applied asynchronously. The adapter buffers incoming remote operations and applies them in a single CodeMirror transaction at the next microtask checkpoint, preventing visual tearing.",
		stack: ["TypeScript", "Yjs", "CodeMirror 6", "WebSockets", "React", "Node.js"],
		outcome:
			"Tested with 12 simultaneous editors with no conflicts. Sub-50ms sync between clients on the same continent. The awareness protocol uses roughly 200 bytes per user per second in steady state — negligible. The platform shipped on schedule and the editor has been used in over 400 hackathon sessions.",
	},
	{
		slug: "vaultd",
		number: "03",
		name: "VAULTD",
		tagline: "Zero-downtime secrets rotation daemon",
		year: "2023",
		tags: ["Rust", "Security", "Systems", "Linux"],
		brief: "Zero-downtime secrets management daemon with hot credential rotation via atomic filesystem operations.",
		overview:
			"A lightweight alternative to HashiCorp Vault for teams that need credential rotation without the cluster overhead. Runs as a sidecar daemon, exposes credentials to co-located processes via a Unix socket, and rotates them in the background — without requiring a service restart. Built for a startup that needed compliance-grade rotation frequency but couldn't justify Vault's operational surface area.",
		problem:
			"The standard approach to credential rotation is: fetch new secret, update environment variable, restart service. For services handling live traffic, this means either a brief outage or complex orchestration (rolling restarts, health checks, traffic draining). The client had 8 services, some of which took 30+ seconds to initialize — a restart-based rotation strategy meant 4 minutes of rolling downtime per rotation cycle.\n\nThe deeper technical constraint: environment variables are immutable after process start. There is no standard POSIX mechanism to push a new value to a running process without restarting it. Most solutions work around this by having applications poll a config endpoint, but that requires application-level changes the client wasn't willing to make.",
		solution:
			"Instead of environment variables, vaultd exposes credentials through a Unix domain socket using a simple request-response protocol. Applications query for a named credential at the moment they need it — before an outbound HTTP call, before opening a database connection — rather than caching it at startup. This makes them naturally rotation-transparent without requiring any credential-management logic in the application.\n\nThe rotation pipeline: vaultd fetches the new credential from the upstream provider (AWS Secrets Manager, Vault, or a static backend), writes it to a temp file on the same filesystem, then uses a rename(2) syscall to atomically replace the current credential file. The rename is guaranteed atomic by POSIX — no reader can observe a partial write.\n\nFor consumers that do cache credentials (most database drivers and HTTP clients do), vaultd watches for cache-busting opportunities. It sends SIGUSR1 to registered PIDs after a successful rotation, which applications can handle to flush their credential cache. For applications that don't handle SIGUSR1, vaultd can be configured with a credential TTL that forces a re-query on the next use.",
		stack: ["Rust", "Tokio", "Unix sockets", "Linux inotify", "SQLite"],
		outcome:
			"Rotation overhead under 50ms end-to-end. Zero-downtime rotation verified under sustained production load across all 8 services. The client achieved their compliance rotation frequency (every 6 hours) without any application code changes. Total binary size under 4MB with no runtime dependencies.",
	},
	{
		slug: "waveform",
		number: "04",
		name: "WAVEFORM",
		tagline: "60fps real-time audio visualization library",
		year: "2023",
		tags: ["TypeScript", "WebAudio API", "Canvas", "Open Source"],
		brief: "60fps real-time audio visualization library built on the WebAudio API — no WebGL required.",
		overview:
			"An open-source TypeScript library for rendering waveforms, spectrograms, and FFT visualizations in real time. Built out of frustration with existing libraries that either required WebGL (overkill for most use cases) or couldn't maintain 60fps at realistic sample rates. I also make music — I wanted better visualization tools for a browser-based DAW project I was building.",
		problem:
			"Most Canvas 2D audio visualizers drop frames above modest input rates because they're careless about two things: when they read from the audio thread, and how much they allocate per frame.\n\nThe Web Audio API runs its processing graph on a separate high-priority thread. Reading from an AnalyserNode on the main thread is a cross-thread operation. If you do this naively inside requestAnimationFrame, you're reading at a random point in the audio processing cycle — sometimes stale, sometimes mid-update. Timing this correctly requires understanding the AudioContext's render quantum (128 samples at 44.1kHz = ~2.9ms).\n\nThe second problem is garbage collection pressure. A straightforward implementation allocates a new Float32Array every animation frame to hold FFT data — at 60fps, that's 60 allocations per second, each potentially triggering a GC pause. Those pauses manifest as dropped frames exactly when the visualization should be smoothest: during audio playback.",
		solution:
			"The core technique is pre-allocation: all data buffers (time domain, frequency domain, smoothing) are allocated once at initialization and reused every frame. The AnalyserNode fills into a persistent Float32Array via getFloatFrequencyData() — a zero-copy path that doesn't allocate. The canvas renderer reads from that same buffer in the same frame. Zero per-frame heap allocation in the hot path.\n\nFor the frequency axis, I precompute a log-frequency mapping table at startup. Human hearing is logarithmic — equal spacing in Hz is wrong. The mapping converts FFT bin indices to canvas X positions according to a log scale, computed once and stored as a typed array lookup table.\n\nFrame scheduling uses the OffscreenCanvas API where available, which lets the rendering happen off the main thread in a Web Worker. The Worker receives a SharedArrayBuffer containing the latest FFT data (written by the main thread after each AnalyserNode read) and renders asynchronously. On browsers without OffscreenCanvas support, it falls back to standard requestAnimationFrame with a double-buffering strategy to avoid tearing.",
		stack: ["TypeScript", "WebAudio API", "Canvas 2D", "OffscreenCanvas", "Web Workers", "Rollup"],
		outcome:
			"Sustained 60fps at 44.1kHz sample rate on a mid-2019 MacBook Pro with CPU headroom to spare. Zero per-frame allocations verified via Chrome DevTools memory profiler. 800+ GitHub stars. Used as the visualization layer in two other open-source DAW projects.",
		links: [
			{ label: "GitHub", url: "https://github.com/yourhandle/waveform" },
			{ label: "Live Demo", url: "https://waveform.example.com" },
		],
	},
];
