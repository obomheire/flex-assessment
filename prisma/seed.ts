import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create manager user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const manager = await prisma.user.upsert({
    where: { email: 'manager@flex.com' },
    update: {},
    create: {
      email: 'manager@flex.com',
      password: hashedPassword,
      name: 'Flex Manager',
      role: 'manager',
    },
  });

  console.log('Created manager user:', manager.email);

  // Create properties
  const properties = [
    {
      name: '2B N1 A - 29 Shoreditch Heights',
      slug: '2b-n1-a-29-shoreditch-heights',
      location: 'Shoreditch, London, UK',
      description: 'Modern 2-bedroom apartment in the heart of Shoreditch with stunning city views. Perfect for professionals and digital nomads.',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Workspace', 'Gym Access']),
    },
    {
      name: 'Studio Mitte - Berlin Central',
      slug: 'studio-mitte-berlin-central',
      location: 'Mitte, Berlin, Germany',
      description: 'Stylish studio in Berlin\'s most vibrant neighborhood. Walking distance to museums, cafes, and public transport.',
      imageUrl: 'https://images.unsplash.com/photo-1502672260066-6bc35f0a1b68?w=800',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Heating', 'Workspace', 'Bike Storage']),
    },
    {
      name: '1B Marais Loft - Paris',
      slug: '1b-marais-loft-paris',
      location: 'Le Marais, Paris, France',
      description: 'Charming loft in the historic Marais district. High ceilings, exposed beams, and Parisian charm.',
      imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Heating', 'Workspace', 'Balcony']),
    },
    {
      name: '2B Camden Heights',
      slug: '2b-camden-heights',
      location: 'Camden, London, UK',
      description: 'Spacious 2-bedroom near Camden Market. Ideal for creative professionals and music lovers.',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Workspace', 'Rooftop Access']),
    },
    {
      name: 'Penthouse Kreuzberg',
      slug: 'penthouse-kreuzberg',
      location: 'Kreuzberg, Berlin, Germany',
      description: 'Luxury penthouse with panoramic views of Berlin. Modern design meets industrial chic.',
      imageUrl: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Workspace', 'Terrace', 'Gym']),
    },
    {
      name: 'Cozy Saint-Germain Studio',
      slug: 'cozy-saint-germain-studio',
      location: 'Saint-Germain-des-Prés, Paris, France',
      description: 'Intimate studio in the literary heart of Paris. Perfect for solo travelers and writers.',
      imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Heating', 'Workspace']),
    },
  ];

  const createdListings = [];
  for (const property of properties) {
    const listing = await prisma.listing.upsert({
      where: { slug: property.slug },
      update: {},
      create: property,
    });
    createdListings.push(listing);
    console.log('Created listing:', listing.name);
  }

  // Guest names pool
  const guestNames = [
    'Sarah Johnson', 'Michael Chen', 'Emma Thompson', 'David Martinez',
    'Lisa Anderson', 'James Wilson', 'Sofia Rodriguez', 'Alex Kim',
    'Maria Garcia', 'Tom Brown', 'Anna Schmidt', 'Chris Taylor',
    'Nina Patel', 'Max Mueller', 'Julia Dubois', 'Ryan O\'Connor',
    'Leah Cohen', 'Marco Rossi', 'Zara Ahmed', 'Lucas Silva',
  ];

  // Review text templates
  const reviewTemplates = {
    excellent: [
      'Absolutely fantastic stay! The apartment exceeded all expectations. Everything was spotless and the location couldn\'t be better.',
      'Perfect place for our stay. The host was incredibly responsive and helpful. Would definitely return!',
      'Outstanding experience from start to finish. The apartment is even better than the photos suggest.',
      'Couldn\'t have asked for a better place. Modern, clean, and in the perfect location. Highly recommend!',
      'Exceptional property! Every detail was thought through. Made our trip truly memorable.',
    ],
    good: [
      'Really enjoyed our stay. The apartment was clean and well-equipped. Minor issues were quickly resolved.',
      'Great location and comfortable space. A few small things could be improved but overall very satisfied.',
      'Good experience overall. The apartment met our needs and the host was helpful.',
      'Nice place with good amenities. Would consider staying again on our next visit.',
      'Solid choice for accommodation. Clean, comfortable, and conveniently located.',
    ],
    average: [
      'Decent stay. The apartment was as described but nothing exceptional.',
      'Okay experience. Some aspects were good, others could use improvement.',
      'The place served its purpose. Location was convenient but the apartment itself was basic.',
      'Average stay. Met basic expectations but didn\'t exceed them.',
      'Fair accommodation. Would be great for a short stay but not ideal for longer periods.',
    ],
    poor: [
      'Disappointed with several aspects. The cleanliness wasn\'t up to standard and communication was lacking.',
      'Not what we expected based on the listing. Several amenities weren\'t working properly.',
      'Below average experience. The apartment needs maintenance and better attention to detail.',
      'Had some issues during our stay that weren\'t addressed promptly. Expected better quality.',
      'Unfortunate stay. Location was the only positive. The apartment itself needs significant improvement.',
    ],
  };

  const channels = ['Hostaway', 'Airbnb', 'Booking.com'];

  // Generate 50 reviews
  const reviews = [];
  for (let i = 0; i < 50; i++) {
    const listing = createdListings[Math.floor(Math.random() * createdListings.length)];
    const guestName = guestNames[Math.floor(Math.random() * guestNames.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    
    // Generate rating (weighted towards positive)
    const ratingRoll = Math.random();
    let rating: number;
    let reviewCategory: string;
    
    if (ratingRoll < 0.5) { // 50% excellent (9-10)
      rating = 9 + Math.random();
      reviewCategory = 'excellent';
    } else if (ratingRoll < 0.8) { // 30% good (7.5-9)
      rating = 7.5 + Math.random() * 1.5;
      reviewCategory = 'good';
    } else if (ratingRoll < 0.95) { // 15% average (6-7.5)
      rating = 6 + Math.random() * 1.5;
      reviewCategory = 'average';
    } else { // 5% poor (4-6)
      rating = 4 + Math.random() * 2;
      reviewCategory = 'poor';
    }
    
    rating = Math.round(rating * 10) / 10; // Round to 1 decimal

    // Generate category ratings based on overall rating
    const cleanlinessVariation = (Math.random() - 0.5) * 1;
    const communicationVariation = (Math.random() - 0.5) * 1;
    const rulesVariation = (Math.random() - 0.5) * 1;
    
    const categories = {
      cleanliness: Math.min(10, Math.max(1, Math.round(rating + cleanlinessVariation))),
      communication: Math.min(10, Math.max(1, Math.round(rating + communicationVariation))),
      respect_house_rules: Math.min(10, Math.max(1, Math.round(rating + rulesVariation))),
      value: Math.min(10, Math.max(1, Math.round(rating))),
      location: Math.min(10, Math.max(1, Math.round(rating + (Math.random() - 0.3)))),
    };

    // Random date within last 12 months
    const daysAgo = Math.floor(Math.random() * 365);
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - daysAgo);

    const reviewText = reviewTemplates[reviewCategory as keyof typeof reviewTemplates][
      Math.floor(Math.random() * reviewTemplates[reviewCategory as keyof typeof reviewTemplates].length)
    ];

    // 60% of reviews are approved by default
    const isApproved = Math.random() < 0.6 && rating >= 7;

    reviews.push({
      listingId: listing.id,
      listingName: listing.name,
      guestName,
      rating,
      reviewText,
      categories: JSON.stringify(categories),
      channel,
      submittedAt,
      isApproved,
    });
  }

  // Insert all reviews
  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    });
  }

  console.log(`Created ${reviews.length} reviews`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

