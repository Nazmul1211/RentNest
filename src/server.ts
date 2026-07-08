
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT

async function  main() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`App is running on port : ${PORT}`)
        })
    } catch (error) {
        console.log("Error at starting server:", error);
        prisma.$disconnect();
        process.exit(1);
    }
}

main();