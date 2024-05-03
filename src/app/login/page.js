'use client'

import InputComponent from "@/components/FormElements/inputComponent"
import { loginFormControls } from "@/utils"
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GlobalContext } from "@/context";
import { login } from "@/services/login";
import ComponentLevelLoader from "@/components/Loader/componentlevel";

const initialFormdata = {
    email: "",
    password: "",
};


export default function Login() {

    const [formData, setFormData] = useState(initialFormdata);
    const router = useRouter();
    const { isAuthUser,
        setIsAuthUser,
        user,
        setUser, componentLevelLoader,
        setComponentLevelLoader, } = useContext(GlobalContext)

    console.log(formData);

    function isValidForm() {
        return formData &&
            formData.email &&
            formData.email.trim() !== "" &&
            formData.password &&
            formData.password.trim() !== ""
            ? true
            : false;
    }

    async function handleLogin() {
        setComponentLevelLoader({ loading: true, id: "" });

        const res = await login(formData);

        console.log(res);

        if (res.success) {
            setIsAuthUser(true);
            setUser(res?.finalData?.user);
            setFormData(initialFormdata);
            Cookies.set("token", res?.finalData?.token);
            localStorage.setItem("user", JSON.stringify(res?.finalData?.user));
            setComponentLevelLoader({ loading: false, id: "" });
        } else {
            setIsAuthUser(false)
            setComponentLevelLoader({ loading: false, id: "" });
        }
    }

    console.log(isAuthUser, user);

    useEffect(() => {
        if (isAuthUser) router.push("/");
    }, [isAuthUser]);

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
                {loginFormControls.map((controlItem) => (
                    controlItem.componentType === "input" && (
                        <InputComponent
                            key={controlItem.id}
                            type={controlItem.type}
                            placeholder={controlItem.placeholder}
                            label={controlItem.label}
                            value={formData[controlItem.id]}
                            onChange={(event) => setFormData({ ...formData, [controlItem.id]: event.target.value })}
                        />
                    )
                ))}
                <button
                    className="mt-4 w-full bg-blue-500 text-white font-semibold py-3 text-lg uppercase rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                    disabled={!isValidForm()}
                    onClick={handleLogin}
                >
                    {componentLevelLoader.loading ? (
                        <ComponentLevelLoader text="Logging In" color="#ffffff" loading={true} />
                    ) : "Login"}
                </button>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">New to the website?</p>
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => router.push("/register")}
                    >
                        Register here
                    </button>
                </div>
            </div>
        </div>
    );
}






