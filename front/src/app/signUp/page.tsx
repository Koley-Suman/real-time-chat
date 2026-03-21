"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/store/user_reducer/userThank";
import { AppDispatch } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  EyeIcon,
  EyeOffIcon,
  Fullscreen,
  Loader2Icon,
  LockIcon,
  MailIcon,
  User,
} from "lucide-react";
import "./signup.css";
import { Checkbox } from "@/components/ui/checkbox";

export default function CardDemo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seePass1, setSeePass1] = useState(false);
  const [seePass2, setSeePass2] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const loading = useSelector((state: any) => state.user.loading);
  const fullName = `${firstName} ${lastName}`;

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await dispatch(
        signUp({ name: fullName, email, password }),
      );
      if (signUp.fulfilled.match(result)) {
        alert("Registration successful!");
        router.replace("bio");
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
    <div className="h-dvh w-dvw flex justify-center items-center background noto-sans-chatFont">
      <form
        className="w-full h-full sm:h-[90%] sm:max-h-[750px] sm:w-[600px] rounded-lg form_background"
        onSubmit={handleRegister}
      >
        <div className="flex flex-col items-center justify-center w-[100%] h-[100%] gap-[25px]  p-8 box-border">
          <div className="section1">
            <h1 className="text-3xl tracking-wide font-extrabold text-white">
              Register Your Account
            </h1>
            <p className="description text-sm">
              Enter your email below to register to your account
            </p>
          </div>
          <div className="section2 flex flex-col items-center w-full gap-[16px]">
            <div className="name w-full sm:flex-row gap-4 flex flex-col justify-between">

            <div className="p-1 px-2 input_background rounded-sm  bg-gray-700 flex justify-between items-center w-full">
              <User className="icon" />
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                required
                className="w-full border-none bg-transparent input_color 
             focus:outline-none "
              />
            </div>
            <div className="p-1 px-2 input_background  bg-gray-700 flex justify-between items-center w-full">
              <User className="icon" />
              <Input
                id="latsName"
                type="text"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
                className="w-full border-none bg-transparent input_color 
             focus:outline-none "
              />
            </div>
            </div>
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
             focus:outline-none "
              />
            </div>
            <div className="p-1 px-2 input_background  bg-gray-700 flex justify-between items-center w-full">
              <LockIcon className="icon" />
              <Input
                id="password"
                type={`${seePass1 ? "text" : "password"}`}
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full border-none bg-transparent input_color 
             focus:outline-none "
              />
              {seePass1 ? (
                <EyeIcon className="icon" onClick={() => setSeePass1(false)} />
              ) : (
                <EyeOffIcon
                  className="icon"
                  onClick={() => setSeePass1(true)}
                />
              )}
            </div>
            <div className="p-1 px-2 input_background  bg-gray-700 flex justify-between items-center w-full">
              <LockIcon className="icon" />
              <Input
                id="confirm-password"
                type={`${seePass2 ? "text" : "password"}`}
                placeholder="Confirm Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="w-full border-none bg-transparent input_color 
             focus:outline-none "
              />
              {seePass2 ? (
                <EyeIcon className="icon" onClick={() => setSeePass2(false)} />
              ) : (
                <EyeOffIcon
                  className="icon"
                  onClick={() => setSeePass2(true)}
                />
              )}
            </div>
          </div>
          <div className="section3  flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Checkbox id="terms" />
              <span className="description text-sm">
                By register you agree to Accept all{" "}
                <a href="#" style={{ color: "#7C3AED" }}>
                  term & policy
                </a>{" "}
              </span>
            </div>
            <div
              className="p-1 rounded-lg hover:bg-violet-900 w-full h-[48px] "
              style={{ backgroundColor: "#7C3AED" }}
            >
              {loading ? (
                <Button
                disabled
                  type="button"
                  className=" w-full h-full bg-transparent hover:bg-transparent cursor-not-allowed"
                >
                  <Loader2Icon className="animate-spin" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className=" w-full h-full cursor-pointer bg-transparent hover:bg-transparent"
                >
                  Sign Up
                </Button>
              )}
            </div>
            <div className="w-full flex items-center justify-center">
              <span className="flex text-sm" style={{ color: "#B3B3B3" }}>
                Already have an account ?
                <Link
                  href="/login"
                  className="cursor-pointer"
                  style={{ color: "#7C3AED" }}
                >
                  Sign in
                </Link>{" "}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
