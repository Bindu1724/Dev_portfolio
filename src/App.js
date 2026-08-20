import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play, ArrowUpRight, ArrowRight,
  Clapperboard, Film, Scissors, SlidersHorizontal, Layers,
  Mail, MapPin, Laptop,
  Mic, Lightbulb, LayoutGrid, Monitor, Palette, Headphones, Clock,
} from "lucide-react";
import {FaInstagram, FaCamera} from "react-icons/fa";

/* ============================================================
   DATA — edit these arrays with your real projects/info
   ============================================================ */

const FILM_PROJECTS = [
  { title: "Undertow", tc: "00:07:42", tag: "Short Film", desc: "Two siblings clear out their late father's workshop over one long afternoon.", video: "" },
  { title: "Concrete Season", tc: "00:11:15", tag: "Documentary", desc: "A season inside an independent skatepark, told through the people who built it.", video: "" },
  { title: "Paper Boats", tc: "00:09:04", tag: "Short Film", desc: "Shot on 16mm — a tight three-act story about letting go.", video: "" },
  { title: "Still, Water", tc: "00:14:50", tag: "Short Film", desc: "A meditative look at a fishing town's last working harbour.", video: "" },
];

// `video` accepts:
//   - a YouTube/Vimeo URL (any format — watch link, share link, or embed link)
//   - a Google Drive share link (make sure sharing is set to "Anyone with the link")
//   - a direct video file URL ending in .mp4 / .webm / .mov
// Leave it as "" to keep the placeholder play icon with no click action.
const EDIT_PROJECTS = [
  { title: "Nightline Radio", tc: "00:02:30", tag: "Brand Film", desc: "Edit + colour for an independent radio station's anniversary film.", video: "" },
  { title: "Highline Collective", tc: "00:03:12", tag: "Event Recap", desc: "Fast-cut sizzle reel for a three-day design conference.", video: "" },
  { title: "Undertow", tc: "00:07:42", tag: "Short Film", desc: "Full post: assembly through final mix, picture lock in eleven passes.", video: "" },
  { title: "Aperture — EP", tc: "00:04:44", tag: "Music Video", desc: "Performance-driven edit cut to a single unbroken emotional arc.", video: "" },
  { title: "Project 05", tc: "00:00:00", tag: "Category", desc: "Short description of this edit.", video: "" },
  { title: "Project 06", tc: "00:00:00", tag: "Category", desc: "Short description of this edit.", video: "" },
  { title: "Project 07", tc: "00:00:00", tag: "Category", desc: "Short description of this edit.", video: "" },
  { title: "Project 08", tc: "00:00:00", tag: "Category", desc: "Short description of this edit.", video: "" },
  { title: "Project 09", tc: "00:00:00", tag: "Category", desc: "Short description of this edit.", video: "" },
  { title: "Project 10", tc: "00:00:00", tag: "Category", desc: "Short description of this edit.", video: "" },
];

// Paste an image URL between the quotes to give that section a background
// image (hosted somewhere — Drive, Imgur, your own site). Leave "" to keep
// the plain dark gradient background. A dark overlay is applied automatically
// over any image so text stays readable. Every section on both sites has a
// slot here — add as many or as few as you like.
const IMAGES = {
  hubFilm: "",    // background behind the "Filmmaking" hub panel
  hubEdit: "",    // background behind the "Video Editing" hub panel

  filmHero: "",    // filmmaker — hero section
  filmAbout: "",   // filmmaker — about section
  filmWork: "",    // filmmaker — selected films section
  filmContact: "", // filmmaker — contact section

  editHero: "",    // editor — hero section
  editAbout: "",   // editor — about section
  editWork: "",    // editor — selected cuts section
  editContact: "", // editor — contact section
};

