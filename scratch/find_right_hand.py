import re
import xml.etree.ElementTree as ET

tree = ET.parse('/Users/nikithac/Desktop/Test_Antigravity/assets/svgs/architect.svg')
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg'}
path_64 = root.find('.//svg:path[@id="react-path-64"]', ns)
d = path_64.attrib['d']

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

print("Subpaths overlapping right hand region (x: 550-650, y: 200-320):")
for idx, sp in enumerate(subpaths):
    coords = re.findall(r'[-+]?\d*\.\d+|\d+', sp)
    coords = [float(c) for c in coords]
    if not coords:
        continue
    xs = coords[0::2]
    ys = coords[1::2]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    
    # Check if there is overlap with the right hand region
    overlap_x = not (max_x < 550 or min_x > 650)
    overlap_y = not (max_y < 200 or min_y > 320)
    
    if overlap_x and overlap_y:
        print(f"Subpath {idx:3d}: x:({min_x:6.1f} to {max_x:6.1f}), y:({min_y:6.1f} to {max_y:6.1f}) - len: {len(sp)}")
