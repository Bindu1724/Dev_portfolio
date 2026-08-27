# Devender Teja Portfolio

A React portfolio for **Byrugonda Devender Teja**, showcasing filmmaking and video editing work from Hyderabad, India.

## Features

- Separate filmmaker and video editor portfolio views
- Cinematic dark interface with amber and light-blue accent themes
- Responsive layout for desktop and mobile screens
- Video lightbox supporting YouTube, Google Drive, and direct video files
- Reduced-motion support for visitors who prefer less animation

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Install and run

```bash
npm install
npm start
```

The development site opens at `http://localhost:3000`.

## Available Scripts

```bash
npm start       # Start the development server
npm run build   # Create a production build
npm test        # Run the test suite
```

## Customizing the Portfolio

Most portfolio content is configured near the top of `src/App.js`:

- `FILM_PROJECTS`: featured filmmaking projects
- `EDIT_PROJECTS`: featured editing projects
- `SAMPLE_PROJECTS`: additional editing samples
- `IMAGES`: optional background images for the hub, hero, work, about, and contact sections

Add image files to `public/thumbnails/` and reference them with paths such as `/thumbnails/project.jpg`.

Each project can include:

```js
{
	title: "Project title",
	tag: "Short Film",
	tc: "00:05:30",
	thumbnail: "/thumbnails/project.jpg",
	desc: "A short description of the project.",
	video: "https://youtu.be/example"
}
```

The `video` field accepts YouTube links, Google Drive file links, or direct `.mp4`, `.webm`, and `.mov` URLs.

## Project Structure

```text
public/                 Static assets and thumbnails
src/App.js              Portfolio views, content, and shared styles
src/index.js            React application entry point
src/index.css           Global stylesheet entry point
```

## Deployment

Create the optimized production files with:

```bash
npm run build
```

Deploy the generated `build/` directory to a static hosting provider such as Netlify, Vercel, GitHub Pages, or any web server that supports single-page applications.
