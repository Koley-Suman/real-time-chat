"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/store/reducer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store"; // adjust path if needed
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
// import signIn from "@/store/reducer.js"

export default function CardDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const loading = useSelector((state: any) => state.userChat.loading);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!email && !password) {
      setError("Please enter the fields");
      return;
    }
    try {
      const result = await dispatch(signIn({ email, password }));
      if (signIn.rejected.match(result)) {
        setError("Invalid email or password");
        return;
      }
      setError("");
      setEmail("");
      setPassword("");
      router.push("/chat");
    } catch (error) {
      console.error("error occure");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 bg-gray-900">
      <Card className="w-full max-w-sm drop-shadow-lg bg-gray-800 border-none text-gray-200">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          {/* <CardDescription>
            Enter your email below to login to your account
          </CardDescription> */}
          <CardDescription>
            {error.length > 0 ? (
              <p className="text-red-500">{error}</p>
            ) : (
              "Enter your email below to login to your account"
            )}
          </CardDescription>
          <CardAction>
            <Link href="/signUp">
              <Button className="cursor-pointer text-gray-200" variant="link">
                Sign Up
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className="border-none bg-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="border-none bg-gray-700"
                />
              </div>
              <div className="grid gap-2">
                {loading ? (
                  <Button type="button" className="w-full bg-violet-900 cursor-not-allowed">
                    <Loader2Icon className="animate-spin" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-violet-800 hover:bg-violet-900 cursor-pointer"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        {/* <CardFooter className="flex-col gap-2"></CardFooter> */}
      </Card>
    </div>
  );
}
