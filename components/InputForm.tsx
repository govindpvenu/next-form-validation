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
import { startTransition, useActionState, useEffect, useRef } from "react"
import { onSubmitAction } from "@/actions"
import { LoaderCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
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
  function onSubmitHandler() {
    startTransition(() => {
      formAction(new FormData(formRef.current!))
    })
  }
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(state, null, 2)}</code>
          </pre>
        ),
      })
    }
  }, [state])
  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmitHandler)}
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
          {isPending ? <LoaderCircle className="animate-spin" /> : "Submit"}
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
