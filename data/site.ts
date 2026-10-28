import { retailPriceKes } from "./catalog";

const iphonePrice = (rmb: number) => retailPriceKes(rmb, "phone");

export const siteContent = {
  meta: {
    title: "Teekay Sourcing & Shipping | China to Kenya Freight",
    description:
      "Teekay Sourcing & Shipping helps individuals and businesses source products from China and deliver safely to Kenya by air or sea."
  },
  brand: {
    name: "Teekay Sourcing & Shipping",
    shortName: "Teekay",
    phone: "+254719241166",
    paymentName: "Tony Kimani",
    logo: "/teekay-logo.png"
  },
  nav: ["Products", "How It Works", "Services", "Reviews", "Pricing", "Cost Analyzer", "Warehouses", "FAQ"],
  topBar: {
    location: "China warehouses serving Kenya importers",
    help: "Need help? Chat online",
    email: "Teekay Sourcing & Shipping"
  },
  hero: {
    eyebrow: "China to Kenya sourcing and freight",
    headline: "Ship Goods from China to Kenya - Fast, Affordable & Reliable",
    subheadline:
      "We help individuals and businesses source products from China and deliver safely to Kenya by air or sea.",
    primaryCta: "Get Free Consultation",
    secondaryCta: "Chat online"
  },
  stats: [
    { label: "By Air", value: "7-10 days" },
    { label: "By Ship", value: "35-40 days" },
    { label: "Air Freight", value: "13 USD per kg" },
    { label: "Sea Freight", value: "70k KES per CBM" },
    { label: "Sourcing Fee", value: "5k KES" }
  ],
  highlights: [
    "Supplier checks",
    "Air & sea shipping",
    "Cargo consolidation"
  ],
  howItWorks: [
    {
      title: "Send product link",
      description: "Share the product link, photo, or supplier details through the website order form or online chat."
    },
    {
      title: "We source and verify",
      description: "Our team checks the supplier, confirms product details, and shares a clear quote."
    },
    {
      title: "We ship by air or sea",
      description: "Choose the freight option that matches your timeline, cargo size, and budget."
    },
    {
      title: "Receive goods in Kenya",
      description:
        "Track updates and receive a notification when your item reaches the Nairobi pick-up station."
    }
  ],
  services: [
    {
      title: "Air Freight",
      description: "Fast China-to-Kenya delivery for urgent goods, samples, and smaller packages.",
      icon: "AF"
    },
    {
      title: "Sea Freight",
      description: "Cost-effective shipping for bulky stock, business imports, and full cargo loads.",
      icon: "SF"
    },
    {
      title: "Product Sourcing",
      description: "Find suppliers, compare product options, and verify quality before payment.",
      icon: "PS"
    },
    {
      title: "Cargo Consolidation",
      description: "Combine items from multiple suppliers into one organized shipment to Kenya.",
      icon: "CC"
    }
  ],
  products: {
    eyebrow: "Trusted supplier categories",
    headline: "Products we can source with suppliers we already know",
    description:
      "Start with categories where Teekay has existing supplier relationships, then request current models, colors, sizes, and wholesale options.",
    categories: [
      {
        title: "iPhones",
        tag: "Phones and accessories",
        description:
          "Supplier support for iPhone models, checks on condition, storage, variants, and package details before shipping.",
        accent: "teal",
        initials: "IP",
        items: ["New and used options", "Model and storage checks", "Accessory bundling"]
      },
      {
        title: "Watches",
        tag: "Smart and fashion watches",
        description:
          "Source wearable stock for personal orders, retail displays, gifting, or small business inventory.",
        accent: "gold",
        initials: "WT",
        items: ["Smartwatch options", "Style comparisons", "Packaging checks"]
      },
      {
        title: "T-Shirts",
        tag: "Plain and custom apparel",
        description:
          "Work with apparel suppliers for plain tees, branded batches, size runs, and sample checks.",
        accent: "ember",
        initials: "TS",
        items: ["Size and color runs", "Custom print support", "Sample coordination"]
      },
      {
        title: "Caps",
        tag: "Casual and branded caps",
        description:
          "Source caps for teams, shops, events, and brands with options for embroidery or printed designs.",
        accent: "navy",
        initials: "CP",
        items: ["Bulk order options", "Logo placement checks", "Color matching"]
      }
    ],
    process: [
      "Tell us the product category and quantity.",
      "We confirm supplier availability and product details.",
      "You receive a clear quote before purchase and shipping.",
      "We ship to Kenya and notify you for pick-up."
    ],
    iphoneProducts: [
      {
        name: "Apple iPhone XR",
        brand: "Apple",
        image: "/10%20X%20series/IPHONE%20XR%20.jpg",
        colorOptions: ["White", "Black", "Blue", "Yellow", "Coral"],
        storageOptions: [
          { storage: "64", price: iphonePrice(800) },
          { storage: "128", price: iphonePrice(850) }
        ]
      },
      {
        name: "Apple iPhone 11",
        brand: "Apple",
        image: "/11series/iphone%2011.jpg",
        colorOptions: ["Black", "Green", "Yellow", "Purple", "White"],
        storageOptions: [
          { storage: "64", price: iphonePrice(1100) },
          { storage: "128", price: iphonePrice(1150) }
        ]
      },
      {
        name: "Apple iPhone XS Max",
        brand: "Apple",
        image: "/10%20X%20series/iphone%20xs%20max.jpg",
        colorOptions: ["Gold", "Silver", "Space Gray"],
        storageOptions: [
          { storage: "256", price: iphonePrice(1100) }
        ]
      },
      {
        name: "Apple iPhone 11 Pro",
        brand: "Apple",
        image: "/11series/iphone%2011PRO.jpg",
        colorOptions: ["Midnight Green", "Space Gray", "Silver", "Gold"],
        storageOptions: [
          { storage: "64", price: iphonePrice(1300) },
          { storage: "256", price: iphonePrice(1350) }
        ]
      },
      {
        name: "Apple iPhone 11 Pro Max",
        brand: "Apple",
        image: "/11series/iphone%2011PROMAX.jpg",
        colorOptions: ["Midnight Green", "Space Gray", "Silver", "Gold"],
        storageOptions: [
          { storage: "64", price: iphonePrice(1350) },
          { storage: "256", price: iphonePrice(1490) }
        ]
      },
      {
        name: "Apple iPhone 12",
        brand: "Apple",
        image: "/12%20series/iphone12.jpg",
        colorOptions: ["Black", "White", "Blue", "Green", "Purple"],
        storageOptions: [
          { storage: "64", price: iphonePrice(1200) },
          { storage: "128", price: iphonePrice(1250) }
        ]
      },
      {
        name: "Apple iPhone 12 Pro",
        brand: "Apple",
        image: "/12%20series/iphone%2012PRO.jpg",
        colorOptions: ["Graphite", "Silver", "Gold", "Pacific Blue"],
        storageOptions: [
          { storage: "128", price: iphonePrice(1600) },
          { storage: "256", price: iphonePrice(1650) }
        ]
      },
      {
        name: "Apple iPhone 12 Pro Max",
        brand: "Apple",
        image: "/12%20series/iphone%2012PROMAX.jpg",
        colorOptions: ["Graphite", "Silver", "Gold", "Pacific Blue"],
        storageOptions: [
          { storage: "128", price: iphonePrice(1850) },
          { storage: "256", price: iphonePrice(2000) }
        ]
      },
      {
        name: "Apple iPhone 13",
        brand: "Apple",
        image: "/13%20series/IPHONE13.jpg",
        colorOptions: ["Pink", "Blue", "Midnight", "Starlight", "Green"],
        storageOptions: [
          { storage: "128", price: iphonePrice(1700) },
          { storage: "256", price: iphonePrice(1800) }
        ]
      },
      {
        name: "Apple iPhone 13 Pro",
        brand: "Apple",
        image: "/13%20series/%23ios15%20%23apple%20%23iphone13pro%20%23iphone13lineup%20%23ios%E2%80%A6.jpg",
        colorOptions: ["Graphite", "Silver", "Gold", "Sierra Blue", "Alpine Green"],
        storageOptions: [
          { storage: "128", price: iphonePrice(2150) },
          { storage: "256", price: iphonePrice(2350) },
          { storage: "512", price: iphonePrice(2450) }
        ]
      },
      {
        name: "Apple iPhone 13 Pro Max",
        brand: "Apple",
        image: "/13%20series/iphone%2013promax.jpg",
        colorOptions: ["Graphite", "Silver", "Gold", "Sierra Blue", "Alpine Green"],
        storageOptions: [
          { storage: "128", price: iphonePrice(2500) },
          { storage: "256", price: iphonePrice(2700) },
          { storage: "512", price: iphonePrice(2800) }
        ]
      },
      {
        name: "Apple iPhone 14",
        brand: "Apple",
        image: "/14series/iphone14.jpg",
        colorOptions: ["Midnight", "Purple", "Starlight", "Blue"],
        storageOptions: [
          { storage: "128", price: iphonePrice(1900) },
          { storage: "256", price: iphonePrice(2100) }
        ]
      },
      {
        name: "Apple iPhone 14 Plus",
        brand: "Apple",
        image: "/14series/iphone14plus.jpg",
        colorOptions: ["Midnight", "Purple", "Starlight", "Blue"],
        storageOptions: [
          { storage: "128", price: iphonePrice(1950) },
          { storage: "256", price: iphonePrice(2150) }
        ]
      },
      {
        name: "Apple iPhone 14 Pro",
        brand: "Apple",
        image: "/14series/iphone14pro.jpg",
        colorOptions: ["Space Black", "Silver", "Gold", "Deep Purple"],
        storageOptions: [
          { storage: "128", price: iphonePrice(2700) },
          { storage: "256", price: iphonePrice(2900) },
          { storage: "512", price: iphonePrice(3000) },
          { storage: "1T", price: iphonePrice(3100) }
        ]
      },
      {
        name: "Apple iPhone 14 Pro Max",
        brand: "Apple",
        image: "/14series/iphone14promax.jpg",
        colorOptions: ["Space Black", "Silver", "Gold", "Deep Purple"],
        storageOptions: [
          { storage: "128", price: iphonePrice(3000) },
          { storage: "256", price: iphonePrice(3200) },
          { storage: "512", price: iphonePrice(3300) },
          { storage: "1T", price: iphonePrice(3400) }
        ]
      },
      {
        name: "Apple iPhone 15",
        brand: "Apple",
        image: "/15%20series/iphone15.jpg",
        colorOptions: ["Black", "Blue", "Green", "Yellow", "Pink"],
        storageOptions: [
          { storage: "128", price: iphonePrice(2500) },
          { storage: "256", price: iphonePrice(2700) }
        ]
      },
      {
        name: "Apple iPhone 15 Plus",
        brand: "Apple",
        image: "/15%20series/iphone15plus.jpg",
        colorOptions: ["Black", "Blue", "Green", "Yellow", "Pink"],
        storageOptions: [
          { storage: "128", price: iphonePrice(2550) },
          { storage: "256", price: iphonePrice(2750) }
        ]
      },
      {
        name: "Apple iPhone 15 Pro",
        brand: "Apple",
        image: "/15%20series/iphone15pro.jpg",
        colorOptions: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
        storageOptions: [
          { storage: "128", price: iphonePrice(3100) },
          { storage: "256", price: iphonePrice(3300) }
        ]
      },
      {
        name: "Apple iPhone 15 Pro Max",
        brand: "Apple",
        image: "/15%20series/iphone%2015%20promax.jpg",
        colorOptions: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
        storageOptions: [
          { storage: "256", price: iphonePrice(3100) },
          { storage: "512", price: iphonePrice(3900) },
          { storage: "1T", price: iphonePrice(4000) }
        ]
      },
      {
        name: "Apple iPhone 16",
        brand: "Apple",
        image: "/16%20series/iphone16.jpg",
        colorOptions: ["Ultramarine", "Teal", "Pink", "White", "Black"],
        storageOptions: [
          { storage: "128", price: iphonePrice(3300) },
          { storage: "256", price: iphonePrice(3600) }
        ]
      },
      {
        name: "Apple iPhone 16 Plus",
        brand: "Apple",
        image: "/16%20series/iphone16plus.jpg",
        colorOptions: ["Ultramarine", "Teal", "Pink", "White", "Black"],
        storageOptions: [
          { storage: "128", price: iphonePrice(3400) },
          { storage: "256", price: iphonePrice(3700) }
        ]
      },
      {
        name: "Apple iPhone 16e",
        brand: "Apple",
        image: "/16%20series/iphone16e.jpg",
        colorOptions: ["Black", "White"],
        storageOptions: [
          { storage: "128", price: iphonePrice(3700) },
          { storage: "256", price: iphonePrice(4000) }
        ]
      },
      {
        name: "Apple iPhone 16 Pro",
        brand: "Apple",
        image: "/16%20series/iphone16pro.jpg",
        colorOptions: ["Black Titanium", "Natural Titanium", "White Titanium", "Desert Titanium"],
        storageOptions: [
          { storage: "128", price: iphonePrice(3750) },
          { storage: "256", price: iphonePrice(4050) }
        ]
      },
      {
        name: "Apple iPhone 16 Pro Max",
        brand: "Apple",
        image: "/16%20series/iphone%2016%20promax.jpg",
        colorOptions: ["Black Titanium", "Natural Titanium", "White Titanium", "Desert Titanium"],
        storageOptions: [
          { storage: "256", price: iphonePrice(4550) },
          { storage: "512", price: iphonePrice(4900) }
        ]
      },
      {
        name: "Apple iPhone 17",
        brand: "Apple",
        image: "/17%20series/iphone17.jpg",
        colorOptions: ["Black", "White", "Sage Green", "Mist Blue", "Purple", "Pink"],
        storageOptions: [
          { storage: "256", price: iphonePrice(4000) }
        ]
      },
      {
        name: "Apple iPhone 17 Air",
        brand: "Apple",
        image: "/17%20series/iphone%2017%20air.jpg",
        colorOptions: ["Sky Blue", "Light Gold", "Cloud White", "Space Black"],
        storageOptions: [
          { storage: "256", price: iphonePrice(4800) }
        ]
      },
      {
        name: "Apple iPhone 17 Pro",
        brand: "Apple",
        image: "/17%20series/iphone%2017PRO.jpg",
        colorOptions: ["Cosmic Orange", "Deep Blue", "Silver", "Black Titanium"],
        storageOptions: [
          { storage: "256", price: iphonePrice(5400) },
          { storage: "512", price: iphonePrice(5900) }
        ]
      },
      {
        name: "Apple iPhone 17 Pro Max",
        brand: "Apple",
        image: "/17%20series/iphone17%20promax.jpg",
        colorOptions: ["Cosmic Orange", "Deep Blue", "Silver", "Black Titanium"],
        storageOptions: [
          { storage: "256", price: iphonePrice(6400) },
          { storage: "512", price: iphonePrice(6900) },
          { storage: "1T", price: iphonePrice(7900) }
        ]
      }
    ]
  },
  reasons: [
    "Reliable China sourcing partner",
    "Affordable rates",
    "Fast communication",
    "Online support",
    "Secure cargo handling",
    "Shipment updates"
  ],
  pricing: [
    {
      title: "Air Freight",
      price: "13 USD",
      unit: "per kg",
      description: "Best for urgent parcels, samples, electronics, and lightweight cargo.",
      highlight: true
    },
    {
      title: "Sea Freight",
      price: "70k KES",
      unit: "per CBM",
      description: "Ideal for furniture, wholesale stock, machines, and larger shipments."
    },
    {
      title: "Sourcing Fee",
      price: "5k KES",
      unit: "per order",
      description: "Supplier search, product verification, quote support, and order coordination. Deductible from your first order purchase."
    }
  ],
  warehouses: [
    {
      title: "Guangzhou Air/Sea Warehouse",
      contact: "Air: Lisa 15913003394 | Sea: Wei Mr. (Owen) 18565545390",
      address: "广东省佛山市南海区里水镇草场，海南州工业区32号F区124仓-126仓"
    }
  ],
  kenyaPickup: {
    title: "Nairobi Pick-Up Point",
    contact: "Karis: +254 706 282762 | Anita: +254 708 422 243",
    address:
      "Imperial Chambers Building, Moi Avenue (Behind Nation Center, Ngoma Lane), Nairobi. Shop A8."
  },
  faqs: [
    {
      question: "How long does shipping from China to Kenya take?",
      answer:
        "Air freight typically takes about 7-10 days, while sea freight typically takes about 35-40 days depending on cargo readiness, route schedules, and customs processing."
    },
    {
      question: "Can you help me source products from China?",
      answer:
        "Yes. Send us a product link, photo, or description and we can help find suppliers, verify details, and coordinate the order."
    },
    {
      question: "Can you consolidate goods from different suppliers?",
      answer:
        "Yes. We can receive goods from multiple suppliers in China, consolidate them, and ship them together by air or sea."
    },
    {
      question: "How do payments work?",
      answer:
        "We provide a clear quote before purchase or shipping. Payment details are shared directly with you after confirming product, freight method, and service needs."
    },
    {
      question: "How will I know when my item arrives?",
      answer:
        "We will notify you when your item reaches the Nairobi pick-up station so you know when it is ready for collection."
    },
    {
      question: "Are there restricted goods?",
      answer:
        "Yes. Some items may be restricted or require special handling, including hazardous materials, liquids, batteries, counterfeit goods, and regulated products. Contact us before purchasing if unsure."
    }
  ],
  finalCta: {
    headline: "Ready to Import from China?",
    description:
      "Talk to Teekay Sourcing & Shipping today for a clear quote, sourcing guidance, and reliable delivery to Kenya.",
    button: "Start sourcing order"
  },
  chat: {
    title: "Customer Service Online",
    status: "Available for sourcing, rates, and shipment updates",
    openLabel: "Chat with us"
  }
};
