import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input, Button } from "@nextui-org/react";

function login() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Login Page</h1>
          <form className="flex flex-col gap-4 mt-4">
            <Input label="Email" type="email" placeholder="Enter your email" required />
            <Input label="Password" type="password" placeholder="Enter your password" required />
            <Button type="submit" color="primary">Login</Button>

          </form>
        </div>
      </section>
    </DefaultLayout>
  )
}

export default login;
