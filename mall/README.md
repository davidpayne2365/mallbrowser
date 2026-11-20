# Skylight Galleria

A two-level shopping mall you can walk through in the browser, under a glass barrel-vault roof with a real photographed sky. It runs on WebGPU, so open it in a recent Chrome or Edge.

![Food court under the glass roof](screenshot.png)

## Running it

Serve this folder over HTTP (for example `python3 -m http.server`) and open `index.html`. Opening the file directly from disk won't work, because the page fetches its photos from `assets/`.

Controls: hold the mouse or a finger to walk forward and drag to steer. On a keyboard, W A S D walk, Q and E move down and up, Shift goes faster, 1–6 jump to viewpoints, H shows stats, M mutes and Esc opens the menu.

## How it looks real

- **Sky:** a 4K HDR photo of a partly cloudy sky. The sun's direction and brightness, and the sky's ambient light, are measured from the photo.
- **Sun:** casts shadows through the glass roof, including the steel ribs, and lights visible shafts in the air.
- **Surfaces:** photo-scanned marble, granite, wood and plaster, with normal and roughness maps.
- **Reflections:** the polished floors pick up reflections of what's on screen.
- **Ambient light:** a GPU pass works out how much sky each spot in the mall can see, so daylight fades naturally into the shops.

## Credits

Sky and textures are from [Poly Haven](https://polyhaven.com) under CC0:
- kloofendal_48d_partly_cloudy_puresky (Greg Zaal, Jarod Guest)
- marble_01 (Rob Tuytel)
- granite_tile (Charlotte Baglioni)
- wood_floor (Dimitrios Savva)
- painted_plaster_wall (Amal Kumar)
