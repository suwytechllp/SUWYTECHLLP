import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Images WebP Conversion Update
    content = content.replace('assets/hero.png', 'assets/hero.webp')
    content = content.replace('assets/logo.jpeg', 'assets/logo.webp')
    
    # Preconnect
    if '<link rel="preconnect" href="https://unpkg.com">' not in content:
        content = content.replace('</title>', '</title>\n  <link rel="preconnect" href="https://unpkg.com">\n  <link rel="dns-prefetch" href="https://unpkg.com">')

    # Scripts defer
    content = content.replace('<script src="https://unpkg.com/lucide@latest"></script>', '<script defer src="https://unpkg.com/lucide@latest"></script>')
    content = content.replace('<script src="js/main.js"></script>', '<script defer src="js/main.js"></script>')

    # Accessibility for Lucide icons
    # Replaces <i data-lucide="name"></i> with aria-hidden
    # Also handles if there's inline style
    content = re.sub(r'<i\s+data-lucide="([^"]+)"(?!\s+aria-hidden)[^>]*></i>', r'<i data-lucide="\1" aria-hidden="true"></i>', content)
    # Also handles cases with inline style like <i data-lucide="heart" style="..."></i>
    content = re.sub(r'<i\s+data-lucide="([^"]+)"\s+style="([^"]+)"(?!\s+aria-hidden)[^>]*></i>', r'<i data-lucide="\1" style="\2" aria-hidden="true"></i>', content)

    # Make sure mobile-menu-btn has aria-expanded="false" and aria-controls="nav-menu"
    content = re.sub(r'<button class="mobile-menu-btn"(?!.*aria-expanded)', r'<button class="mobile-menu-btn" aria-expanded="false" aria-controls="nav-menu"', content)

    # For logo image, ensure alt text and dimensions
    content = re.sub(r'<img src="assets/logo\.webp" alt="SUWY TECH Logo" class="logo-img">', r'<img src="assets/logo.webp" alt="SUWY TECH LLP Logo" class="logo-img" width="46" height="46" loading="lazy">', content)
    
    # In index, logo is already correct but let's make sure it has loading=lazy (it's above fold though, so eager is better for index logo? Or browser default. Let's just leave it if it already has width/height.)
    # Replace <link rel="icon" type="image/x-icon" href="assets/logo.webp"> with <link rel="icon" type="image/webp" href="assets/logo.webp">
    content = content.replace('<link rel="icon" type="image/x-icon" href="assets/logo.webp">', '<link rel="icon" type="image/webp" href="assets/logo.webp">')

    # Write back
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Optimized {file}")