/* ============================================================
   SHARED STYLES
   ============================================================ */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  .pf-root{
    --bg:#0a0a0b; --bg-alt:#131315; --line:#232325;
    --text:#ede9e1; --text-muted:#8a8781; --text-dim:#4f4d48;
    --amber:#e3a458; --ice:#7fb8c9;
    font-family:'Work Sans', sans-serif;
    background:var(--bg); color:var(--text);
    position:relative; min-height:100vh; overflow-x:hidden;
    font-weight:300; line-height:1.6;
  }
  .pf-root *{ box-sizing:border-box; }
  .pf-root a{ color:inherit; text-decoration:none; }
  .pf-root h1,.pf-root h2,.pf-root h3{ font-family:'Oswald',sans-serif; font-weight:600; letter-spacing:0.02em; margin:0; }
  .pf-root .mono{ font-family:'JetBrains Mono', monospace; }

  .pf-root .film{
    background:
      radial-gradient(1300px 900px at 10% -10%, rgba(227,164,88,0.26), transparent 52%),
      radial-gradient(1000px 800px at 95% 15%, rgba(227,164,88,0.10), transparent 50%),
      radial-gradient(1100px 800px at 90% 110%, rgba(193,68,60,0.16), transparent 55%),
      var(--bg);
  }
  .pf-root .edit{
    background:
      radial-gradient(1300px 900px at 90% -10%, rgba(127,184,201,0.26), transparent 52%),
      radial-gradient(1000px 800px at 5% 15%, rgba(127,184,201,0.10), transparent 50%),
      radial-gradient(1100px 800px at 10% 110%, rgba(127,184,201,0.14), transparent 55%),
      var(--bg);
  }
  .pf-root .pf-hub{
    background:
      radial-gradient(1100px 800px at 20% 0%, rgba(227,164,88,0.13), transparent 52%),
      radial-gradient(1100px 800px at 80% 0%, rgba(127,184,201,0.13), transparent 52%),
      var(--bg);
  }

  /* -------- floating overlay icons (clap/camera/script/laptop/etc) -------- */
  .pf-float-icon{
    position:absolute; z-index:0; pointer-events:none;
    opacity:0.16; transform:rotate(var(--rot,0deg));
    animation:pfFloat 9s ease-in-out infinite;
    animation-delay:var(--delay,0s);
  }
  .film .pf-float-icon{ color:var(--amber); }
  .edit .pf-float-icon{ color:var(--ice); }
  @keyframes pfFloat{
    0%,100%{ transform:rotate(var(--rot,0deg)) translateY(0); }
    50%{ transform:rotate(var(--rot,0deg)) translateY(-16px); }
  }
  @media (prefers-reduced-motion: reduce){ .pf-float-icon{ animation:none; } }

  /* -------- generic per-section background image support -------- */
  .pf-section{ position:relative; overflow:hidden; }
  .pf-section > *:not(.pf-float-icon){ position:relative; z-index:1; }
  .pf-section.has-bg::before{
    content:''; position:absolute; inset:0; z-index:0;
    background-image:var(--sec-img); background-size:cover; background-position:center;
    opacity:0.4;
  }
  .pf-section.has-bg::after{
    content:''; position:absolute; inset:0; z-index:0;
    background:linear-gradient(180deg, var(--bg) 0%, rgba(10,10,11,0.55) 18%, rgba(10,10,11,0.7) 82%, var(--bg) 100%);
  }

  .pf-root::before{
    content:''; position:fixed; inset:0; z-index:999; pointer-events:none; opacity:0.035; mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }

  /* -------- wipe transition -------- */
  .pf-wipe{
    position:fixed; inset:0; z-index:1000; background:#000;
    clip-path:circle(0% at var(--ox,50%) var(--oy,50%));
    pointer-events:none;
  }
  .pf-wipe.closing{ animation:pfClose 0.65s cubic-bezier(.76,0,.24,1) forwards; }
  .pf-wipe.opening{ animation:pfOpen 0.65s cubic-bezier(.76,0,.24,1) forwards; }
  @keyframes pfClose{ from{ clip-path:circle(0% at var(--ox,50%) var(--oy,50%)); } to{ clip-path:circle(140% at var(--ox,50%) var(--oy,50%)); } }
  @keyframes pfOpen{ from{ clip-path:circle(140% at var(--ox,50%) var(--oy,50%)); } to{ clip-path:circle(0% at var(--ox,50%) var(--oy,50%)); } }

  /* -------- fade-up utility (mount + scroll reveal) -------- */
  .pf-fade{ opacity:0; transform:translateY(22px); transition:opacity 0.8s ease, transform 0.8s ease; }
  .pf-fade.in{ opacity:1; transform:translateY(0); }

  @media (prefers-reduced-motion: reduce){
    .pf-fade{ opacity:1 !important; transform:none !important; transition:none !important; }
    .pf-wipe.closing, .pf-wipe.opening{ animation:none !important; }
  }

  /* -------- nav -------- */
  .pf-nav{
    position:fixed; top:0; left:0; right:0; z-index:60;
    display:flex; align-items:center; justify-content:space-between;
    padding:22px 5vw;
    background:linear-gradient(to bottom, rgba(10,10,11,0.9), rgba(10,10,11,0));
  }
  .pf-nav .brand{ font-family:'Oswald',sans-serif; font-size:0.95rem; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; }
  .pf-nav .switch{
    display:flex; align-items:center; gap:8px;
    font-family:'JetBrains Mono', monospace; font-size:0.7rem; letter-spacing:0.08em; text-transform:uppercase;
    padding:9px 16px; border:1px solid var(--line); cursor:pointer;
    color:var(--text-muted); transition:color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
    background:transparent;
  }
  .pf-nav .switch:hover{ color:var(--text); transform:translateX(2px); }

  /* -------- hub -------- */
  .pf-hub{ min-height:100vh; display:flex; flex-direction:column; }
  .pf-hub .hub-top{ padding:56px 5vw 26px; text-align:center; }
  .pf-hub .hub-eyebrow{ justify-content:center; }
  .pf-hub .hub-eyebrow{ font-family:'JetBrains Mono',monospace; font-size:0.72rem; letter-spacing:0.16em; text-transform:uppercase; color:var(--text-dim); display:flex; align-items:center; gap:10px; }
  .pf-hub .hub-eyebrow .dot{ width:6px; height:6px; border-radius:50%; background:var(--amber); box-shadow:0 0 8px var(--amber); }
  .pf-hub .hub-name{ font-size:clamp(2.4rem,6vw,4.2rem); text-transform:uppercase; margin-top:14px; }

  .hub-split{ flex:1; display:grid; grid-template-columns:1fr 1fr; min-height:60vh; }
  @media (max-width:820px){ .hub-split{ grid-template-columns:1fr; } }

  .hub-panel{
    position:relative; display:flex; flex-direction:column; justify-content:flex-end;
    padding:48px 5vw; cursor:pointer; overflow:hidden;
    border-top:1px solid var(--line);
    transition:flex 0.5s ease;
  }
  .hub-panel + .hub-panel{ border-left:1px solid var(--line); }
  @media (max-width:820px){ .hub-panel + .hub-panel{ border-left:none; border-top:1px solid var(--line); } }

  .hub-panel.has-bg{
    background-image:var(--panel-img); background-size:cover; background-position:center;
    transition:background-size 1s ease;
  }
  .hub-panel.has-bg:hover{ background-size:112%; }
  .hub-panel.has-bg::before{
    content:''; position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(10,10,11,0.2) 0%, rgba(10,10,11,0.55) 55%, rgba(10,10,11,0.92) 100%);
  }

  .hub-panel .glow{
    position:absolute; inset:0; opacity:0; transition:opacity 0.5s ease;
  }
  .hub-panel.film .glow{ background:radial-gradient(circle at 30% 30%, rgba(227,164,88,0.14), transparent 60%); }
  .hub-panel.edit .glow{ background:radial-gradient(circle at 70% 30%, rgba(127,184,201,0.14), transparent 60%); }
  .hub-panel:hover .glow{ opacity:1; }

  .hub-panel .tag{ font-family:'JetBrains Mono',monospace; font-size:0.72rem; letter-spacing:0.14em; text-transform:uppercase; margin-bottom:14px; position:relative; z-index:1; display:flex; align-items:center; gap:8px; }
  .hub-panel.film .tag{ color:var(--amber); }
  .hub-panel.edit .tag{ color:var(--ice); }
  .hub-panel h2{ font-size:clamp(1.8rem,5vw,3.4rem); text-transform:uppercase; position:relative; z-index:1; transition:transform 0.4s ease; }
  .hub-panel:hover h2{ transform:translateX(8px); }
  .hub-panel .enter{ margin-top:18px; display:flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:var(--text-muted); position:relative; z-index:1; }

  /* -------- section shell -------- */
  .pf-section{ padding:120px 5vw; max-width:1200px; margin:0 auto; }
  .pf-eyebrow{ font-family:'JetBrains Mono',monospace; font-size:0.72rem; letter-spacing:0.16em; text-transform:uppercase; display:flex; align-items:center; gap:10px; margin-bottom:24px; }
  .film .pf-eyebrow{ color:var(--amber); }
  .edit .pf-eyebrow{ color:var(--ice); }
  .pf-eyebrow .dot{ width:6px; height:6px; border-radius:50%; }
  .film .pf-eyebrow .dot{ background:var(--amber); box-shadow:0 0 8px var(--amber); }
  .edit .pf-eyebrow .dot{ background:var(--ice); box-shadow:0 0 8px var(--ice); }

  /* -------- FILMMAKER SITE -------- */
  .film-hero{ min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:120px 5vw 0; position:relative; overflow:hidden; }
  .film-hero > *{ position:relative; z-index:1; }
  .film-hero.has-bg::before{
    content:''; position:absolute; inset:0; z-index:0;
    background-image:var(--hero-img); background-size:cover; background-position:center;
    animation:pfKenBurns 20s ease-in-out infinite alternate;
  }
  .film-hero.has-bg::after{
    content:''; position:absolute; inset:0; z-index:0;
    background:linear-gradient(180deg, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0.75) 60%, var(--bg) 100%);
  }
  @keyframes pfKenBurns{ from{ transform:scale(1); } to{ transform:scale(1.07); } }
  @media (prefers-reduced-motion: reduce){ .film-hero.has-bg::before, .edit-hero.has-bg::before{ animation:none; } }
  .film-hero h1{ font-size:clamp(3rem,10vw,7.6rem); line-height:0.92; text-transform:uppercase; }
  .film-hero h1 .stroke{ color:transparent; -webkit-text-stroke:1.5px var(--text); }
  .film-hero .sub{ margin:26px auto 0; max-width:540px; color:var(--text-muted); font-size:clamp(1rem,2vw,1.25rem); }
  .film-hero .pf-eyebrow{ justify-content:center; }
  .film-hero .sub strong{ color:var(--text); font-weight:500; }

  .letterbox{ position:fixed; left:0; right:0; height:0; background:#000; z-index:40; transition:height 1s cubic-bezier(.76,0,.24,1); pointer-events:none; }
  .letterbox.top{ top:0; } .letterbox.bottom{ bottom:0; }
  .letterbox.in{ height:5.5vh; }

  .film-about{ display:grid; grid-template-columns:1.2fr 1fr; gap:70px; }
  @media (max-width:820px){ .film-about{ grid-template-columns:1fr; } }
  .film-about p{ color:var(--text-muted); max-width:54ch; margin-bottom:16px; }
  .film-about p strong{ color:var(--text); font-weight:500; }
  .film-credits .row{ display:flex; justify-content:space-between; gap:16px; padding:14px 0; border-bottom:1px solid var(--line); font-size:0.82rem; }
  .film-credits{ border-top:1px solid var(--line); }
  .film-credits .k{ color:var(--text-dim); text-transform:uppercase; letter-spacing:0.08em; font-size:0.72rem; }
  .film-credits .v{ color:var(--text-muted); text-align:right; }

  .film-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--line); border:1px solid var(--line); margin-top:44px; }
  @media (max-width:760px){ .film-grid{ grid-template-columns:1fr; } }
  .film-card{ background:var(--bg); padding:34px; cursor:pointer; transition:background 0.3s ease; }
  .film-card:hover{ background:var(--bg-alt); }
  .film-frame{ aspect-ratio:16/9; border:1px solid var(--line); position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:transform 0.5s ease; }
  .film-card:hover .film-frame{ transform:scale(1.02); }
  .film-frame::after{ content:''; position:absolute; inset:0; background:repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 8px); }
  .film-frame .play{ z-index:1; width:46px; height:46px; border-radius:50%; border:1px solid var(--text-dim); display:flex; align-items:center; justify-content:center; color:var(--text-muted); transition:all 0.3s ease; }
  .film-card:hover .play{ border-color:var(--amber); color:var(--amber); transform:scale(1.08); }
  .film-frame .badge{ position:absolute; bottom:10px; right:10px; font-size:0.66rem; padding:4px 8px; border:1px solid var(--line); background:rgba(10,10,11,0.7); z-index:1; }
  .film-card .meta{ display:flex; justify-content:space-between; margin-top:18px; }
  .film-card h3{ font-size:1.1rem; text-transform:uppercase; }
  .film-card .tag{ font-size:0.65rem; color:var(--amber); text-transform:uppercase; letter-spacing:0.08em; }
  .film-card .desc{ color:var(--text-muted); font-size:0.9rem; margin-top:8px; }

  /* -------- EDITOR SITE -------- */
  .edit-hero{ min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:120px 5vw 0; position:relative; overflow:hidden; }
  .edit-hero > *{ position:relative; z-index:1; }
  .edit-hero.has-bg::before{
    content:''; position:absolute; inset:0; z-index:0;
    background-image:var(--hero-img); background-size:cover; background-position:center;
    animation:pfKenBurns 20s ease-in-out infinite alternate;
  }
  .edit-hero.has-bg::after{
    content:''; position:absolute; inset:0; z-index:0;
    background:linear-gradient(180deg, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0.75) 60%, var(--bg) 100%);
  }
  .edit-hero h1{ font-size:clamp(2.6rem,8vw,6rem); text-transform:uppercase; line-height:0.96; }
  .edit-hero .sub{ margin:24px auto 0; max-width:520px; color:var(--text-muted); font-size:clamp(1rem,2vw,1.2rem); }
  .edit-hero .pf-eyebrow{ justify-content:center; }
  .edit-hero .sub strong{ color:var(--text); font-weight:500; }

  .timeline{ margin:60px auto 0; max-width:480px; position:relative; height:2px; background:var(--line); width:100%; }
  .timeline .playhead{ position:absolute; top:-5px; width:12px; height:12px; border-radius:50%; background:var(--ice); box-shadow:0 0 10px var(--ice); animation:scrub 7s linear infinite; }
  @keyframes scrub{ 0%{ left:0%; } 50%{ left:calc(100% - 12px); } 100%{ left:0%; } }
  @media (prefers-reduced-motion: reduce){ .timeline .playhead{ animation:none; left:0; } }
  .timeline .ticks{ display:flex; justify-content:space-between; margin-top:10px; font-family:'JetBrains Mono',monospace; font-size:0.66rem; color:var(--text-dim); }

  .edit-about{ display:grid; grid-template-columns:1.2fr 1fr; gap:70px; }
  @media (max-width:820px){ .edit-about{ grid-template-columns:1fr; } }
  .edit-about p{ color:var(--text-muted); max-width:54ch; margin-bottom:16px; }
  .edit-about p strong{ color:var(--text); font-weight:500; }

  .edit-list{ margin-top:44px; border-top:1px solid var(--line); }
  .edit-row{
    display:grid; grid-template-columns:90px 1fr auto auto; align-items:center; gap:24px;
    padding:26px 0; border-bottom:1px solid var(--line); cursor:pointer; transition:padding-left 0.3s ease, background 0.3s ease;
  }
  .edit-row:hover{ padding-left:14px; background:var(--bg-alt); }
  .edit-row .n{ font-family:'JetBrains Mono',monospace; color:var(--text-dim); font-size:0.85rem; }
  .edit-row h3{ font-size:1.15rem; text-transform:uppercase; }
  .edit-row .desc{ color:var(--text-dim); font-size:0.82rem; margin-top:4px; }
  .edit-row .tag{ font-family:'JetBrains Mono',monospace; font-size:0.68rem; color:var(--ice); text-transform:uppercase; white-space:nowrap; }
  .edit-row .arrow{ color:var(--text-dim); transition:transform 0.3s ease, color 0.3s ease; }
  .edit-row:hover .arrow{ transform:translateX(4px); color:var(--ice); }

  .edit-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--line); border:1px solid var(--line); margin-top:44px; }
  @media (max-width:960px){ .edit-grid{ grid-template-columns:repeat(2,1fr); } }
  @media (max-width:600px){ .edit-grid{ grid-template-columns:1fr; } }
  .edit-card{ background:var(--bg); padding:26px; cursor:pointer; transition:background 0.3s ease; display:flex; flex-direction:column; gap:16px; }
  .edit-card:hover{ background:var(--bg-alt); }
  .edit-frame{ aspect-ratio:16/9; border:1px solid var(--line); position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:transform 0.5s ease; }
  .edit-card:hover .edit-frame{ transform:scale(1.02); }
  .edit-frame::after{ content:''; position:absolute; inset:0; background:repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 8px); }
  .edit-frame .play{ z-index:1; width:40px; height:40px; border-radius:50%; border:1px solid var(--text-dim); display:flex; align-items:center; justify-content:center; color:var(--text-muted); transition:all 0.3s ease; }
  .edit-card:hover .play{ border-color:var(--ice); color:var(--ice); transform:scale(1.08); }
  .edit-frame .badge{ position:absolute; bottom:10px; right:10px; font-size:0.64rem; padding:3px 7px; border:1px solid var(--line); background:rgba(10,10,11,0.7); z-index:1; }
  .edit-card .meta{ display:flex; justify-content:space-between; gap:10px; }
  .edit-card h3{ font-size:1rem; text-transform:uppercase; }
  .edit-card .tag{ font-size:0.62rem; color:var(--ice); text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap; }
  .edit-card .desc{ color:var(--text-muted); font-size:0.84rem; }

  /* -------- contact (shared shape, accent differs) -------- */
  .pf-contact h2{ font-size:clamp(2.2rem,7vw,4.6rem); text-transform:uppercase; line-height:1; margin-top:16px; }
  .pf-contact .email{ display:inline-block; margin-top:32px; font-family:'JetBrains Mono',monospace; font-size:clamp(1rem,3vw,1.35rem); border-bottom:1px solid transparent; transition:border-color 0.25s ease; }
  .film .pf-contact .email{ color:var(--amber); }
  .edit .pf-contact .email{ color:var(--ice); }
  .film .pf-contact .email:hover{ border-color:var(--amber); }
  .edit .pf-contact .email:hover{ border-color:var(--ice); }
  .pf-contact .row{ margin-top:56px; display:flex; gap:48px; flex-wrap:wrap; }
  .pf-contact .col .k{ font-family:'JetBrains Mono',monospace; font-size:0.66rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; }
  .pf-contact .col a, .pf-contact .col span{ display:flex; align-items:center; gap:7px; color:var(--text-muted); font-size:0.92rem; padding:3px 0; transition:color 0.2s ease; }
  .pf-contact .col a:hover{ color:var(--text); }

  .pf-footer{ padding:26px 5vw; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; font-family:'JetBrains Mono',monospace; font-size:0.66rem; color:var(--text-dim); }

  /* -------- lightbox video player -------- */
  .pf-lightbox{
    position:fixed; inset:0; z-index:2000; background:rgba(6,6,7,0.92);
    display:flex; align-items:center; justify-content:center; padding:5vw;
    animation:pfFadeIn 0.25s ease;
  }
  @keyframes pfFadeIn{ from{ opacity:0; } to{ opacity:1; } }
  .pf-lightbox-inner{ width:100%; max-width:960px; }
  .pf-lightbox-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; color:var(--text-muted); font-size:0.78rem; }
  .pf-lightbox-close{ background:none; border:1px solid var(--line); color:var(--text-muted); width:32px; height:32px; cursor:pointer; transition:color 0.2s ease, border-color 0.2s ease; }
  .pf-lightbox-close:hover{ color:var(--text); border-color:var(--text-dim); }
  .pf-lightbox-frame{ position:relative; width:100%; aspect-ratio:16/9; background:#000; border:1px solid var(--line); }
  .pf-lightbox-frame video, .pf-lightbox-frame iframe{ position:absolute; inset:0; width:100%; height:100%; border:none; }

  .pf-divider{ display:flex; align-items:center; gap:12px; padding:14px 5vw; border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
  .pf-divider .holes{ display:flex; gap:12px; flex:1; overflow:hidden; }
  .pf-divider .holes span{ width:7px; height:7px; min-width:7px; background:var(--line); border-radius:2px; }
  .pf-divider .label{ font-family:'JetBrains Mono',monospace; font-size:0.64rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.1em; white-space:nowrap; }
`;

/* ============================================================
   HELPERS
   ============================================================ */

function useReveal() {
  const ref = useRef([]);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = ref.current.filter(Boolean);
    if (reduce) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (el) => { if (el && !ref.current.includes(el)) ref.current.push(el); };
}

function Holes() {
  return <>{Array.from({ length: 44 }).map((_, i) => <span key={i} />)}</>;
}

// Ambient decorative icons (clapperboard, camera, script, laptop, reel, etc.)
// scattered behind a section's content. `items` is an array of
// { Icon, top, left, size, rot, delay } — position/size/rotation per icon.
function FloatingIcons({ items }) {
  return (
    <>
      {items.map(({ Icon, top, left, size = 40, rot = 0, delay = 0 }, i) => (
        <div
          key={i}
          className="pf-float-icon"
          style={{ top, left, "--rot": `${rot}deg`, "--delay": `${delay}s` }}
        >
          <Icon size={size} strokeWidth={1.3} />
        </div>
      ))}
    </>
  );
}

// Filmmaking set: Cinema Camera, Clapperboard, Film Reel, Storyboard, Boom Mic, Film Light
const FILM_ICONS_HERO = [
  { Icon: Clapperboard, top: "16%", left: "8%", size: 58, rot: -14, delay: 0 },
  { Icon: FaCamera, top: "68%", left: "88%", size: 50, rot: 10, delay: 1.1 },
  { Icon: Mic, top: "78%", left: "10%", size: 40, rot: -8, delay: 0.6 },
  { Icon: Lightbulb, top: "22%", left: "90%", size: 40, rot: 8, delay: 1.8 },
];
const FILM_ICONS_ABOUT = [
  { Icon: Film, top: "10%", left: "90%", size: 46, rot: 8, delay: 0.4 },
  { Icon: LayoutGrid, top: "85%", left: "4%", size: 38, rot: -10, delay: 1.6 },
];
const FILM_ICONS_WORK = [
  { Icon: FaCamera, top: "88%", left: "94%", size: 42, rot: 12, delay: 0.8 },
];
const FILM_ICONS_CONTACT = [
  { Icon: Lightbulb, top: "12%", left: "92%", size: 38, rot: -10, delay: 0.3 },
];

// Editing set: Editing Laptop, Editing Monitor, Timeline/Cut, Color Wheel, Headphones, Timecode
const EDIT_ICONS_HERO = [
  { Icon: Scissors, top: "14%", left: "90%", size: 54, rot: 16, delay: 0 },
  { Icon: Laptop, top: "72%", left: "9%", size: 48, rot: -10, delay: 1.2 },
  { Icon: Headphones, top: "80%", left: "84%", size: 40, rot: -6, delay: 0.7 },
  { Icon: Clock, top: "24%", left: "6%", size: 36, rot: 8, delay: 2 },
];
const EDIT_ICONS_ABOUT = [
  { Icon: Monitor, top: "10%", left: "6%", size: 44, rot: -8, delay: 0.5 },
  { Icon: Palette, top: "86%", left: "92%", size: 36, rot: 10, delay: 1.7 },
];
const EDIT_ICONS_WORK = [
  { Icon: Monitor, top: "90%", left: "5%", size: 42, rot: -12, delay: 0.9 },
];
const EDIT_ICONS_CONTACT = [
  { Icon: Palette, top: "14%", left: "6%", size: 38, rot: 10, delay: 0.3 },
];

// Turns a pasted YouTube/Vimeo/Drive link into an embeddable URL. Direct file
// URLs (.mp4/.webm/.mov) pass through untouched and are played with <video>.
function toEmbedUrl(url) {
  if (!url) return null;
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) return { type: "file", src: url };
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) return { type: "embed", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` };
  //const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  //if (vm) return { type: "embed", src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
  if (drive && url.includes("drive.google.com")) return { type: "embed", src: `https://drive.google.com/file/d/${drive[1]}/preview` };
  return { type: "embed", src: url };
}

