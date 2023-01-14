# -strip to prevent timestamp in image
# resize at the end to smoothen edges.
convert -strip -background transparent -density 512 logo.svg -antialias -resize 512x512 assets/icon.png

convert -strip -background black -density 512 logo.svg -antialias -resize 512x512 assets/icon-flat.png

convert -strip -background black -density 512 logo.svg \
    -resize 80% -background black -gravity center -extent 512x512 -antialias assets/icon-maskable.png

