import re
import xml.etree.ElementTree as ET

tree = ET.parse('/Users/nikithac/Desktop/Test_Antigravity/assets/svgs/architect.svg')
root = tree.getroot()

# Find react-path-64
ns = {'svg': 'http://www.w3.org/2000/svg'}
path_64 = root.find('.//svg:path[@id="react-path-64"]', ns)
d = path_64.attrib['d']

# Split by 'M' or 'm' (keeping the delimiter)
subpaths = []
current = []
tokens = re.split(r'([Mm])', d)

# Reconstruction of subpaths
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

print(f"Total subpaths: {len(subpaths)}")

# Find bounding box for each subpath
for idx, sp in enumerate(subpaths):
    # Extract coordinates
    coords = re.findall(r'[-+]?\d*\.\d+|\d+', sp)
    coords = [float(c) for c in coords]
    if not coords:
        continue
    xs = coords[0::2]
    ys = coords[1::2]
    if xs and ys:
        min_x, max_x = min(xs), max(xs)
        min_y, max_y = min(ys), max(ys)
        # Check if the subpath is in the book region (roughly x: 370-650, y: 180-350)
        in_book = min_x >= 350 and max_x <= 660 and min_y >= 180 and max_y <= 360
        print(f"Subpath {idx:3d}: x:({min_x:6.1f} to {max_x:6.1f}), y:({min_y:6.1f} to {max_y:6.1f}) - In Book: {in_book} - len: {len(sp)}")
