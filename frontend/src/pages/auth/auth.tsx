import { useState } from "react";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

export default function AuthModule() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleSetSignIn = () => {
    setMode("signin");
  };

  const handleSetSignUp = () => {
    setMode("signup");
  };

  return (
    <>
      {mode == "signin" ? (
        <SignIn handleSetSignUp={handleSetSignUp} />
      ) : mode == "signup" ? (
        <SignUp handleSetSignIn={handleSetSignIn} />
      ) : null}
    </>
  );
}
