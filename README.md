# The Standard - Login Page

A modern, responsive login page built with React and Vite for The Standard insurance company.

## Features

- ✨ **Modern Design**: Clean, professional interface matching The Standard's brand
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ♿ **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- 🎨 **Premium UI**: Smooth animations, hover effects, and micro-interactions
- 🔒 **Secure**: Password visibility toggle and form validation
- ⚡ **Fast**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Custom styling with CSS variables
- **JavaScript (ES6+)** - Modern JavaScript features

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd login-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
login-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   └── StandardLogo.jsx
│   ├── App.jsx         # Main application component
│   ├── App.css         # Component styles
│   ├── index.css       # Global styles and design system
│   └── main.jsx        # Application entry point
├── index.html          # HTML template
└── package.json        # Project dependencies
```

## Design System

The application uses a comprehensive design system with:

- **Color Palette**: Primary blue (#005daa), accent colors, and semantic colors
- **Typography**: System font stack with defined sizes
- **Spacing**: Consistent spacing scale (xs to xxl)
- **Components**: Reusable form elements, buttons, and layouts
- **Animations**: Smooth transitions and micro-interactions

## Features Breakdown

### Dual Login Sections

1. **Full Account Access** (Left)
   - Username and password login
   - Password visibility toggle
   - Forgot username/password links
   - Create account option

2. **Dental & Vision Only** (Right)
   - Separate login paths for members and employers
   - Location-based routing (New York vs. other states)

### Responsive Design

- **Desktop**: Two-column layout with full features
- **Tablet**: Optimized spacing and touch-friendly controls
- **Mobile**: Single-column stacked layout

### Accessibility

- Semantic HTML5 elements
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- Proper color contrast ratios

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for demonstration purposes.

## Contact

For questions or support, please contact The Standard.
