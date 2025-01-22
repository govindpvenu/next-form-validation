"use server"

import { FormSchema } from "./schema/FormSchema"

export async function onSubmitAction(prevState: any, formData: FormData) {
  try {
    // Parse FormData into an object
    const formDataObj = Object.fromEntries(formData.entries())

    // Validate data using Zod schema
    const validatedFields = FormSchema.safeParse(formDataObj)

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.issues.map((issue) => issue.message),
      }
    }

    const data = validatedFields.data

    // Mutate data (example: saving to a database)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log("Submited data in server:", data)

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
