"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import InputComponent from "@/components/FormElements/inputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import { GlobalContext } from "@/context";
import { registerNewUser } from "@/services/register";
import { registrationFormControls } from "@/utils";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { isLoading, setLoading, isAuthenticated } = useContext(GlobalContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const validateForm = () => (
    formData.name.trim() && formData.email.trim() && formData.password.trim()
  );

  const onSubmitRegistration = async () => {
    setLoading(true);
    const result = await registerNewUser(formData);
    setRegistrationComplete(result.success);
    setFormData(initialFormData);
    setLoading(false);
    console.log(result);
  };

  return (
    <div className="relative bg-gray-800">
      <div className="container mx-auto px-10 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
          <div className="w-full max-w-2xl bg-gray-200 text-gray-800 shadow-xl rounded-xl p-10">
            <h1 className="text-4xl font-serif font-medium text-center">
              {registrationComplete ? "You're All Set!" : "Create Your New Account"}
            </h1>
            {registrationComplete ? (
              <button
                className="mt-6 w-full bg-blue-600 text-white font-medium uppercase tracking-wide text-lg px-6 py-4"
                onClick={() => router.push('/login')}
              >
                Proceed to Login
              </button>
            ) : (
              <form className="mt-6 space-y-8">
                {registrationFormControls.map((control) => (
                  control.componentType === "input" ? (
                    <InputComponent
                      key={control.id}
                      type={control.type}
                      placeholder={control.placeholder}
                      label={control.label}
                      value={formData[control.id]}
                      onChange={(e) => setFormData({ ...formData, [control.id]: e.target.value })}
                    />
                  ) : control.componentType === "select" ? (
                    <SelectComponent
                      key={control.id}
                      options={control.options}
                      label={control.label}
                      value={formData[control.id]}
                      onChange={(e) => setFormData({ ...formData, [control.id]: e.target.value })}
                    />
                  ) : null
                ))}
                <button
                  type="button"
                  disabled={!validateForm()}
                  onClick={onSubmitRegistration}
                  className="w-full bg-blue-600 text-white font-medium uppercase tracking-wide text-lg px-6 py-4 disabled:opacity-50"
                >
                  {isLoading ? (
                    <ComponentLevelLoader text="Processing..." color="#ffffff" loading={true} />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








