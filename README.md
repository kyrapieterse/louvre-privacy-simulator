# Louvre privacy simulator

Trace sightlines through a side section of angled slats from a chosen viewing position. This free browser tool works offline and processes files on your device.

## Run locally

Download the repository as a ZIP, extract it and open `index.html` in a modern browser. No build step, account or API key is required.

## Try the example

Set the slat angle to 0°, then to 60°. Compare the sampled open sightlines and the point where a blocked ray stops. Move the eye height to see the effect of looking down into the screen.

## How it works

A viewer outside a vertical slat array looks towards 31 equally spaced points on a 600 mm vertical target. Each line is intersected with the rotated rectangle of each slat in the side section. Open percentages describe this particular sample and viewing position. End effects, reflections and finite side edges are outside the 2D model.

For related examples and project guidance, see the [Tint & Screen privacy screen guide](https://tintandscreen.co.za/architectural-screens/privacy-screens/).

## License

The code and original sample geometry are available under the [MIT License](LICENSE). The Tint & Screen name and logo identify the publisher and are outside the code license. Artwork and photos you load keep their own rights.
