import { prisma } from "./lib/prisma";


async function main() {
  //Example to count the rows in the Users table.
  const val = await prisma.user.count()
  console.log("User row count: ", val);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  process.exit(1);
});
