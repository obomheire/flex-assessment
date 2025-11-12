# Flex Living - Reviews Dashboard

A modern, full-stack reviews management system built with Next.js 16, enabling property managers to analyze, approve, and display guest reviews across multiple booking platforms.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- **📊 Comprehensive Dashboard**: View all properties with aggregated review statistics
- **✅ Review Management**: Approve/reject reviews with intuitive toggle controls
- **📈 Analytics & Trends**: Interactive charts showing rating trends and category breakdowns
- **🔒 Secure Authentication**: Protected routes with NextAuth.js
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **🔌 API Compliant**: Hostaway-compatible API endpoints
- **🌍 Multi-Channel**: Support for Hostaway, Airbnb, Booking.com reviews
- **🏗️ Production Ready**: TypeScript, ESLint, Prisma ORM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file with required variables
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://user:password@host:5432/dbname"
AUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
EOF

# Note: Replace the PostgreSQL connection string with your actual database credentials

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed the database with sample data
npm run db:seed

# 5. Start development server
npm run dev
```

Visit **http://localhost:3000** to see the application.

## 🔐 Demo Credentials

**Manager Login**:

- Email: `manager@flex.com`
- Password: `demo123`

## 📁 Project Structure

```
flex-assessment/
├── app/
│   ├── api/              # API routes (Hostaway, Reviews, Listings)
│   ├── dashboard/        # Protected manager dashboard
│   ├── properties/       # Public property pages
│   └── login/            # Authentication page
├── components/
│   ├── dashboard/        # Dashboard-specific components
│   ├── property/         # Property page components
│   ├── layout/           # Layout components (Navbar, Footer)
│   └── ui/               # Reusable UI components
├── lib/
│   ├── db.ts             # Prisma client singleton
│   ├── auth.ts           # NextAuth configuration
│   └── *Helpers.ts       # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Database seed script
│   └── migrations/       # Migration history
└── docs/
    └── reviews-dashboard.md  # Comprehensive documentation
```

## 🛠️ Tech Stack

| Category          | Technology          | Purpose                              |
| ----------------- | ------------------- | ------------------------------------ |
| **Framework**     | Next.js 16          | Full-stack React framework           |
| **Language**      | TypeScript          | Type safety                          |
| **Database**      | PostgreSQL + Prisma | ORM with type-safe queries           |
| **Auth**          | NextAuth.js v5      | Authentication & authorization       |
| **Styling**       | Tailwind CSS v4     | Utility-first CSS                    |
| **Data Fetching** | SWR                 | Client-side data fetching with cache |
| **Charts**        | Recharts            | React-based charting library         |
| **Utilities**     | date-fns, axios     | Date formatting & HTTP client        |

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint                | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| GET    | `/api/reviews/hostaway` | Fetch reviews in Hostaway API format |
| GET    | `/api/listings`         | Get all properties with stats        |
| GET    | `/api/reviews/google`   | Google Places API exploration        |

### Protected Endpoints (Authentication Required)

| Method | Endpoint               | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| GET    | `/api/reviews`         | Fetch reviews with advanced filtering |
| PATCH  | `/api/reviews/approve` | Approve/reject reviews                |

### Example API Request

```bash
# Get all Hostaway reviews (spec-compliant)
curl http://localhost:3000/api/reviews/hostaway

# Get approved reviews for a specific property
curl "http://localhost:3000/api/reviews?listingId=1&isApproved=true"

# Get all listings with stats
curl http://localhost:3000/api/listings
```

## 📖 Documentation

Comprehensive documentation is available in [`docs/reviews-dashboard.md`](docs/reviews-dashboard.md), covering:

- **Setup Instructions**: Step-by-step installation guide
- **Architecture Overview**: System design and data flow
- **API Documentation**: Detailed endpoint specifications
- **Data Model**: Prisma schema and relationships
- **Google Reviews Findings**: Integration research and recommendations
- **Design Decisions**: Technical choices and rationale

## 🎯 Key Features Explained

### 1. Review Management Dashboard

Managers can:

- View all properties with aggregated review statistics
- Sort by rating, review count, or name
- Click through to detailed property review pages
- See rating trends over time via interactive charts
- View category breakdowns (cleanliness, communication, etc.)

### 2. Approval Workflow

- Reviews default to unapproved state
- Managers toggle approval status with a single click
- Only approved reviews display on public property pages
- Changes sync immediately via SWR

### 3. Public Property Pages

- Clean, modern layout inspired by theflex.global
- Hero section with property images and location
- Amenities and description sections
- Guest reviews section (approved reviews only)
- Responsive design for mobile, tablet, and desktop

### 4. Google Reviews Integration

Explored Google Places API integration:

- ✅ **Documented limitations** (5 reviews max, no pagination)
- ✅ **Cost analysis** ($17 per 1,000 requests)
- ✅ **Implementation guide** available in API route
- ✅ **Recommendation**: Use as supplementary data only

## 🧪 Testing

### Manual Testing

1. **Login Flow**:

   - Visit http://localhost:3000/login
   - Use demo credentials
   - Verify redirect to dashboard

2. **Dashboard**:

   - View properties list
   - Test sorting and filtering
   - Check stats accuracy

3. **Review Management**:

   - Navigate to a property's reviews
   - Toggle approval status
   - Verify filters work correctly

4. **Public Pages**:
   - Visit http://localhost:3000/properties
   - Click on a property
   - Confirm only approved reviews show

### API Testing

```bash
# Test Hostaway API compliance
curl http://localhost:3000/api/reviews/hostaway | jq

# Test filtering
curl "http://localhost:3000/api/reviews?channel=Hostaway&rating=9" | jq

# Test listings with stats
curl http://localhost:3000/api/listings | jq
```

## 🗄️ Database

### Schema Overview

```
User (manager accounts)
  ├── id, email, password (hashed), name, role

Listing (properties)
  ├── id, name, slug, location, description
  ├── imageUrl, amenities (JSON)
  └── ↓ reviews[]

Review (guest reviews)
  ├── id, listingId, listingName, guestName
  ├── rating, reviewText, categories (JSON)
  ├── channel, submittedAt, isApproved
  └── ↑ listing
```

### Database Commands

```bash
# View data in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name

# Seed database
npm run db:seed
```

## 🎨 Styling & Branding

The application uses Flex Living's teal/turquoise brand colors:

- **Primary**: `#0d9488` (Teal 600)
- **Primary Dark**: `#0f766e` (Teal 700)
- **Primary Light**: `#5eead4` (Teal 300)
- **Accent**: `#14b8a6` (Teal 500)

Custom CSS includes:

- Branded scrollbars
- Smooth transitions
- Focus states
- Selection colors

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with sample data
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
```

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
HOSTAWAY_ACCOUNT_ID="61148"
HOSTAWAY_API_KEY="f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"
```

### Deploy Migrations to Production

```bash
npx prisma migrate deploy
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For questions or issues:

- **Documentation**: See `docs/reviews-dashboard.md`
- **Issues**: Open an issue on GitHub
- **Email**: support@theflex.global

---

**Built with ❤️ by the Flex Living team**
