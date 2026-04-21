import { SignIn } from '@clerk/react';
import { SignUpButton } from '@clerk/react';
import DisclaimerPopup from "@/components/disclaimerPopup.tsx";



function LoginSignup(){
    return (
        <>
            <DisclaimerPopup />
            <div className = "flex h-screen w-full overflow-hidden">
                <div className="img-container w-1/2 h-screen">
                    <img className = "h-full w-full object-cover object-center" src = "/hanover-login-img.jpg"/>
                </div>
                <div className="w-1/2 h-screen text-left flex flex-col justify-center items-center bg-[url('/geometric-background.png')] bg-cover bg-no-repeat text-white p-2">
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <h1 className = "text-left">Welcome to iBank</h1>
                        <SignIn/>
                        <div className="flex flex-row gap-1">
                            <p>New to iBank?</p>
                            <SignUpButton>
                                <button className = "cursor-pointer text-[#F4A258]">Sign up</button>
                            </SignUpButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
        )
}

export default LoginSignup;