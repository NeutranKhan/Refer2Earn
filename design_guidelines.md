# Refer2Earn Liberia - Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from modern fintech platforms (Stripe, Coinbase) and Web3 dashboards that excel at glassmorphism aesthetics combined with neon accent treatments. The design will emphasize trust, transparency, and modern sophistication suitable for a financial platform.

---

## Core Design Principles
1. **Glassmorphism First**: All cards, modals, and elevated surfaces use frosted glass effects with blur
2. **Neon Accents**: Strategic use of glowing neon borders and highlights for CTAs, active states, and data visualization
3. **Data Transparency**: Clear, bold display of earnings, referrals, and financial metrics
4. **Mobile-First Responsiveness**: Touch-friendly targets, collapsible navigation, stacked layouts on mobile

---

## Typography System

**Font Stack**: 
- Primary: Inter (via Google Fonts CDN) - clean, modern sans-serif for UI
- Accent: Space Grotesk (via Google Fonts CDN) - for headlines and numbers

**Hierarchy**:
- Hero Headlines: 3xl to 5xl, bold weight, Space Grotesk
- Section Headers: 2xl to 3xl, semibold, Space Grotesk  
- Dashboard Metrics: 4xl to 6xl, bold, tabular numbers
- Body Text: base to lg, normal weight, Inter
- Labels/Captions: sm to base, medium weight, Inter

---

## Layout & Spacing System

**Tailwind Spacing Primitives**: Use units of **2, 4, 8, 12, 16** for consistency
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Gap between elements: gap-4, gap-6, gap-8
- Margins: m-4, m-8, m-12

**Container Strategy**:
- Full-width backgrounds with inner max-w-7xl containers
- Dashboard content: max-w-6xl
- Form containers: max-w-md centered

---

## Component Library

### Navigation
- **Desktop**: Horizontal glass navbar with blur, logo left, nav center, CTA + user menu right
- **Mobile**: Hamburger menu triggering full-screen glass overlay with large touch targets (min-h-12)
- Nav links with neon underline on hover/active

### Hero Section (Landing Page)
- **Layout**: Asymmetric split - 60% content left, 40% visual right
- **Content**: Large headline (4xl), subheadline (xl), dual CTAs (primary + secondary), trust indicator ("Join 1,000+ Liberians earning")
- **Visual**: Illustrated dashboard mockup or abstract glowing graphic showing referral network
- **Height**: 90vh on desktop, auto-height on mobile (stacked layout)

### Glassmorphic Cards
- Standard card: Frosted glass background with subtle border, rounded-2xl corners, p-6 to p-8
- Stat cards: Compact square/rectangular cards displaying metrics with large numbers, neon glow effects on borders
- Hover state: Subtle lift (translate-y-1), enhanced glow

### Referral Dashboard Layout
**Grid Structure** (Desktop: 3-column, Tablet: 2-column, Mobile: 1-column):

1. **Stats Overview Row**: 3-4 metric cards (Active Referrals, Monthly Credits, Total Earnings, Subscription Status)
2. **Progress Section**: Full-width glass card with progress bar visualization showing path to 3 referrals
3. **Referral Code Section**: Prominent card with large referral code display, copy button with neon pulse animation
4. **Referral List**: Table or card list of active referrals with status indicators
5. **Payout History**: Collapsible table showing transaction history

### Forms
- Glass container with subtle borders
- Input fields: Frosted glass backgrounds, neon focus rings, floating labels
- Buttons: Primary uses neon gradient with glow, secondary is glass with neon border
- Mobile Money selector: Radio buttons styled as large glass cards with provider logos

### Buttons
- Primary CTA: Neon gradient background with outer glow, rounded-lg, px-8 py-3, bold text
- Secondary: Glass background with neon border, same sizing
- Icon buttons: Circular, glass background, neon icon on interaction
- All buttons on images: Glass background with backdrop blur

### Data Visualization
- Progress bars: Glass track with neon-filled progress, rounded-full
- Status indicators: Neon dot (active/inactive) with glass pill background
- Charts (if needed): Line graphs with neon stroke, glass background panels

### Admin Panel Components
- Sidebar navigation: Fixed glass sidebar (w-64) with neon active indicators
- Data tables: Glass cards with zebra striping (subtle opacity variations), neon highlights for important rows
- Action buttons: Grouped in glass button groups with neon separators

---

## Landing Page Structure

**Sections** (Desktop: multi-column where appropriate, Mobile: single column):

1. **Hero**: Asymmetric layout as described above
2. **How It Works**: 3-column grid of glass cards (icon + title + description), step numbers with neon glow
3. **Earning Calculator**: Interactive glass card showing "If you refer X people, you earn Y LRD" with slider input
4. **Social Proof**: 2-column layout with testimonial cards + stat highlights ("500,000 LRD paid out")
5. **Pricing**: Single centered glass card clearly showing 1,500 LRD/month with neon-highlighted benefits list
6. **CTA Section**: Full-width glass panel with centered headline + CTA button + referral code preview
7. **Footer**: Multi-column (4 columns desktop, stacked mobile) - Quick links, Contact, Mobile Money logos, Social media - all in glass container

---

## Mobile Responsiveness

**Breakpoint Strategy**:
- Mobile (base): Single column, stacked cards, full-width buttons
- Tablet (md:): 2-column grids where applicable, larger touch targets (min 44px)
- Desktop (lg:): Multi-column layouts, hover interactions enabled

**Mobile-Specific Adjustments**:
- Navigation collapses to hamburger with full-screen menu
- Dashboard stats stack vertically with full-width cards
- Tables convert to stacked card views with key info prominent
- Reduced font sizes (scale down by 1 step)
- Padding reduced: p-4 instead of p-8

---

## Icons & Assets

**Icon Library**: Heroicons (via CDN) for all UI icons
**Required Icons**: 
- User group (referrals)
- Currency dollar (earnings)
- Chart bar (stats)
- Share (referral sharing)
- Check circle (success states)
- Mobile phone (Mobile Money)

**Images Section**:
- **Hero Image**: Dashboard mockup or abstract glowing network visualization (right side, 40% width)
- **Mobile Money Logos**: Lonestar Cell MTN and Orange Money provider logos in payment selection
- **Social Proof**: Optional user avatars/photos in testimonial cards
- **Admin Dashboard**: Optional analytics charts/graphs as background elements

---

## Animations (Minimal, Strategic Use)

- Neon glow pulse on primary CTAs (subtle, 2s loop)
- Card hover lift (translate-y-1, 200ms ease)
- Progress bar fill animation on load (1s ease-out)
- Fade-in for dashboard metrics on page load (staggered 100ms delay)
- Copy-to-clipboard feedback: Brief neon flash on button
- No scroll-triggered or parallax effects

---

## Accessibility Standards

- Focus states: Neon ring outlines (ring-2) on all interactive elements
- ARIA labels for all icon-only buttons
- Form labels always visible (no placeholder-only inputs)
- Color contrast: Ensure text on glass backgrounds meets WCAG AA (use darker overlays if needed)
- Touch targets: Minimum 44x44px on mobile
- Keyboard navigation: Logical tab order, visible focus indicators

---

**Design Philosophy**: Create a visually striking platform that feels premium and trustworthy while maintaining clarity around financial information. The glassy neon aesthetic should enhance, not obscure, the core functionality of tracking referrals and earnings.