function Lightbox({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;
  const media = toEmbedUrl(project.video);

  return (
    <div className="pf-lightbox" onClick={onClose}>
      <div className="pf-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <div className="pf-lightbox-head">
          <span className="mono">{project.title} — {project.tc}</span>
          <button className="pf-lightbox-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="pf-lightbox-frame">
          {media?.type === "file" && (
            <video src={media.src} controls autoPlay playsInline />
          )}
          {media?.type === "embed" && (
            <iframe
              src={media.src}
              title={project.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HUB
   ============================================================ */

function Hub({ onEnter }) {
  return (
    <div className="pf-hub pf-fade in">
      <div className="hub-top">
        <div className="hub-eyebrow"><span className="dot" /> <Clapperboard size={15} /> Portfolio</div>
        <h1 className="hub-name">Byrugonda Devender Teja</h1>
      </div>
      <div className="hub-split">
        <div
          className={`hub-panel film${IMAGES.hubFilm ? " has-bg" : ""}`}
          style={IMAGES.hubFilm ? { "--panel-img": `url(${IMAGES.hubFilm})` } : undefined}
          onClick={(e) => onEnter("film", e)}
        >
          <div className="glow" />
          <div className="tag mono"><FaCamera size={15} /> 01 — Directing</div>
          <h2>Filmmaking</h2>
          <div className="enter">Enter the set <ArrowUpRight size={14} /></div>
        </div>
        <div
          className={`hub-panel edit${IMAGES.hubEdit ? " has-bg" : ""}`}
          style={IMAGES.hubEdit ? { "--panel-img": `url(${IMAGES.hubEdit})` } : undefined}
          onClick={(e) => onEnter("edit", e)}
        >
          <div className="glow" />
          <div className="tag mono"><Scissors size={15} /> 02 — Editing</div>
          <h2>Video Editing</h2>
          <div className="enter">Enter the suite <ArrowUpRight size={14} /></div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FILMMAKER SITE
   ============================================================ */

function FilmSite({ goHub, goEdit }) {
  const reveal = useReveal();
  const [boxIn, setBoxIn] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  useEffect(() => { const t = setTimeout(() => setBoxIn(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className="film">
      <Lightbox project={activeVideo} onClose={() => setActiveVideo(null)} />
      <div className={`letterbox top ${boxIn ? "in" : ""}`} />
      <div className={`letterbox bottom ${boxIn ? "in" : ""}`} />

      <nav className="pf-nav">
        <div className="brand" onClick={goHub}><Clapperboard size={15} style={{ marginRight: 8, verticalAlign: -2 }} />Byrugonda Devender Teja</div>
        <button className="switch" onClick={goEdit}><Scissors size={12} /> Switch to Editing <ArrowRight size={12} /></button>
      </nav>

      <section
        className={`film-hero${IMAGES.filmHero ? " has-bg" : ""}`}
        style={IMAGES.filmHero ? { "--hero-img": `url(${IMAGES.filmHero})` } : undefined}
      >
        <FloatingIcons items={FILM_ICONS_HERO} />
        <div className="pf-eyebrow"><span className="dot" /> <Clapperboard size={15} /> Independent Filmmaker</div>
        <h1>Devender Teja<br /><span className="stroke">Byrugonda</span></h1>
        <p className="sub">I direct short-form independent films — narrative and documentary —
          shaped as much on set as in the edit that follows.</p>
      </section>

      <div className="pf-divider"><div className="holes"><Holes /></div><span className="label">Reel 01 / About</span></div>

      <section
        className={`pf-section pf-fade${IMAGES.filmAbout ? " has-bg" : ""}`}
        style={IMAGES.filmAbout ? { "--sec-img": `url(${IMAGES.filmAbout})` } : undefined}
        ref={reveal}
      >
        <FloatingIcons items={FILM_ICONS_ABOUT} />
        <div className="pf-eyebrow"><span className="dot" /> <Film size={15} /> About</div>
        <div className="film-about">
          <div>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", textTransform: "uppercase", marginBottom: 24 }}>On &amp; Off Set</h2>
            <p>I make <strong>narrative shorts and documentary work</strong> that starts with a real place or a real
              person, not a concept. Most of what a film says gets decided twice — once with the camera, once in the cut.</p>
            <p>I write, direct, and often shoot my own projects, working with a small trusted crew and non-actors
              where the story calls for it.</p>
            <p>Based in <strong>Hyderabad</strong> — available for narrative, documentary, and collaborative work.</p>
          </div>
          <div className="film-credits">
            <div className="row"><span className="k">Roles</span><span className="v">Director / Writer / DOP / Editor / Cinematography</span></div>
            <div className="row"><span className="k">Formats</span><span className="v">Short Film</span></div>
            <div className="row"><span className="k">Gear</span><span className="v">Canon M50 Mark 2, Canon 50MM lens</span></div>
            <div className="row"><span className="k">Based in</span><span className="v">Hyderabad, India</span></div>
            <div className="row"><span className="k">Status</span><span className="v">Working on personal project</span></div>
          </div>
        </div>
      </section>

      <div className="pf-divider"><div className="holes"><Holes /></div><span className="label">Reel 02 / Films</span></div>

      <section
        className={`pf-section pf-fade${IMAGES.filmWork ? " has-bg" : ""}`}
        style={IMAGES.filmWork ? { "--sec-img": `url(${IMAGES.filmWork})` } : undefined}
        ref={reveal}
      >
        <FloatingIcons items={FILM_ICONS_WORK} />
        <div className="pf-eyebrow"><span className="dot" /> <Clapperboard size={15} /> Selected Films</div>
        <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", textTransform: "uppercase" }}>Directing</h2>
        <div className="film-grid">
          {FILM_PROJECTS.map((p, i) => (
            <div
              className="film-card"
              key={i}
              onClick={() => p.video && setActiveVideo(p)}
              style={{ cursor: p.video ? "pointer" : "default" }}
            >
              <div className="film-frame">
                <div className="play"><Play size={16} /></div>
                <div className="badge mono">{p.tc}</div>
              </div>
              <div className="meta">
                <h3>{p.title}</h3>
                <span className="tag mono">{p.tag}</span>
              </div>
              <p className="desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="pf-divider"><div className="holes"><Holes /></div><span className="label">Fade to Contact</span></div>

      <section
        className={`pf-section pf-contact pf-fade${IMAGES.filmContact ? " has-bg" : ""}`}
        style={IMAGES.filmContact ? { "--sec-img": `url(${IMAGES.filmContact})` } : undefined}
        ref={reveal}
      >
        <FloatingIcons items={FILM_ICONS_CONTACT} />
        <div className="pf-eyebrow"><span className="dot" /> <Mail size={15} /> Get in Touch</div>
        <h2>Let's Make<br />Something.</h2>
        <a className="email mono" href="mailto:deventej24@gmail.com">deventej24@gmail.com</a>
        <div className="row">
          <div className="col"><div className="k">Reel</div><a href=" "><Play size={15} /> Watch full reel ↗</a></div>
          <div className="col"><div className="k">Elsewhere</div><a href=" "><FaInstagram size={15} /> Instagram ↗</a></div>
          <div className="col"><div className="k">Based in</div><span><MapPin size={15} /> Hyderabad, India</span></div>
        </div>
      </section>

      <footer className="pf-footer">
        <span>© {new Date().getFullYear()} Byrugonda Devender Teja — Filmmaker</span>
        <span className="mono" style={{ cursor: "pointer" }} onClick={goEdit}>View editing work →</span>
      </footer>
    </div>
  );
}

/* ============================================================
   EDITOR SITE
   ============================================================ */

function EditSite({ goHub, goFilm }) {
  const reveal = useReveal();
  const [activeVideo, setActiveVideo] = useState(null);
  return (
    <div className="edit">
      <Lightbox project={activeVideo} onClose={() => setActiveVideo(null)} />
      <nav className="pf-nav">
        <div className="brand" onClick={goHub}><Scissors size={15} style={{ marginRight: 8, verticalAlign: -2 }} />Devender Teja</div>
        <button className="switch" onClick={goFilm}><Clapperboard size={12} /> Switch to Directing <ArrowRight size={12} /></button>
      </nav>

      <section
        className={`edit-hero${IMAGES.editHero ? " has-bg" : ""}`}
        style={IMAGES.editHero ? { "--hero-img": `url(${IMAGES.editHero})` } : undefined}
      >
        <FloatingIcons items={EDIT_ICONS_HERO} />
        <div className="pf-eyebrow"><span className="dot" /> <Scissors size={15} /> Video Editor</div>
        <h1>Cut. Paced.<br />Precise.</h1>
        <p className="sub">I edit story-driven video — narrative, documentary, and brand work —
          where <strong>pacing and sound design</strong> do the final act of storytelling.</p>
        <div className="timeline">
          <div className="playhead" />
          <div className="ticks"><span>00:00:00</span><span>00:07:30</span><span>00:15:00</span></div>
        </div>
      </section>

      <div className="pf-divider"><div className="holes"><Holes /></div><span className="label">Bin 01 / About</span></div>

      <section
        className={`pf-section pf-fade${IMAGES.editAbout ? " has-bg" : ""}`}
        style={IMAGES.editAbout ? { "--sec-img": `url(${IMAGES.editAbout})` } : undefined}
        ref={reveal}
      >
        <FloatingIcons items={EDIT_ICONS_ABOUT} />
        <div className="pf-eyebrow"><span className="dot" /> <SlidersHorizontal size={15} /> About</div>
        <div className="edit-about">
          <div>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", textTransform: "uppercase", marginBottom: 24 }}>In the Timeline</h2>
            <p>I cut <strong>narrative shorts, documentary, and commissioned brand work</strong> — usually stepping
              in once footage is shot, sometimes editing my own projects start to finish.</p>
            <p>My process favours a fast assembly, then slow, deliberate refinement — rhythm, sound, and colour
              pulled tight over several passes until a cut earns its length.</p>
            <p>Based in <strong>Hyderabad</strong> — available for freelance and ongoing post work.</p>
          </div>
          <div className="film-credits">
            <div className="row"><span className="k">Role</span><span className="v">Editor</span></div>
            <div className="row"><span className="k">Tools</span><span className="v">Premiere Pro, After Effects</span></div>
            <div className="row"><span className="k">Based in</span><span className="v">Hyderabad, India</span></div>
            <div className="row"><span className="k">Status</span><span className="v">Open to projects</span></div>
          </div>
        </div>
      </section>

      <div className="pf-divider"><div className="holes"><Holes /></div><span className="label">Bin 02 / Cuts</span></div>

      <section
        className={`pf-section pf-fade${IMAGES.editWork ? " has-bg" : ""}`}
        style={IMAGES.editWork ? { "--sec-img": `url(${IMAGES.editWork})` } : undefined}
        ref={reveal}
      >
        <FloatingIcons items={EDIT_ICONS_WORK} />
        <div className="pf-eyebrow"><span className="dot" /> <Layers size={15} /> Selected Cuts</div>
        <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", textTransform: "uppercase", marginBottom: 8 }}>Editing</h2>
        <div className="edit-grid">
          {EDIT_PROJECTS.map((p, i) => (
            <div
              className="edit-card"
              key={i}
              onClick={() => p.video && setActiveVideo(p)}
              style={{ cursor: p.video ? "pointer" : "default" }}
            >
              <div className="edit-frame">
                <div className="play"><Play size={15} /></div>
                <div className="badge mono">{p.tc}</div>
              </div>
              <div className="meta">
                <h3>{p.title}</h3>
                <span className="tag mono">{p.tag}</span>
              </div>
              <p className="desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="pf-divider"><div className="holes"><Holes /></div><span className="label">Fade to Contact</span></div>

      <section
        className={`pf-section pf-contact pf-fade${IMAGES.editContact ? " has-bg" : ""}`}
        style={IMAGES.editContact ? { "--sec-img": `url(${IMAGES.editContact})` } : undefined}
        ref={reveal}
      >
        <FloatingIcons items={EDIT_ICONS_CONTACT} />
        <div className="pf-eyebrow"><span className="dot" /> <Mail size={15} /> Get in Touch</div>
        <h2>Send the<br />Footage.</h2>
        <a className="email mono" href="mailto:deventej24@gmail.com">deventej24@gmail.com</a>
        <div className="row">
          <div className="col"><div className="k">Reel</div><a href=" "><Play size={15} /> Watch edit reel ↗</a></div>
          <div className="col"><div className="k">Elsewhere</div><a href=" "><FaInstagram size={15} /> Instagram ↗</a></div>
          <div className="col"><div className="k">Based in</div><span><MapPin size={15} /> Hyderabad, India</span></div>
        </div>
      </section>

      <footer className="pf-footer">
        <span>© {new Date().getFullYear()} Devender Teja — Editor</span>
        <span className="mono" style={{ cursor: "pointer" }} onClick={goFilm}>View directing work →</span>
      </footer>
    </div>
  );
}

/* ============================================================
   APP — hub + two sites + wipe transition
   ============================================================ */

export default function App() {
  const [view, setView] = useState("hub");
  const [wipe, setWipe] = useState(null); // null | 'closing' | 'opening'
  const pendingView = useRef(null);
  const rootRef = useRef(null);

  const navigate = useCallback((target, e) => {
    if (target === view) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const x = e ? `${e.clientX}px` : "50%";
    const y = e ? `${e.clientY}px` : "50%";
    if (rootRef.current) {
      rootRef.current.style.setProperty("--ox", x);
      rootRef.current.style.setProperty("--oy", y);
    }
    if (reduce) { setView(target); window.scrollTo(0, 0); return; }
    pendingView.current = target;
    setWipe("closing");
    setTimeout(() => {
      setView(pendingView.current);
      window.scrollTo(0, 0);
      setWipe("opening");
      setTimeout(() => setWipe(null), 680);
    }, 650);
  }, [view]);

  const goHub = (e) => navigate("hub", e);
  const goFilm = (e) => navigate("film", e);
  const goEdit = (e) => navigate("edit", e);

  return (
    <div className="pf-root" ref={rootRef}>
      <style>{STYLES}</style>
      {wipe && <div className={`pf-wipe ${wipe}`} />}
      {view === "hub" && <Hub onEnter={(target, e) => navigate(target, e)} />}
      {view === "film" && <FilmSite goHub={goHub} goEdit={goEdit} />}
      {view === "edit" && <EditSite goHub={goHub} goFilm={goFilm} />}
    </div>
  );
}
