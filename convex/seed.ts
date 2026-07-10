import { mutation } from "./_generated/server";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingBooks = await ctx.db.query("books").collect();
    if (existingBooks.length > 0) {
      return "Already seeded";
    }

    // Seed books
    const bookIds = [];
    const books = [
      {
        title: "The Last Ember",
        author: "Elena Vasquez",
        genre: "Fantasy",
        synopsis: "A disgraced fire mage discovers an ancient flame that could either save her dying kingdom or burn it to ash.",
        cover_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        pdf_url: "https://www.penguin.co.uk/books/315135/the-midnight-library",
        rating: 4.5,
        featured: true,
      },
      {
        title: "Beneath the Iron City",
        author: "Marcus Chen",
        genre: "Thriller",
        synopsis: "A detective uncovers a secret society lurking in the tunnels beneath the city — and they've been watching her for years.",
        cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        pdf_url: "https://jamesclear.com/atomic-habits",
        rating: 4.8,
        featured: true,
      },
      {
        title: "The Silent Tide",
        author: "Isobel Gray",
        genre: "Mystery",
        synopsis: "When a stranger washes ashore in a small coastal town, a librarian uncovers a decades-old conspiracy buried in the archives.",
        cover_url: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=400",
        pdf_url: "https://www.penguin.co.uk/books/306421/dune",
        rating: 4.7,
        featured: true,
      },
      {
        title: "Letters from the Sunken World",
        author: "Arjun Patel",
        genre: "Adventure",
        synopsis: "A cartographer sets sail for a lost continent, following a trail of cryptic letters written by her missing father.",
        cover_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
        pdf_url: "https://www.penguin.co.uk/books/563/the-great-gatsby",
        rating: 4.3,
        featured: false,
      },
      {
        title: "The Painted Hourglass",
        author: "Nora Lindström",
        genre: "Drama",
        synopsis: "Two estranged sisters inherit a crumbling estate and a mysterious painting that holds the key to their fractured family history.",
        cover_url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
        pdf_url: "https://www.penguin.co.uk/books/109/1984",
        rating: 4.6,
        featured: false,
      },
      {
        title: "The Lantern Keeper",
        author: "Samuel Okafor",
        genre: "Literary Fiction",
        synopsis: "A retired lighthouse keeper begins receiving letters from a stranger who claims to remember a life he never lived.",
        cover_url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
        pdf_url: "https://www.penguin.co.uk/books/562/pride-and-prejudice",
        rating: 4.4,
        featured: false,
      },
    ];

    for (const book of books) {
      const id = await ctx.db.insert("books", book);
      bookIds.push(id);
    }

    // Seed banners
    await ctx.db.insert("banners", {
      title: "Welcome to Solibu Stories",
      author: "Solibu Team",
      label: "Welcome",
      description: "Discover thousands of captivating stories",
      character_name: "",
      story: "Start your reading journey today",
      image_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
      active: true,
    });

    await ctx.db.insert("banners", {
      title: "New Releases This Week",
      author: "Solibu Team",
      label: "New Arrivals",
      description: "Check out the latest additions to our library",
      character_name: "",
      story: "Fresh reads every week",
      image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
      active: true,
    });

    return `Seeded ${books.length} books and 2 banners`;
  },
});
