<h1 align="center" style="position: relative;">
  <br>
  🛡️ Nora Lyf Shopify Theme
</h1>

A custom Shopify theme designed specifically for **Nora Lyf** - a health and wellness e-commerce platform specializing in genuine health products, supplements, and wellness solutions from 300+ trusted brands.

<p align="center">
  <a href="./LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/Shopify-Theme-96bf47" alt="Shopify Theme">
</p>

## About Nora Lyf

Nora Lyf is a comprehensive health and wellness platform that offers:
- 🏥 **Genuine Health Products**: 100% authentic supplements and health products
- 🏢 **300+ Trusted Brands**: Curated selection from verified manufacturers
- 🎯 **Expert Guidance**: Professional recommendations for health concerns
- 🚀 **Right Results**: Evidence-based products for optimal health outcomes

## Features

This custom Shopify theme includes specialized components for the health and wellness industry:

### 🎨 Custom Sections
- **Hero Banner**: Eye-catching landing section with health-focused messaging
- **Featured Products**: Showcase premium health products with detailed information
- **Category Showcase**: Browse products by health concerns and categories
- **Testimonials**: Customer success stories and reviews
- **Collection Filters**: Advanced filtering for supplements and health products
- **Trust Elements**: Security badges and authenticity guarantees

### 🎯 Health & Wellness Focused
- Product categorization by health concerns
- Brand showcase for 300+ trusted manufacturers
- Expert guidance integration
- Mobile-optimized for health-conscious consumers
- Accessibility features for all users

### 🛡️ Trust & Security
- Authenticity guarantees
- Secure payment processing
- Privacy-compliant design
- Professional medical disclaimers

## Theme Architecture

## Getting Started

### Prerequisites

Before starting, ensure you have the latest Shopify CLI installed:

- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) – helps you download, upload, preview themes, and streamline your workflows

If you use VS Code:

- [Shopify Liquid VS Code Extension](https://shopify.dev/docs/storefronts/themes/tools/shopify-liquid-vscode) – provides syntax highlighting, linting, inline documentation, and auto-completion specifically designed for Liquid templates

### Clone

Clone this repository using Git:

```bash
git clone https://github.com/fayzan101/Shopify-site.git
cd Shopify-site
```

### Preview

Preview this theme using Shopify CLI:

```bash
shopify theme dev
```

### Deploy

Deploy the theme to your Shopify store:

```bash
shopify theme push
```

## Nora Lyf Custom Components

### Hero Banner (`Nora Lyf-hero-banner.liquid`)
Custom hero section with:
- Shield icon representing trust and authenticity
- Centered messaging about health transformation
- Navigation links to key product categories
- Mobile-responsive design

### Featured Products (`Nora Lyf-featured-products.liquid`)
Specialized product showcase with:
- Health product cards with vendor information
- Price display with compare-at pricing
- Sale badges for promotional items
- Grid layout optimized for supplement products

### Category Showcase (`Nora Lyf-category-showcase.liquid`)
Health-focused category browsing:
- Browse by health concerns
- Visual category representations
- Product counts per category
- Intuitive navigation for health shoppers

### Collection Components
- **Filters** (`Nora Lyf-collection-filters.liquid`): Advanced filtering for supplements
- **Headers** (`Nora Lyf-collection-header.liquid`): Collection page headers
- **Products** (`Nora Lyf-collection-products.liquid`): Product grid for collections

### Testimonials (`Nora Lyf-testimonials.liquid`)
Customer success stories with:
- Health transformation testimonials
- Star ratings
- Customer verification
- Mobile-optimized carousel

## Project Structure

```bash
shopify_site/
├── assets/          # Static assets (CSS, JS, images, fonts)
│   ├── Nora Lyf-*    # Nora Lyf-specific styling and scripts
│   ├── base.css     # Core theme styles
│   └── components/  # Component-specific styles
├── config/          # Theme settings and configuration
├── layout/          # Page layout templates
├── locales/         # Internationalization files
├── sections/        # Page sections and components
│   ├── Nora Lyf-*    # Custom Nora Lyf sections
│   ├── header.liquid
│   └── footer.liquid
├── snippets/        # Reusable code fragments
└── templates/       # Page templates
```

### Key Nora Lyf Files
- `sections/Nora Lyf-hero-banner.liquid` - Main hero section
- `sections/Nora Lyf-featured-products.liquid` - Product showcase
- `sections/Nora Lyf-category-showcase.liquid` - Health categories
- `sections/Nora Lyf-testimonials.liquid` - Customer reviews
- `sections/Nora Lyf-collection-*.liquid` - Collection pages
- `assets/Nora Lyf-*.css` - Custom styling
- `assets/Nora Lyf-*.js` - Custom JavaScript

## Development Guidelines

### Color Scheme
The Nora Lyf theme uses a health-focused color palette:
- **Primary**: `#24BAAD` (Teal) - Trust and wellness
- **Secondary**: `#04683F` (Dark Green) - Natural health
- **Accent**: `#B88B34` (Gold) - Premium quality
- **Text**: `#333` (Dark Gray) - Readability
- **Background**: `#FAFAFA` (Light Gray) - Clean appearance

### CSS Architecture
- Use the `Nora Lyf-` prefix for all custom components
- Follow BEM methodology for CSS classes
- Utilize CSS custom properties for theming
- Ensure mobile-first responsive design

### JavaScript Guidelines
- Keep scripts modular and component-specific
- Use vanilla JavaScript where possible
- Ensure accessibility compliance
- Optimize for performance on mobile devices

## Customization

### Theme Settings
Configure the theme through the Shopify admin:
1. Go to Online Store > Themes
2. Click "Customize" on the Nora Lyf theme
3. Modify sections, colors, and layout options
4. Preview changes before publishing

### Adding New Sections
1. Create new `.liquid` files in the `sections/` directory
2. Follow the `Nora Lyf-` naming convention
3. Include proper schema for customization options
4. Test across different devices and browsers

## Technical Implementation

### Liquid Templates

[Templates](https://shopify.dev/docs/storefronts/themes/architecture/templates#template-types) control what's rendered on each type of page in a theme.

The Nora Lyf theme uses [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates) to make it easy for merchants to customize their health and wellness store.

Custom templates include:
- Product pages optimized for supplement information
- Collection pages with health category filtering
- Contact forms with health consultation options
- About pages highlighting medical disclaimers

### Custom Sections

[Sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) are Liquid files that allow you to create reusable modules of content that can be customized by merchants.

Nora Lyf-specific sections include health-focused schema settings for:
- Product dosage information
- Health concern categorization
- Brand authenticity verification
- Medical disclaimer content
- Customer testimonial management

For more information, refer to the [section schema documentation](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema).

### Component Blocks

[Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) let developers create flexible layouts by breaking down sections into smaller, reusable pieces of Liquid.

Nora Lyf blocks are designed for health and wellness content:
- Health benefit highlights
- Ingredient information cards
- Usage instruction blocks
- Safety warning displays
- Brand showcase elements

For more information, refer to the [block schema documentation](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema).

## Performance & SEO

### Optimization Features
- Lazy loading for product images
- Minified CSS and JavaScript
- Optimized font loading
- Mobile-first responsive design
- Fast loading times for health product catalogs

### SEO Best Practices
- Structured data for health products
- Proper heading hierarchy
- Alt text for all images
- Meta descriptions for health categories
- Schema markup for supplement information

## Schema Configuration

When developing health and wellness components, we recommend these guidelines:

- **Health Product Settings**: Use schema for supplement information:

  ```liquid
  <div class="product-dosage" style="--dosage: {{ product.metafields.health.dosage }}">
    Recommended Dosage: {{ product.metafields.health.dosage }}
  </div>

  {% schema %}
  {
    "settings": [{
      "type": "text",
      "label": "Dosage Information",
      "id": "dosage",
      "info": "Daily recommended dosage"
    }]
  }
  {% endschema %}
  ```

- **Health Category Settings**: For category-based layouts:

  ```liquid
  <div class="health-category {{ section.settings.health_focus }}">
    ...
  </div>

  {% schema %}
  {
    "settings": [{
      "type": "select",
      "id": "health_focus",
      "label": "Health Focus",
      "options": [
        { "value": "immunity", "label": "Immune Support" },
        { "value": "energy", "label": "Energy & Vitality" },
        { "value": "digestive", "label": "Digestive Health" }
      ]
    }]
  }
  {% endschema %}
  ```

## Compliance & Legal

### Medical Disclaimers
All health product pages include appropriate medical disclaimers as required by regulations.

### Data Privacy
The theme is designed to comply with:
- GDPR requirements
- CCPA compliance
- Health data protection standards
- Cookie consent management

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode support

## Contributing

We welcome contributions to improve the Nora Lyf Shopify theme! This theme is specifically designed for health and wellness e-commerce, and we ask that contributions align with this focus.

### Contribution Guidelines
- Follow health industry best practices
- Ensure compliance with medical regulations
- Maintain accessibility standards
- Test across multiple devices and browsers
- Document any new health-specific features

### Code Standards
- Use the `Nora Lyf-` prefix for all custom components
- Follow existing naming conventions
- Include proper schema documentation
- Write clean, maintainable code
- Add comments for complex health-related logic

## Support

For questions about the Nora Lyf theme:
- Check the [Shopify Theme Documentation](https://shopify.dev/docs/storefronts/themes)
- Review health industry compliance requirements
- Test thoroughly with health product data
- Ensure mobile optimization for health shoppers

## License

Nora Lyf Shopify Theme is open-sourced under the [MIT](./LICENSE.md) License.

---

**⚠️ Medical Disclaimer**: This theme is designed for e-commerce purposes only. Always include appropriate medical disclaimers and comply with local health product regulations when using this theme for supplement or health product sales.
