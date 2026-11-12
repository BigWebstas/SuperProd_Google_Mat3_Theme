#!/usr/bin/env bash
# Regenerates the README screenshots and GIFs in docs/images/.
# Needs: google-chrome-stable, ImageMagick (magick or convert/montage), ffmpeg, python3.
# Run from the repo root after `npm run build`:  bash scripts/capture-docs.sh
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=docs/images; TMP=$(mktemp -d); PORT=8791
mkdir -p "$OUT"
python3 -m http.server $PORT >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null; rm -rf "$TMP"' EXIT
sleep 1
IM=$(command -v magick || true); [ -n "$IM" ] || IM=convert
MONTAGE="montage"; [ -n "$(command -v magick)" ] && MONTAGE="magick montage"

shot() { # size outfile query
  google-chrome-stable --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size="$1" --screenshot="$2" \
    "http://localhost:$PORT/preview.html?$3" >/dev/null 2>&1
}
THEMES="baseline sage coral lavender monochrome"

# 1. Hero shots
shot 1400,900 "$OUT/hero-light.png" "theme=baseline"
shot 1400,900 "$OUT/hero-dark.png"  "theme=baseline&mode=dark"

# 2. All palettes, light + dark (also frames for the cycling GIF)
for t in $THEMES; do for m in light dark; do
  shot 1400,900 "$TMP/$t-$m.png" "theme=$t&mode=$m"
done; done
for m in light dark; do
  $MONTAGE $(for t in $THEMES; do echo "$TMP/$t-$m.png"; done) -tile 3x -geometry 620x+6+6 \
    -background '#888' -quality 86 "$OUT/palettes-$m.jpg"
done

# 3. Priority stripes + states (crop of a tall render)
shot 1400,2400 "$TMP/tall-dark.png"  "theme=baseline&mode=dark"
shot 1400,2400 "$TMP/tall-light.png" "theme=baseline"
$IM "$TMP/tall-dark.png"  -crop 1110x700+280+640 +repage "$OUT/priority-stripes-dark.png"
$IM "$TMP/tall-light.png" -crop 1110x700+280+640 +repage "$OUT/priority-stripes-light.png"

# 4. Tracked-task ring GIF (animation frozen at N points of its 4 s loop)
N=40
for i in $(seq 0 $((N-1))); do
  s=$(python3 -c "print($i*4/$N)")
  shot 1400,1300 "$TMP/r$i.png" "theme=baseline&mode=dark&ringAt=$s"
  $IM "$TMP/r$i.png" -crop 1110x90+280+1092 +repage -resize 900x "$TMP/ring-$(printf %02d $i).png"
done
ffmpeg -y -loglevel error -framerate 10 -i "$TMP/ring-%02d.png" \
  -vf "split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" -loop 0 "$OUT/tracked-task-ring.gif"

# 5. Palette-cycling GIF (each theme light then dark)
i=0; for t in $THEMES; do for m in light dark; do
  $IM "$TMP/$t-$m.png" -resize 800x "$TMP/cyc-$(printf %02d $i).png"; i=$((i+1))
done; done
ffmpeg -y -loglevel error -framerate 1.2 -i "$TMP/cyc-%02d.png" \
  -vf "split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=3" -loop 0 "$OUT/palettes.gif"
echo "done:"; ls -la "$OUT"
