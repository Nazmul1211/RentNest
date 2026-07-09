import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js"
import type { ICategoryPayload } from "./interface.categories.js"



const createCategoryInDB = async (payload: ICategoryPayload) => {

    const { name, description, slug} = payload;
    const category = await prisma.category.create({
          data: {
            name,
            description,
            slug,
        }
    })

    return category;
}

const getAllCategoriesFromDB = async () => {
    const categoris = await prisma.category.findMany();

    return categoris;
}

export const categoryService = {
    createCategoryInDB,
    getAllCategoriesFromDB,
}
