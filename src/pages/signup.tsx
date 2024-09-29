import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input, Button } from "@nextui-org/react";

function SignUpPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Sign Up Page</h1>
          <form className="flex flex-col gap-4 mt-4">
            <Input 
              label="Email" 
              type="email" 
              placeholder="Enter your email" 
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="Enter your password" 
              required 
            />
            <Input 
              label="Address" 
              type="text" 
              placeholder="Enter your address" 
              required 
            />
            <Input 
              label="Phone Number" 
              type="tel" 
              placeholder="Enter your phone number" 
              required 
            />
            <Button type="submit" color="primary">
              Sign Up
            </Button>
          </form>
        </div>
      </section>
    </DefaultLayout>
  )
}

export default SignUpPage;