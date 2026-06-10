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

# Generate HTML
html = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; background: #eef; margin: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; }
        .card { background: white; border: 1px solid #ccc; padding: 10px; border-radius: 8px; text-align: center; }
        svg { background: #fdfdfd; border: 1px solid #eee; width: 200px; height: 150px; }
    </style>
</head>
<body>
    <h1>architect.svg - subpaths of react-path-64</h1>
    <div class="grid">
"""

for idx, sp in enumerate(subpaths):
    # We embed the subpath in a 1024x768 SVG viewbox, but with a path scale/view
    # Let's find coordinates to auto-zoom
    coords = re.findall(r'[-+]?\d*\.\d+|\d+', sp)
    coords = [float(c) for c in coords]
    if not coords:
        continue
    xs = coords[0::2]
    ys = coords[1::2]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    width = max(10, max_x - min_x)
    height = max(10, max_y - min_y)
    
    # Pad viewbox slightly
    vb_x = min_x - width * 0.1
    vb_y = min_y - height * 0.1
    vb_w = width * 1.2
    vb_h = height * 1.2
    
    html += f"""
        <div class="card">
            <h3>Subpath {idx}</h3>
            <p>x: {min_x:.0f}-{max_x:.0f}, y: {min_y:.0f}-{max_y:.0f}</p>
            <svg viewBox="{vb_x} {vb_y} {vb_w} {vb_h}">
                <path d="{sp}" stroke="black" stroke-width="3" fill="none" />
            </svg>
        </div>
    """

html += """
    </div>
</body>
</html>
"""

with open('/Users/nikithac/Desktop/Test_Antigravity/scratch/visualize_subpaths.html', 'w') as f:
    f.write(html)

print("visualize_subpaths.html generated successfully!")
