import re
import xml.etree.ElementTree as ET

tree = ET.parse('/Users/nikithac/Desktop/Test_Antigravity/assets/svgs/architect.svg')
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg'}
path_64 = root.find('.//svg:path[@id="react-path-64"]', ns)
d = path_64.attrib['d']

# Split by M or m
subpaths = []
current = []
tokens = re.split(r'([Mm])', d)

i = 0
while i < len(tokens):
    token = tokens[i]
    if token in ['M', 'm']:
        if current:
            subpaths.append("".join(current))
        current = [token]
    else:
        current.append(token)
    i += 1
if current:
    subpaths.append("".join(current))

# Save subpaths around the book region
for idx in [37, 41, 42, 45, 46, 48, 61]:
    sp = subpaths[idx]
    coords = re.findall(r'[-+]?\d*\.\d+|\d+', sp)
    coords = [float(c) for c in coords]
    xs = coords[0::2]
    ys = coords[1::2]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    w = max(10, max_x - min_x)
    h = max(10, max_y - min_y)
    
    # Create simple SVG
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{min_x - 10} {min_y - 10} {w + 20} {h + 20}" width="400" height="300"><path d="{sp}" stroke="black" stroke-width="3" fill="none" /></svg>'
    
    with open(f'/Users/nikithac/Desktop/Test_Antigravity/scratch/sp_{idx}.svg', 'w') as f:
        f.write(svg)

print("Saved SVGs for subpaths!")
