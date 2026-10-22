"""Regenerate the homepage font subsets without changing their typography.

Requires fonttools[woff] (fontTools 4.61.1 or newer) and the pinned npm fonts.
Only the fixed 600 weight is instantiated; the full optical-size axis remains.
The original font family remains the fallback for future heading characters.
"""
from pathlib import Path
from shutil import copyfile
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "node_modules/@fontsource-variable/newsreader"
DEST = ROOT / "src/assets/fonts"
DEST.mkdir(parents=True, exist_ok=True)
# Include zero because the rotating word reserves space using the font's ch unit.
TEXT = "Keep every location accurate found synced listed trusted without the spreadsheet.0"
for style in ("normal", "italic"):
    font = TTFont(SOURCE / f"files/newsreader-latin-standard-{style}.woff2")
    instantiateVariableFont(font, {"wght": 600}, inplace=True)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=TEXT)
    subsetter.subset(font)
    font.save(DEST / f"newsreader-hero-600-{style}.woff2")
copyfile(SOURCE / "LICENSE", DEST / "Newsreader-LICENSE.txt")
print("Hero font subsets generated; 600 weight and optical sizing preserved.")
