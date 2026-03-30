import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing products (optional)
  await prisma.product.deleteMany()
  
  // Add new products with images
  const products = [
    {
      name: "Islamic Prayer Mat",
      price: 29.99,
      image: "/n1.jpeg",  // Local image in public folder
      description: "Beautiful high-quality prayer mat with intricate Islamic patterns. Made from soft, durable material for comfortable prayers."
    },
    {
      name: "Quran with Translation",
      price: 49.99,
      image: "/n2.jpeg",
      description: "Holy Quran with English translation and commentary. Easy to read Arabic text with clear English translation."
    },
    {
      name: "Islamic Wall Art",
      price: 34.99,
      image: "/n3.jpeg",
      description: "Beautiful Islamic calligraphy wall art. Perfect for home decoration. Available in multiple sizes."
    },
    {
      name: "Misbaha Prayer Beads",
      price: 19.99,
      image: "/n4.jpeg",
      description: "Handcrafted wooden prayer beads with 99 beads. Perfect for dhikr and meditation."
    },
    {
      name: "Islamic Books Set",
      price: 79.99,
      image: "/n5.jpeg",
      description: "Collection of 5 essential Islamic books covering various topics including Seerah, Fiqh, and spirituality."
    },
    {
      name: "Oud Perfume Oil",
      price: 44.99,
      image: "/n6.jpeg",
      description: "Premium Arabian Oud perfume oil. Long-lasting fragrance with authentic Middle Eastern scent."
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
    console.log(`✅ Added: ${product.name}`)
  }
  
  console.log('\n🎉 All products added successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })