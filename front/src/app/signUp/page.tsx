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
import { signUp } from "@/store/reducer";
import { AppDispatch } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhotoUpload from "./userPhoto";
import { Loader2Icon } from "lucide-react";

export default function CardDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const loading = useSelector((state: any) => state.userChat.loading);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await dispatch(signUp({ name, email, password, pic }));
      if (signUp.fulfilled.match(result)) {
        alert("Registration successful!");
        router.push("chat");
      }
      if (signUp.rejected.match(result)) {
        alert("somthing went wrong");
        return;
      }
      console.log(result);
    } catch (error: any) {
      console.error("error", error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center md:p-4 bg-gray-700">
      <Card className="w-full h-full box-border md:w-[50%] md:h-[450px] md:drop-shadow-lg md:drop-shadow-3xl md:rounded-2xl bg-gray-800 rounded-none border-none text-gray-100 overflow-auto">
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
          <CardDescription>
            Enter your email below to register to your account
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button className="cursor-pointer text-gray-100" variant="link">
                Sign In
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="md:flex md:w-full  md:h-[80%]">
          <div className="md:h-full md:w-1/2 md:flex md:items-center md:justify-center">
            <PhotoUpload setPic={setPic} />
          </div>
          <form
            className="md:w-1/2 md:h-full flex items-center justify-center"
            onSubmit={handleRegister}
          >
            <div className="flex flex-col gap-2 w-full ">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  className="border-none bg-gray-700"
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="border-none bg-gray-700"
                />
              </div>
              <div className="grid gap-4 mt-4">
                {loading ? (
                  <Button
                    type="button"
                    className=" w-full bg-violet-900 hover:bg-violet-900 cursor-not-allowed"
                  >
                    <Loader2Icon className="animate-spin" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className=" w-full bg-violet-800 hover:bg-violet-900 cursor-pointer"
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        {/* <CardFooter className="flex-col gap-2 items-end">
          
       
        </CardFooter> */}
      </Card>
    </div>
  );
}
