# Video Cover Hero Design

## Goal

Experiment with the supplied astronaut MP4 as the Ferry Labs hero background without changing the approved cinematic cover layout, conversion copy, or booking action.

## Chosen approach

Use a native decorative `<video>` as the full-bleed hero media. It will autoplay muted, loop, and play inline. The existing `cover-hero.png` remains as the poster and fallback so the hero is readable before playback, when video loading fails, and when a visitor prefers reduced motion.

## Media and layout

- Copy the supplied MP4 into the repository as `cover-hero.mp4` without transcoding it.
- Keep `cover-hero.png` as the poster and reduced-motion fallback.
- Place an always-present fallback image behind the video.
- Give both media elements the same absolute fill, `object-fit: cover`, and responsive object positioning.
- Preserve the existing navy overlay, headline, supporting copy, CTA, navigation, and footer layout.

## Behavior and accessibility

- Render the video with `autoPlay`, `muted`, `loop`, and `playsInline`.
- Treat it as decorative with `aria-hidden="true"`; do not expose controls or audio.
- Use `preload="metadata"` to avoid eagerly downloading more than the browser requires to begin playback.
- Under `prefers-reduced-motion: reduce`, hide the video so the still image remains visible.
- If the browser cannot decode or load the MP4, the poster/fallback image remains behind it.

## Testing

- Extend the existing Node test to require the local MP4, video playback attributes, poster, fallback image, and reduced-motion rule.
- Verify the MP4 is copied byte-for-byte from the supplied file.
- Re-run the existing cover, copy, CTA, and no-canvas assertions.
- Render at 1440×900 and 390×844; confirm playback, no overflow, readable text, correct crop, and no new browser errors.

## Scope

This experiment does not add playback controls, sound, a media settings UI, video transcoding, or changes below the hero.
