
import connectToDB, { connectToDBWithIP } from "@/database";
// import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import Joi from "joi";
import { NextResponse } from "next/server";

const ProductSchemaValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  sizes: Joi.array().required(),
  imageUrl: Joi.string().required(),
});

export const mode = "force-dynamic";

export async function POST(req) {
  try {
    // const ip = res.headers['x-client-ip'];
    await connectToDBWithIP(req.ip || req.headers.get('X-Forwarded-For'));

    const currentUser = 'admin';
    /*
    const isAuthenticated = await AuthUser(req)*/

    if (currentUser === "admin") {
      const formData = await req.json();

      const {
        name,
        description,
        price,
        imageUrl,
        category,
        sizes,
      } = formData;

      const { error } = ProductSchemaValidation.validate({
        name,
        description,
        price,
        imageUrl,
        category,
        sizes,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const product = await Product.create(formData);

      if (product) {
        return NextResponse.json({
          success: true,
          message: "Product successfully added",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Adding the product failed, please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Unauthorized access",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "An error occurred, please try again later",
    });
  }
}
