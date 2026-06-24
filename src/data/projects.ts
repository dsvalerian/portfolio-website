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
	outcome: string;
	links?: { label: string; url: string }[];
}

export const projects: Project[] = [
	{
		slug: "floor-supervisor",
		number: "01",
		name: "FLOOR SUPERVISOR",
		tagline: "Customizable DJ portfolio and content hub",
		year: "2026",
		tags: ["ASTRO", "REACT", "SANITY CMS", "TYPESCRIPT", "CLOUDFLARE"],
		brief: "A self-publishing platform for a local DJ — full track streaming, flexible post creation, and a Sanity CMS backend a non-technical user can actually operate.",
		overview:
			"A friend of mine has been picking up more DJ gigs and wanted a home base on the web — somewhere to share his music, post about upcoming events, and generally keep people in the loop. The hard requirements: listeners should be able to play full tracks directly on the site without logging into Spotify or anything else, and he needed to be able to manage all the content himself without touching code or learning a new technical tool to be able to post something.",
		problem:
			"The content problem was the tricky part. He had a general sense of the kinds of posts he wanted — music releases, event announcements, photo dumps — but was largely hands-off on the specifics, which meant I couldn't just build a fixed set of post types and call it done. I was concerned about locking him into the wrong structure where he'd quickly hit a wall trying to post something that was outside of that.\n\nAnother concern was full-track audio playback, which ruled out any streaming embed approach. Spotify, SoundCloud, and YouTube all either cut previews or require users to be logged in. The audio had to live somewhere he controlled without introducing an additional hosting platform.\n\nFinally, this all had to be as cheap as possible — free if I could swing it.",
		solution:
			'I knew that the website was going to be more interactive than your typical portfolio site, involved a potentially large amount of images being served, and still revolved around static content. I went with [Astro](https://astro.build/) which is a static site generator that allows incorporating "islands" of React logic. For the CMS, I went with headless Sanity.io, which is highly customizable and offers a [generous free tier](https://www.sanity.io/pricing).\n\nInstead of pre-built post types, I built a small set of composable blocks — text, photo, music release, and events list — each with its own Sanity schema and renderer. He creates posts by stacking blocks in whatever order and combination he wants. Each block supports a custom color or image for the background, as well as several options for customizing the color, size, and placement of text. This gave him the flexibility of easily creating custom post formats without requiring me to anticipate them upfront.\n\nImage and audio files are uploaded directly into Sanity alongside the rest of the content — no separate storage bucket to manage. Images are optimized during build time by Astro and audio is served as native HTML audio elements.',
		outcome:
			"Not publicly launched yet — we're still working together as he plays around with it and figures out exactly what he wants. A live demo is up at demo.floorsupervisor.com, deployed to Cloudflare Pages with automatic builds triggered by GitHub pushes.",
		links: [{ label: "LIVE DEMO", url: "https://demo.floorsupervisor.com" }],
	},
	{
		slug: "wedding-website",
		number: "02",
		name: "TALITA & DMITRI",
		tagline: "A post-wedding website with photo galleries, music, and more",
		year: "2025",
		tags: ["ASTRO", "TYPESCRIPT", "CLOUDFLARE"],
		brief: "A post-wedding website where guests could relive the day — two photo galleries, a highlight carousel, an embedded Spotify playlist, and notes from us to them.",
		overview:
			"After our wedding, my wife and I wanted one place where guests could go to relive everything — not just photos, but the music we played, some words from us, all of it. The site has a highlight carousel on the landing page, two full photo galleries (one from our photographer, one from a friend shooting candids on an old digicam), an embedded Spotify player with our wedding playlist, and a section with notes we wrote thanking everyone for coming. Guests can click any photo to expand it and download the full-resolution version.",
		problem:
			"The main technical challenge was storing and serving ~500 high-resolution photos without hitting free tier limits. Google Drive would have hit my storage limit. Dumping them into the GitHub repo was a non-starter.\n\nThe galleries also had a layout problem: photos from two different cameras in two different aspect ratios meant a standard uniform grid looked terrible. They needed to flow naturally regardless of dimensions.\n\nI initially went with [Cloudinary](https://cloudinary.com/) for storage and optimization, but hit their bandwidth limits before the site even launched. With multiple people downloading full-resolution photos at the same time, it was never going to hold up.",
		solution:
			"I moved storage to [Cloudflare R2](https://developers.cloudflare.com/r2/), which has no egress fees when serving through Cloudflare's network — a natural fit since the site was already deployed to Cloudflare Pages.\n\nFor image delivery, I used Astro's built-in [Image component](https://docs.astro.build/en/guides/images/), which pulls the R2 URLs at build time, optimizes them, and generates srcsets automatically. Lazy loading handles the rest — photos only download as guests scroll into them, which matters a lot at this volume.\n\nFor the layout, I went with a masonry grid so photos of any aspect ratio sit naturally next to each other without cropping or empty space.",
		outcome: "The site has been up since the wedding. No bandwidth issues, no cost, and everyone got their photos.",
	},
	{
		slug: "needle-search",
		number: "03",
		name: "NEEDLE SEARCH",
		tagline: "Open deck night signups and event platform for a Chicago DJ collective",
		year: "2025",
		tags: ["REACT", "SUPABASE", "TYPESCRIPT", "NETLIFY"],
		brief: "A web platform for Needle Search, a Chicago DJ collective, to post monthly open deck nights and let local DJs sign up for slots — my first project built for someone else, and a crash course in scoping.",
		overview:
			"Needle Search is a Chicago DJ collective started by friends who met at an open deck night. Their thing: rent out a bar monthly, give local DJs 30-minute slots to come play, keep it social and low-key. They wanted a website to handle all of it — event listings, slot signups, and more.",
		problem:
			"The initial vision was ambitious: accounts, follows, social features, priority access for engaged users, commenting, the works. Essentially a social platform built around open deck nights. This shaped the early stack decisions — React for a highly interactive frontend, Supabase for the database, auth, and edge functions all bundled in one generous free tier without needing to stand up a custom server.\n\nAs development progressed, it became clear the scope was getting ahead of the actual goal. Requiring account creation just to sign up for an open deck night was a lot of friction for an event being promoted through Instagram links. People were going to tap a link in an IG story and expect to sign up in thirty seconds — making them create an account first would kill that. After some back and forth we agreed to pare it way back and focus on what people actually came to the site to do.",
		solution:
			"The site ended up as an event listing and signup platform. The organizer adds a new open deck event by inserting a row into the database — no CMS needed, since they were comfortable enough working directly in Supabase's UI. Each event has a rich text description field so they can format it however they want rather than being locked into a template, plus Google Calendar and iCal links. When an event closes, the signup form disappears automatically.\n\nSignups write directly to the database, which meant I could set up pre-made queries in Supabase so the organizer could pull up a clean list of who signed up for a given event, browse their Instagram profiles, and make decisions from there. Everything updates in real time — no redeployment needed when an event changes.",
		outcome:
			"The site ran for about 6 months and hosted 4 events, each with 30+ signups. Eventually Needle Search moved to Google Forms linked from their Instagram posts, and the site went quiet — it's still live, just unused.\n\nLooking back, a simpler stack would have been the smarter call. But this project was where I learned React, TypeScript, and responsive design for the first time. More than that, having to make real decisions for real people — scope, architecture, user experience — made me more confident doing the same thing at work. It pushed me toward roles that involved more client interaction, more ownership, and more of a say in how things got built.",
	},
];
