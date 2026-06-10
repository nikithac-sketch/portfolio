import xml.etree.ElementTree as ET

tree = ET.parse('/Users/nikithac/Desktop/Test_Antigravity/assets/svgs/architect.svg')
root = tree.getroot()

# Helper function to print elements recursively
def print_elem(elem, depth=0):
    tag = elem.tag.split('}')[-1]
    attribs = {k: v for k, v in elem.attrib.items() if k not in ['d']}
    d_len = len(elem.attrib.get('d', ''))
    d_summary = f"d(len={d_len})" if d_len else ""
    print("  " * depth + f"<{tag} id={attribs.get('id')} fill={attribs.get('fill')} stroke={attribs.get('stroke')} {d_summary}>")
    for child in elem:
        print_elem(child, depth + 1)

print_elem(root)
