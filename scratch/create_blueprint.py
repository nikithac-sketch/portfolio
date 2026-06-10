"""
Fix the blueprint scroll — make it much shorter/thinner vertically
to match the proportions of the original book shape and sit properly
between the character's hands without covering the face or fingers.

Original book was roughly: x:370-648, y:186-230 (only ~44px tall!)
Previous scroll was: y:188-310 (122px tall — way too big)
Fixed scroll: y:190-260 (~70px tall, more proportional)
"""

import xml.etree.ElementTree as ET

ET.register_namespace('', 'http://www.w3.org/2000/svg')

tree = ET.parse('/Users/nikithac/Desktop/Test_Antigravity/assets/svgs/architect.svg')
root = tree.getroot()
ns = {'svg': 'http://www.w3.org/2000/svg'}

group_60 = root.find('.//svg:g[@id="react-group-60"]', ns)

# Remove the old blueprint-scroll group
old_scroll = group_60.find('.//svg:g[@id="blueprint-scroll"]', ns)
if old_scroll is not None:
    group_60.remove(old_scroll)
    print("Removed old blueprint-scroll group")

# Create new, properly sized blueprint scroll group
# Insert before react-group-61 (character outlines)
blueprint_group = ET.SubElement(group_60, 'g')
blueprint_group.set('id', 'blueprint-scroll')

# Coordinates tuned to match the original thin book shape:
#   Paper area: x:400-620, y:192-258
#   Rolls: slightly taller for the cylinder effect

# ── 1. Left rolled edge (small cylinder) ──
left_roll = ET.SubElement(blueprint_group, 'path')
left_roll.set('id', 'scroll-roll-left')
left_roll.set('d',
    'M 390,189 '
    'C 385,190 381,196 380,205 '
    'C 378,216 378,230 379,242 '
    'C 380,252 382,259 386,262 '
    'C 390,264 394,260 396,252 '
    'C 398,242 399,230 399,218 '
    'C 399,206 397,194 390,189 Z'
)
left_roll.set('fill', '#7c4fe0')
left_roll.set('stroke', '#1a1a1a')
left_roll.set('stroke-width', '2')

# ── 2. Right rolled edge (small cylinder) ──
right_roll = ET.SubElement(blueprint_group, 'path')
right_roll.set('id', 'scroll-roll-right')
right_roll.set('d',
    'M 630,185 '
    'C 625,186 621,192 620,201 '
    'C 618,212 618,226 619,238 '
    'C 620,248 622,255 626,258 '
    'C 630,260 634,256 636,248 '
    'C 638,238 639,226 639,214 '
    'C 639,202 637,192 630,185 Z'
)
right_roll.set('fill', '#7c4fe0')
right_roll.set('stroke', '#1a1a1a')
right_roll.set('stroke-width', '2')

# ── 3. Main paper body (thin and wide, matching original book proportions) ──
paper = ET.SubElement(blueprint_group, 'path')
paper.set('id', 'scroll-paper')
paper.set('d',
    'M 397,192 '
    'C 430,190 500,188 540,187 '
    'C 575,186 605,187 623,189 '
    'L 622,255 '
    'C 595,257 555,258 520,259 '
    'C 480,260 445,259 399,257 '
    'Z'
)
paper.set('fill', '#8b5cf6')
paper.set('stroke', '#1a1a1a')
paper.set('stroke-width', '1.8')

# ── 4. House plan drawing (scaled to fit within the smaller paper) ──
# Paper interior is roughly x:405-615, y:194-252
house_plan = ET.SubElement(blueprint_group, 'g')
house_plan.set('id', 'house-plan')
house_plan.set('stroke', '#ffffff')
house_plan.set('stroke-width', '2')
house_plan.set('stroke-linecap', 'round')
house_plan.set('stroke-linejoin', 'round')
house_plan.set('fill', 'none')

# House base walls (smaller, centered in paper)
wall = ET.SubElement(house_plan, 'path')
wall.set('d', 'M 478,250 L 478,222 L 562,222 L 562,250')

# Roof triangle
roof = ET.SubElement(house_plan, 'path')
roof.set('d', 'M 474,223 L 520,202 L 566,223')

# Chimney
chimney = ET.SubElement(house_plan, 'path')
chimney.set('d', 'M 500,212 L 500,201 L 508,201 L 508,208')

# Door
door = ET.SubElement(house_plan, 'path')
door.set('d', 'M 514,250 L 514,236 L 528,236 L 528,250')

# Left window
lwin = ET.SubElement(house_plan, 'path')
lwin.set('d', 'M 486,230 L 486,240 L 504,240 L 504,230 Z')
lwin_h = ET.SubElement(house_plan, 'path')
lwin_h.set('d', 'M 486,235 L 504,235')
lwin_v = ET.SubElement(house_plan, 'path')
lwin_v.set('d', 'M 495,230 L 495,240')

# Right window
rwin = ET.SubElement(house_plan, 'path')
rwin.set('d', 'M 538,230 L 538,240 L 556,240 L 556,230 Z')
rwin_h = ET.SubElement(house_plan, 'path')
rwin_h.set('d', 'M 538,235 L 556,235')
rwin_v = ET.SubElement(house_plan, 'path')
rwin_v.set('d', 'M 547,230 L 547,240')

# Small bush
bush = ET.SubElement(house_plan, 'path')
bush.set('d', 'M 465,250 C 463,246 466,243 470,243 C 474,243 477,246 475,250')

# Ground line
ground = ET.SubElement(house_plan, 'path')
ground.set('d', 'M 458,251 L 572,251')

# Dimension line
dim = ET.SubElement(house_plan, 'path')
dim.set('d', 'M 478,254 L 562,254')
dim.set('stroke-width', '1')
dim.set('stroke-dasharray', '3,2')

# ── 5. Subtle highlights on rolls ──
lh = ET.SubElement(blueprint_group, 'path')
lh.set('d', 'M 393,194 C 392,206 391,225 392,240 C 393,250 394,257 395,259')
lh.set('stroke', '#a78bfa')
lh.set('stroke-width', '1.2')
lh.set('fill', 'none')
lh.set('opacity', '0.5')

rh = ET.SubElement(blueprint_group, 'path')
rh.set('d', 'M 633,190 C 632,202 631,221 632,236 C 633,246 634,253 635,255')
rh.set('stroke', '#a78bfa')
rh.set('stroke-width', '1.2')
rh.set('fill', 'none')
rh.set('opacity', '0.5')

# ── Ensure character outlines render on top ──
char_group = group_60.find('.//svg:g[@id="react-group-61"]', ns)
if char_group is not None:
    group_60.remove(char_group)
    group_60.append(char_group)

tree.write('/Users/nikithac/Desktop/Test_Antigravity/assets/svgs/architect.svg',
           xml_declaration=False, encoding='unicode')

print("✅ Fixed! Blueprint scroll is now compact and fits between the hands.")
