# Skylight Galleria

A two-level shopping mall you can walk through in the browser, under a glass barrel-vault roof with a real photographed sky. It runs on WebGPU, so open it in a recent Chrome or Edge.

![Food court under the glass roof](screenshot.png)

![The same mall at night](screenshot-night.png)

## Running it

Serve this folder over HTTP (for example `python3 -m http.server`) and open `index.html`. Opening the file directly from disk won't work, because the page fetches its photos from `assets/`.

Controls: hold the mouse or a finger to walk forward and drag to steer. On a keyboard, W A S D walk, Q and E move down and up, Shift goes faster, 1–6 jump to viewpoints, N switches between day and night, H shows stats, M mutes and Esc opens the menu.

## What's in it

- **Day and night:** each time you pass under one of the upper-level bridges, the sky fades between day and a starry night with the Milky Way and a full moon.
- **People:** shoppers walk the concourses, stop at shop windows, browse inside stores and eat at the food court tables, and cashiers stand at the counters.
- **Sound:** it starts when you enter. Crowd chatter gets louder near people, each shop plays its own style of music as you pass, and you can hear the fountains up close.
- **Nature:** trees in the planters, palms around the fountain, living walls in the food court, birds circling above the roof, and drifting clouds whose shadows move across the floor.
- **Floors:** every area has its own stone or tile, with granite inlays.
- **Stores:** about 200 shops with made-up names.

## How it looks real

- **Sky:** a 4K HDR photo of a partly cloudy sky. The sun's direction and brightness, and the sky's ambient light, are measured from the photo.
- **Sun:** casts shadows through the glass roof, including the steel ribs, and lights visible shafts in the air.
- **Surfaces:** photo-scanned marble, granite, wood and plaster, with normal and roughness maps.
- **Reflections:** the polished floors pick up reflections of what's on screen.
- **Ambient light:** a GPU pass works out how much sky each spot in the mall can see, so daylight fades naturally into the shops.

## Credits

Sky and textures are from [Poly Haven](https://polyhaven.com) under CC0:
- kloofendal_48d_partly_cloudy_puresky (Greg Zaal, Jarod Guest)
- rogland_clear_night (Greg Zaal)
- marble_01 (Rob Tuytel)
- granite_tile (Charlotte Baglioni)
- wood_floor (Dimitrios Savva)
- painted_plaster_wall (Amal Kumar)
- floor_tiles_06, large_floor_tiles_02, floor_tiles_08 (Rob Tuytel)
- granite_tile_03 (Charlotte Baglioni)
- herringbone_parquet (Jenelle van Heerden, Sergej Majboroda)
