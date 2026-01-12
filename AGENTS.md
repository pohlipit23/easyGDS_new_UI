# AGENTS.md - easyGDS New UI Codebase Guide

## Project Overview
This is a static HTML/CSS/JavaScript codebase for travel booking UIs. The project contains multiple HTML files demonstrating homepage, search results, hotel details, shopping basket, payment flows, and other travel booking components.

## Build/Lint/Test Commands

This is a static HTML project with no build system. To work with the files:

- **View files locally**: Open HTML files directly in a browser or use a local server
  - `npx serve .` (if Node.js is available)
  - `python -m http.server 8000` (if Python is available)

No test framework is currently set up. Testing should be done manually by:
- Opening HTML files in a browser
- Testing responsive behavior using browser dev tools
- Verifying interactive elements (carousels, tabs, forms)
- Checking accessibility (keyboard navigation, screen readers)

No linting tools are configured. Follow the style guidelines below to maintain consistency.

## Code Style Guidelines

### HTML Structure

- **DOCTYPE & Language**: Always start with `<!DOCTYPE html>` and `<html lang="en">`
- **Meta tags**: Always include charset and viewport meta tags
  ```html
  <meta charset="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  ```

- **Page Layout Structure**:
  ```html
  <body>
    <div class="flex flex-col min-h-screen">
      <header>...</header>
      <main class="container mx-auto px-4 md:px-6 py-8 flex-grow">...</main>
      <footer>...</footer>
    </div>
  </body>
  ```

### Imports & External Resources

- **Tailwind CSS**: Use CDN with appropriate plugins
  ```html
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography,container-queries"></script>
  ```

- **Fonts**: Use Google Fonts via CDN
  - Air Astana: `Outfit` family
  - easyGDS: `Raleway` family
  - Malaysia Airlines: `Roboto` family

- **Icons**: Use Material Icons Round or Material Symbols Outlined
  ```html
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
  ```

- **Alpine.js**: Use defer loading when needed
  ```html
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  ```

### Tailwind Configuration

Define a consistent `tailwind.config` object in a `<script>` tag within `<head>`:

```javascript
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "[brand-primary-color]",
        secondary: "[brand-secondary-color]",
        "text-main": "#1A1A1A",
        "text-muted": "#555555",
        "bg-surface": "#F5F8FF",
        success: "#4CAF50",
      },
      fontFamily: {
        sans: ["[FontName]", "sans-serif"],
      },
      fontSize: {
        // Accessibility: minimum ~11pt (14.7px)
        'xs': '0.92rem',
        'sm': '1.0rem',
        'base': '1.125rem',
      },
      boxShadow: {
        'subtle': '0 2px 10px -5px rgba(primary-color, 0.15)',
        'float': '0 5px 15px -5px rgba(0, 0, 0, 0.08)',
      }
    },
  },
};
```

### CSS Styling

- **Custom styles**: Add in `<style>` tag in `<head>`
  - Hide scrollbars for cleaner UI
  - Align material icons vertically
  - Custom icon shapes (e.g., tailfin-icon for flight routes)

```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.material-icons-round {
  vertical-align: middle;
}

.tailfin-icon {
  width: 20px;
  height: 20px;
  background-color: [primary-color];
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 100%, 0 70%);
  display: inline-block;
  flex-shrink: 0;
}

.tailfin-icon.return {
  transform: scaleX(-1);
}
```

### Naming Conventions

- **File naming**: Use descriptive names with numbers for ordering (e.g., `1_search_result_horizontal`, `2_hotel_details`)
- **IDs**: Use kebab-case (e.g., `search-widget`, `flight-details`, `hotel-summary`)
- **Classes**: Use Tailwind utility classes, custom classes only when necessary for shared styles
- **JavaScript functions**: Use camelCase (e.g., `toggleSection`, `scrollSlider`, `activateWidget`)

### Interactive Components

- **Carousels**: Use scroll-snap for smooth, native feel
  ```html
  <div class="image-carousel flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
    <img class="image-carousel-item w-full h-full object-cover flex-shrink-0 snap-center" />
  </div>
  ```

- **Expandable Sections**: Use toggle functions to show/hide
  ```javascript
  function toggleSection(id) {
    const section = document.getElementById(id);
    section.classList.toggle('hidden');
  }
  ```

- **Tabs**: Use data attributes to manage active states
  ```html
  <button data-tab="packages" data-active="true">Packages</button>
  <div id="tab-packages" class="tab-content block">...</div>
  ```

### Responsive Design

- **Mobile-first approach**: Write mobile styles first, use `md:` and `lg:` prefixes for larger screens
- **Grid layouts**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern
- **Spacing**: Use consistent padding (e.g., `px-4 md:px-6`, `py-8`)
- **Images**: Use responsive sizing with `aspect-ratio` utilities

### Accessibility

- **Font size**: Minimum 11pt (~14.7px) for body text
- **Contrast**: Ensure text-primary on light backgrounds, white on dark backgrounds
- **Focus states**: Use `focus:ring-primary` on all interactive elements
- **Labels**: Always associate form inputs with labels using `for` attribute
- **Alt text**: Provide descriptive alt text for all images
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible

### Brand Guidelines

Each brand uses specific color schemes and fonts:

**Air Astana**:
- Primary: `#C8AA6E` (Gold)
- Secondary: `#2D2D2D` (Graphite Grey)
- Font: Outfit

**easyGDS**:
- Primary: `#203C94` (Blue)
- Secondary: `#1A3994` (Dark Blue)
- Font: Raleway

**Malaysia Airlines (MHolidays)**:
- Primary: `#0D4689` (Blue)
- Accent: `#C7EAFB` (Light Blue)
- Font: Roboto

### Error Handling

- **Form validation**: Use HTML5 validation attributes (`required`, `pattern`, `type`)
- **User feedback**: Display errors inline below form fields
- **Loading states**: Show loading indicators for async operations (e.g., `class="animate-spin"` on icons)
- **Empty states**: Show helpful messages when no results are available

### Code Organization

- **Header**: Logo, navigation, user account/cart
- **Sticky components**: Use `sticky top-0 z-50` for fixed headers/summaries
- **Main content**: Use `container mx-auto px-4 md:px-6` for consistent alignment
- **Cards**: Use `bg-white rounded-xl shadow-lg border border-gray-100` pattern
- **Price sections**: Show clear breakdown with taxes/fees disclosure

### Images

- Use `object-cover` for responsive images
- Define aspect ratios (e.g., `aspect-[16/10]`, `aspect-[4/3]`)
- Use high-quality Unsplash or placeholder images for demos
- Include alt text for accessibility

### JavaScript Best Practices

- **Event delegation**: Use `addEventListener` on parent containers
- **DOM queries**: Cache selectors when used multiple times
- **Clean separation**: Keep JavaScript at the end of `<body>` or in a separate script tag
- **Arrow functions**: Use for concise callbacks
- **Template literals**: Use for dynamic HTML generation

### Comments

- Add inline comments for complex logic
- Document custom Tailwind extensions
- Note any browser-specific workarounds
- Keep comments brief and focused on "why", not "what"
