"use server"

import { z } from "zod"
import { FormSchema } from "./schema/FormSchema"

export async function onSubmitAction(prevState: any, formData: FormData) {
  try {
    // Parse FormData into an object
    const formDataObj = Object.fromEntries(formData.entries())
    // Validate data using Zod schema
    const validatedFields = FormSchema.safeParse(formDataObj)

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const data = validatedFields.data

    // Mutate data (example: saving to a database)
    // await database.users.create(data);
    console.log(data)

    return {
      success: true,
      message: "User created successfully!",
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
