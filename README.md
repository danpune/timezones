# Time Zones

Compare Austin, San Francisco, New York, Mumbai, London or any city, on a phone.

Live: https://danpune.github.io/timezones/

- Live clock, exact to the minute, ticks on its own. Slide or tap an hour to plan ahead, tap Back to now to return.
- Each city's 24-hour strip is painted with its real sky: night, twilight, dawn, daylight.
- Real sunrise and sunset per city, computed from latitude and longitude with the standard
  refraction correction. Matches Apple's World Clock to within a minute or two.
- Offset from your own zone on every card.
- Add any of 418 IANA zones or ~48 named cities. List persists on the device.

Single static file, no dependencies, no API keys, no build step. Coordinates are embedded
from the public-domain tzdata `zone.tab`, so the page works with no connection.
