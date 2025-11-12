# Flex Living Reviews Dashboard - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
3. [Tech Stack & Rationale](#tech-stack--rationale)
4. [Architecture Overview](#architecture-overview)
5. [API Routes Documentation](#api-routes-documentation)
6. [Data Model](#data-model)
7. [Google Reviews Integration Findings](#google-reviews-integration-findings)
8. [Key Design Decisions](#key-design-decisions)

---

## Project Overview

The Flex Living Reviews Dashboard is a full-stack Next.js application that enables property managers to:

- View and analyze guest reviews from multiple sources (Hostaway, Airbnb, Booking.com)
- Filter and sort reviews by various criteria
- Approve/reject reviews for public display
- View performance metrics and trends via interactive charts
- Display approved reviews on public property pages

### Features

✅ **Manager Dashboard**: Centralized view of all properties with aggregated stats  
✅ **Review Management**: Approve/reject individual reviews with toggle controls  
✅ **Analytics**: Rating trends and category breakdowns via Recharts  
✅ **Public Display**: Approved reviews shown on property detail pages  
✅ **Authentication**: Protected dashboard with NextAuth credentials provider  
✅ **API Compliance**: `/api/reviews/hostaway` endpoint returns spec-compliant JSON  
✅ **Google Reviews Exploration**: Documented feasibility and limitations

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd flex-assessment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   HOSTAWAY_ACCOUNT_ID="61148"
   HOSTAWAY_API_KEY="f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"
   GOOGLE_PLACES_API_KEY=""  # Optional - for Google Reviews exploration
   ```

   **Note**: Replace the PostgreSQL connection string with your actual database credentials.

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database**

   ```bash
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Access the application**
   - Public site: http://localhost:3000
   - Properties: http://localhost:3000/properties
   - Dashboard: http://localhost:3000/dashboard/reviews
   - Login: http://localhost:3000/login

### Demo Credentials

- **Email**: manager@flex.com
- **Password**: demo123

---

## Tech Stack & Rationale

### Framework & Core

| Technology     | Version | Rationale                                                                                     |
| -------------- | ------- | --------------------------------------------------------------------------------------------- |
| **Next.js**    | 16.0+   | App Router for modern React patterns, built-in API routes, SSR/SSG capabilities, excellent DX |
| **TypeScript** | 5.0+    | Type safety, better IDE support, reduced runtime errors                                       |
| **React**      | 19.0+   | Industry standard, excellent ecosystem, component reusability                                 |

### Database & ORM

| Technology     | Version | Rationale                                                                                          |
| -------------- | ------- | -------------------------------------------------------------------------------------------------- |
| **PostgreSQL** | -       | Production-ready relational database with excellent performance, ACID compliance, and JSON support |
| **Prisma**     | 6.19+   | Type-safe database access, excellent migrations, intuitive schema definition                       |

### Authentication

| Technology      | Version  | Rationale                                                                                |
| --------------- | -------- | ---------------------------------------------------------------------------------------- |
| **NextAuth.js** | 5.0 beta | Industry standard for Next.js auth, flexible providers, JWT sessions, middleware support |
| **bcryptjs**    | 3.0+     | Secure password hashing with configurable work factor                                    |

### Data Fetching & State

| Technology | Version | Rationale                                                                           |
| ---------- | ------- | ----------------------------------------------------------------------------------- |
| **SWR**    | 2.3+    | Lightweight, cache-first, auto-revalidation, optimistic UI, perfect fit for Next.js |

### Styling

| Technology       | Version | Rationale                                                           |
| ---------------- | ------- | ------------------------------------------------------------------- |
| **Tailwind CSS** | 4.0+    | Utility-first, highly customizable, small bundle size, excellent DX |

### Charts & Visualization

| Technology   | Version | Rationale                                                                           |
| ------------ | ------- | ----------------------------------------------------------------------------------- |
| **Recharts** | 3.4+    | Built on D3, declarative API, React-native, customizable, lighter than alternatives |

### Utilities

| Technology   | Version | Rationale                                                     |
| ------------ | ------- | ------------------------------------------------------------- |
| **date-fns** | 4.1+    | Modular date utilities, tree-shakeable, better than moment.js |
| **axios**    | 1.13+   | Promise-based HTTP client, excellent error handling           |

---

## Architecture Overview

### Project Structure

```
flex-assessment/
├── app/
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth configuration
│   │   ├── listings/             # Listings API
│   │   └── reviews/              # Reviews APIs (hostaway, approve, google)
│   ├── dashboard/                # Protected dashboard pages
│   │   └── reviews/              # Review management UI
│   ├── properties/               # Public property pages
│   ├── login/                    # Login page
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home (redirects to /properties)
├── components/
│   ├── dashboard/                # Dashboard-specific components
│   ├── property/                 # Property page components
│   ├── layout/                   # Navbar, Footer
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth configuration
│   ├── normalizeHostawayData.ts  # Hostaway data transformation
│   ├── reviewHelpers.ts          # Review utility functions
│   └── dateHelpers.ts            # Date formatting utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script
│   └── migrations/               # Database migrations
└── docs/
    └── reviews-dashboard.md      # This file
```

### Data Flow

1. **Authentication Flow**:

   ```
   User Login → NextAuth → JWT Token → Middleware → Protected Routes
   ```

2. **Review Approval Flow**:

   ```
   Dashboard → Toggle → PATCH /api/reviews/approve → Database → UI Update (SWR)
   ```

3. **Public Display Flow**:
   ```
   Property Page → GET /api/reviews?isApproved=true → Render Reviews Section
   ```

---

## API Routes Documentation

### GET `/api/reviews/hostaway`

**Purpose**: Fetch and normalize reviews in Hostaway API format (spec-compliant)

**Query Parameters**:

- `listingId` (optional): Filter by listing ID
- `status` (optional): Filter by status (default: "published")

**Response**:

```json
{
  "status": "success",
  "result": [
    {
      "id": 7453,
      "type": "guest-to-host",
      "status": "published",
      "rating": 9.5,
      "publicReview": "Absolutely fantastic stay!",
      "reviewCategory": [
        { "category": "cleanliness", "rating": 10 },
        { "category": "communication", "rating": 10 }
      ],
      "submittedAt": "2020-08-21 22:45:14",
      "guestName": "Sarah Johnson",
      "listingName": "2B N1 A - 29 Shoreditch Heights"
    }
  ]
}
```

### GET `/api/reviews`

**Purpose**: Fetch all reviews with advanced filtering

**Query Parameters**:

- `rating` (number): Minimum rating filter
- `channel` (string): Filter by channel (Hostaway, Airbnb, Booking.com)
- `listingId` (number): Filter by listing ID
- `startDate` (ISO string): Filter reviews after date
- `endDate` (ISO string): Filter reviews before date
- `isApproved` (boolean): Filter by approval status
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)

**Response**:

```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### PATCH `/api/reviews/approve`

**Purpose**: Update review approval status

**Authentication**: Required (JWT via NextAuth)

**Request Body**:

```json
{
  "reviewId": "clx123abc",
  "isApproved": true
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    /* updated review */
  }
}
```

### GET `/api/listings`

**Purpose**: Fetch all listings with aggregated stats

**Query Parameters**:

- `includeReviews` (boolean): Include full review data (default: false)

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "2B N1 A - 29 Shoreditch Heights",
      "slug": "2b-n1-a-29-shoreditch-heights",
      "location": "Shoreditch, London, UK",
      "stats": {
        "totalReviews": 12,
        "approvedReviews": 8,
        "avgRating": 9.2,
        "categoryAverages": { "cleanliness": 9.5, ... }
      }
    }
  ]
}
```

### GET `/api/reviews/google`

**Purpose**: Explore Google Places API integration

**Query Parameters**:

- `placeId` (string): Google Place ID (required if API key is set)

**Response** (without API key):

```json
{
  "status": "requires_setup",
  "message": "Google Places API integration requires configuration",
  "documentation": {
    /* detailed setup guide */
  }
}
```

---

## Data Model

### Prisma Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  role      String   @default("manager")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Listing {
  id          Int      @id @default(autoincrement())
  name        String
  slug        String   @unique
  location    String
  description String?
  imageUrl    String?
  amenities   String?  // JSON string array
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  reviews     Review[]
}

model Review {
  id          String   @id @default(cuid())
  listingId   Int
  listingName String
  guestName   String
  rating      Float    // 0-10 scale
  reviewText  String
  categories  String   // JSON object {cleanliness: 10, communication: 9, ...}
  channel     String   // "Hostaway", "Airbnb", "Booking.com", "Google"
  submittedAt DateTime
  isApproved  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  listing     Listing  @relation(fields: [listingId], references: [id])

  @@index([listingId])
  @@index([channel])
  @@index([isApproved])
}
```

### Relationships

- **One-to-Many**: Listing → Reviews
- **Reviews are denormalized** with `listingName` for query optimization
- **Categories stored as JSON** for flexibility (SQLite limitation)

---

## Google Reviews Integration Findings

### Summary

Google Reviews integration via the **Google Places API** is **technically feasible** but comes with **significant limitations** that make it **unsuitable for comprehensive review management**.

### Requirements

1. **Google Cloud Project** with billing enabled
2. **Places API** enabled in Google Cloud Console
3. **API Key** with Places API permissions
4. **Place ID** for each property (unique identifier from Google Maps)

### API Details

**Endpoint**: `GET https://maps.googleapis.com/maps/api/place/details/json`

**Parameters**:

- `place_id`: Unique identifier for the location
- `fields`: `reviews,rating,user_ratings_total`
- `key`: API key

**Response Structure**:

```json
{
  "result": {
    "name": "Property Name",
    "rating": 4.6,
    "user_ratings_total": 127,
    "reviews": [
      {
        "author_name": "John Doe",
        "rating": 5,
        "text": "Great place!",
        "time": 1634567890,
        "profile_photo_url": "https://..."
      }
    ]
  }
}
```

### Limitations

| Limitation                        | Impact                                               |
| --------------------------------- | ---------------------------------------------------- |
| **Maximum 5 reviews per request** | Cannot retrieve complete review history              |
| **No pagination**                 | Stuck with "most relevant" 5 reviews only            |
| **No filtering**                  | Cannot filter by date, rating, or other criteria     |
| **Not real-time**                 | Reviews may have significant delays                  |
| **Rate limits**                   | 100 requests per 100 seconds per project             |
| **No approval workflow**          | Cannot programmatically manage which reviews display |

### Costs (as of 2024)

- **Place Details (including reviews)**: $17 per 1,000 requests
- **Free tier**: First $200/month credit
- **Break-even**: ~11,764 requests/month free

### Recommended Implementation Approach

If proceeding with Google Reviews:

1. **Store Place IDs** in the `Listing` table
2. **Periodic Sync** (daily/weekly) rather than real-time
3. **Cache Results** in database to minimize API calls
4. **Supplementary Data** - use alongside Hostaway, not as primary source
5. **Manual Approval** - import reviews and use existing approval workflow

### Alternative: Google My Business API

For properties **owned** by Flex Living:

- **Pros**: More detailed review management, business-owner specific features
- **Cons**: Requires business verification, more complex setup
- **Use Case**: Better for properties where Flex Living owns the Google Business Profile

### Implementation in `/api/reviews/google`

The route has been implemented with:

- ✅ Comprehensive documentation endpoint (when no API key)
- ✅ Working integration (when API key provided)
- ✅ Error handling for invalid Place IDs
- ✅ Normalized response matching internal format

### Conclusion

**Recommendation**: Do not integrate Google Reviews as primary source due to the 5-review limitation. Instead:

1. Focus on **Hostaway integration** (more comprehensive)
2. Use Google Reviews for **supplementary social proof** only
3. Manual import if needed for specific high-value properties

---

## Key Design Decisions

### 1. PostgreSQL Database

**Decision**: PostgreSQL for development and production

**Rationale**:

- Production-ready with excellent performance
- ACID compliance and data integrity
- Advanced features like JSON/JSONB columns
- Widely supported with excellent tooling
- Scalable for production workloads
- Native support for complex queries and indexing

**Configuration**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Connection String Format**:

```
postgresql://user:password@host:5432/dbname
```

### 2. SWR vs React Query

**Decision**: SWR

**Rationale**:

- Lighter bundle size
- Built by Vercel (same team as Next.js)
- Simpler API for basic use cases
- Automatic revalidation on focus
- Excellent caching strategy

**Trade-offs**: React Query has more features (mutations, infinite queries) but adds complexity we don't need.

### 3. NextAuth v5 (Beta) vs v4

**Decision**: NextAuth v5 beta

**Rationale**:

- Modern middleware support
- Better TypeScript support
- Cleaner API
- Future-proof for Next.js App Router

**Risk**: Beta status mitigated by stable feature set we're using.

### 4. Client Components vs Server Components

**Decision**: Client components for interactive pages, Server components where possible

**Strategy**:

- Dashboard pages: Client (SWR, state management)
- API routes: Server (database access)
- Static pages: Server where possible

**Rationale**: Leverage React Server Components for better performance while maintaining interactivity where needed.

### 5. JSON Storage for Categories

**Decision**: Store review categories as JSON string

**Rationale**:

- Flexibility for different category structures per channel
- Consistent data structure across all channels
- Can be migrated to JSONB for better query performance if needed
- Prisma makes JSON handling transparent

### 6. Denormalized listingName in Reviews

**Decision**: Store `listingName` in Review table despite having `Listing` relation

**Rationale**:

- Query optimization (avoid joins for list views)
- Historical accuracy (name changes don't affect old reviews)
- Spec compliance (Hostaway API returns `listingName`)

### 7. Approval Workflow

**Decision**: Boolean `isApproved` flag with default `false`

**Rationale**:

- Simple, clear logic
- Default-deny is safer
- Easy to extend to multi-state workflow later
- Indexed for performance

### 8. Recharts vs Chart.js

**Decision**: Recharts

**Rationale**:

- React-first (declarative JSX API)
- Built on D3 (powerful underneath)
- Composable architecture
- Smaller bundle for our use case

---

## Testing the Application

### Manual Testing Checklist

**Authentication**:

- ✅ Login with valid credentials
- ✅ Login with invalid credentials (error shown)
- ✅ Protected routes redirect to login
- ✅ Logout functionality
- ✅ Session persistence

**Dashboard**:

- ✅ Properties list with stats
- ✅ Filtering and sorting
- ✅ Navigation to property detail
- ✅ Stats cards display correctly

**Review Management**:

- ✅ View all reviews for a property
- ✅ Toggle approval status
- ✅ Filter by channel
- ✅ Filter by approval status
- ✅ Charts render correctly
- ✅ Category averages calculate correctly

**Public Pages**:

- ✅ Properties listing loads
- ✅ Property detail page displays
- ✅ Only approved reviews show
- ✅ Hero images load correctly
- ✅ Amenities display

**API Routes**:

- ✅ `/api/reviews/hostaway` returns spec-compliant JSON
- ✅ `/api/reviews` filters work correctly
- ✅ `/api/reviews/approve` requires authentication
- ✅ `/api/listings` includes stats
- ✅ `/api/reviews/google` returns documentation

### API Testing with curl

```bash
# Test Hostaway API route
curl http://localhost:3000/api/reviews/hostaway

# Test with filters
curl "http://localhost:3000/api/reviews?channel=Hostaway&isApproved=true"

# Test listings
curl http://localhost:3000/api/listings

# Test Google Reviews documentation
curl http://localhost:3000/api/reviews/google
```

---

## Future Enhancements

1. **Bulk Operations**: Approve/reject multiple reviews at once
2. **Email Notifications**: Alert managers of new reviews
3. **Advanced Analytics**: Sentiment analysis, trend predictions
4. **Multi-language Support**: Internationalization
5. **Review Responses**: Allow managers to respond to reviews
6. **Export Functionality**: CSV/PDF export of reviews and reports
7. **Webhook Integration**: Real-time updates from Hostaway
8. **Performance Optimizations**: Implement Redis caching for API responses

---

## Support & Maintenance

### Database Backup

```bash
# Backup PostgreSQL database
pg_dump -U username -d dbname > backup.sql

# Restore
psql -U username -d dbname < backup.sql
```

### Reset Database

```bash
npx prisma migrate reset
npm run db:seed
```

### Update Dependencies

```bash
npm update
npm audit fix
```

---

**Documentation Version**: 1.0  
**Last Updated**: November 2025
**Author**: Flex Living Development Team
