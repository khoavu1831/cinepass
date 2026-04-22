import { useState } from "react"
import Signin from "./Signin";
import Signup from "./Signup";
import ForgetPassword from "./ForgetPassword";

function AuthModal({ showAuthModal, setShowAuthModal }) {
  const [form, setForm] = useState("signin");

  const renderForm = () => {
    switch (form) {
      case "signin": return <Signin onSwitchSignup={() => setForm("signup")} onSwitchForgetPassword={() => setForm("forget")} onSuccess={() => setShowAuthModal(false)} />
      case "signup": return <Signup onSwitchSignin={() => setForm("signin")} />
      case "forget": return <ForgetPassword onSwitchSignin={() => setForm("signin")} />
    }
  }

  return (
    <div className="fixed inset-0 bg-[#1b1d29]/80 z-9999">
      <div className="flex justify-center max-h-screen py-4 mx-2">
        <div className="flex md:min-h-100 w-200 text-white bg-[#2b3561]/80 rounded-2xl my-8 overflow-hidden">
          {/* img section */}
          <div className="max-md:hidden lg:h-140 md:h-140 md:w-200 opacity-40">
            <img
              className="w-full h-full object-cover relative"
              src="bg.webp"
              alt="signin img"
            />
          </div>

          {/* form section */}
          <div className="flex flex-col p-2 w-full">
            <button
              className="cursor-pointer flex justify-end"
              onClick={() => setShowAuthModal(!showAuthModal)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal