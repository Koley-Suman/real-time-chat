"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/store/user_reducer/userThank";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store"; // adjust path if needed
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import "./login.css";
// import signIn from "@/store/reducer.js"

export default function CardDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [seePass, setSeePass] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const loading = useSelector((state: any) => state.user.loading);

  const handleSubmit = async (e: any) => {
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
    <div className="h-dvh w-dvw flex items-center justify-center box-border noto-sans-chatFont background">
      <form
        onSubmit={handleSubmit}
        className="sm:h-[80%] w-full h-full box-border rounded-lg sm:max-h-[460px] md:w-[600px] p-4 form_background"
      >
        <div className="flex flex-col items-center justify-center gap-5 w-full h-full sm:p-12 p-4 box-border">
          <div className="section1 w-full flex flex-col justify-center items-center">
            <h1 className="text-3xl tracking-wide font-extrabold text-white m-0">
              Login To Your Account
            </h1>
            <p className="description">
              Enter your email below to login to your account
            </p>
            {error.length > 0 ? <p className="text-red-500">{error}</p> : " "}
          </div>
          <div className="section2 w-full flex flex-col items-center justify-center gap-3">
            <div className="p-1 px-2 input_background  bg-gray-700 flex justify-between items-center w-full">
              <MailIcon className="icon" />
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="w-full border-none bg-transparent input_color 
             focus:outline-none"
              />
            </div>

            <div className="p-1 px-2 input_background  bg-gray-700 flex justify-between items-center w-full">
              <LockIcon className="icon" />
              <Input
                id="password"
                type={`${seePass ? "text" : "password"}`}
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full border-none bg-transparent input_color 
             focus:outline-none"
              />
              {seePass ? (
                <EyeIcon className="icon" onClick={() => setSeePass(false)} />
              ) : (
                <EyeOffIcon className="icon" onClick={() => setSeePass(true)} />
              )}
            </div>
          </div>

          <div className="section3 flex flex-col gap-3 w-full sm:w-auto">
            <div
              className="p-1 rounded-lg hover:bg-violet-900 w-full h-[48px]"
              style={{ backgroundColor: "#7C3AED" }}
            >
              {loading ? (
                <Button
                  type="button"
                  className="w-full h-full bg-transparent hover:bg-transparent cursor-not-allowed"
                >
                  <Loader2Icon className="animate-spin" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-full cursor-pointer bg-transparent hover:bg-transparent"
                >
                  Continue
                  <ArrowRight/>
                </Button>
              )}
            </div>
            <div className="w-full h-6 flex items-center justify-center">
              <span className="flex text-sm" style={{ color: "#B3B3B3" }}>
                Don't have any account ?
                <Link
                  href="/signUp"
                  className="cursor-pointer"
                  style={{ color: "#7C3AED" }}
                >
                  Sign up
                </Link>{" "}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
