"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormSchema } from "@/schema/FormSchema"
import { z } from "zod"
import { startTransition, useActionState, useRef } from "react"
import { onSubmitAction } from "@/actions"
const initialState = {
  success: false,
  message: "",
}
export function InputForm() {
  const [state, formAction, isPending] = useActionState(
    onSubmitAction,
    initialState
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    //!Comment below line to disable client-side validation for testing server-side validation
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const formRef = useRef<HTMLFormElement>(null)
  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault()
          form.handleSubmit(() => {
            startTransition(() => {
              formAction(new FormData(formRef.current!))
            })
          })(evt)
        }}
        className="max-w-md  space-y-3"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} />
              </FormControl>
              <FormDescription>Enter your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Show pending state while submiting */}
        <Button disabled={isPending} type="submit">
          {isPending ? "Submiting.." : "Submit"}
        </Button>

        {/* Show error messages from server */}
        <p
          className={`${!state?.success ? "text-red-500" : "text-green-500"}`}
          aria-live="polite"
        >
          {state?.message}
        </p>
        <div aria-live="polite" className="text-red-500">
          {state?.errors && (
            <ul>
              {state.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </Form>
  )
}
