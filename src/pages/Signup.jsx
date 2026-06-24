import { Signup as SignupComponent, Logo } from "../components/index";
import signupImg from "../assets/Sign up-bro.svg";

function Signup() {
  return (
    <div className="flex gap-2 pt-2 font-[Outfit]">
      <div className="md:flex hidden justify-center items-center w-full">
        <img
          src={signupImg}
          alt="Signup Illustration"
          className="w-full max-w-lg object-contain"
        />
      </div>
      <div className="page active auth-page w-full">
        <div className="fixed inset-0 bg-mesh pointer-events-none z-0"></div>
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%,rgba(124,90,247,.08) 0%,transparent 70%)",
          }}
        ></div>
        <div className="relative z-10 w-full max-w-md">
          {/* logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2.5">
              <Logo width="100%" />
            </div>
          </div>
          <SignupComponent />
        </div>
      </div>
    </div>
  );
}

export default Signup;
