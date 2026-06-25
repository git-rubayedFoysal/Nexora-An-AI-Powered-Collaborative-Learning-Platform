import { Login as LoginComponent, Logo } from "../components/index";
import loginImg from "../assets/Secure-login-bro.svg";

function Login() {
  return (
    <div className="flex pt-10 gap-2 font-[Outfit]">
      <div className="md:flex hidden justify-center items-center w-full auth-page pr-0">
        <img
          src={loginImg}
          alt="Login Illustration"
          className="w-full max-w-lg object-contain"
        />
      </div>
      <div className="page active auth-page w-full flex">
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
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}

export default Login;
