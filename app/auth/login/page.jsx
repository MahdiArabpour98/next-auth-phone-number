"use client";

import { CheckPhoneNumber } from "@/actions/check-phone-number";
import { OTP } from "@/actions/sms";
// import { useVerifyCode } from "@/hooks/verify-code";

import { ErrorMessage } from "@hookform/error-message";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImInstagram, ImLock, ImPhone, ImSpinner2, ImTelegram, ImWhatsapp } from "react-icons/im";

const LoginPage = () => {
  // const verifyCodeHook = useVerifyCode();

  const [isStepTwo, setIsStepTwo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [randomCode, setRandomCode] = useState(null);
  const [phoneNumberState, setPhoneNumberState] = useState(null);

  useEffect(() => {
    console.log("randomCodeState", randomCode);
  }, [randomCode]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { errors: errors2 },
  } = useForm();

  const checkPhone = async (data) => {
    console.log("checkPhone data", data);
    const { phoneNumber } = data;
    setIsLoading(true);

    const user = await CheckPhoneNumber(phoneNumber);
    console.log("user", user);
    if (!user) {
      setIsLoading(false);
      return toast.error(<p className="text-red-400">لطفا مجددا تلاش نمایید</p>, {
        style: {
          background: "rgba(255, 255, 255, 0.05)",
        },
      });
    }

    setRandomCode(String(Math.floor(10000 + Math.random() * 90000)));

    const otp = await OTP(phoneNumber, randomCode);
    console.log("otp", otp);
    if (otp.status !== 200) {
      setIsLoading(false);
      return toast.error(
        <p className="text-red-400">شماره تماس نامعتبر میباشد لطفا مجددا تلاش فرمایید</p>,
        {
          style: {
            background: "rgba(255, 255, 255, 0.05)",
          },
        }
      );
    }

    setIsStepTwo(true);
    setPhoneNumberState(phoneNumber);
    reset();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    console.log("sent");
  };

  const sendVerifyCode = (data) => {
    console.log("verifyCode data", data);
    setIsLoading(true);
    const { verifyCode } = data;
    const verification = verifyCode === randomCode;

    if (!verification) {
      setIsLoading(false);
      return toast.error(<p className="text-red-500">کد وارد شده صحیح نمیباشد</p>, {
        style: {
          background: "rgba(255, 255, 255, 0.05)",
        },
      });
    }

    signIn("credentials", {
      phoneNumber: phoneNumberState,
      callbackUrl: "/",
    });
    reset2();
  };

  return (
    <div className="overflow-hidden">
      <div className="w-screen h-screen bg-login-page bg-cover bg-center blur scale-105 flex justify-center items-center" />
      <div
        className="absolute w-5/6 md:w-3/4 h-[550px] bg-cover bg-center bg-login-page
       top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl"
      >
        <div
          className="w-0 md:w-7/12 hidden md:flex h-full bg-transparent absolute top-0 right-0 py-20 px-10 lg:px-20 text-white
         justify-between flex-col"
        >
          <Image src={"/logo/Logo-diar.png"} alt="logo" width={200} height={100} className="" />
          <div className="">
            <h2 className="text-3xl lg:text-4xl leading-none">
              خوش آمدید!
              <br />
              <span className="text-lg lg:text-2xl">به وب سایت دیار مرد میدان</span>
            </h2>
            <p className="text-base lg:text-base my-5 text-justify leading-7 lg:leading-8">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان
              گرافیک
            </p>
            <div className="flex gap-x-3">
              <Link href="#">
                <ImInstagram className="text-xl text-white mr-3 hover:scale-125 transition-all duration-300" />
              </Link>
              <Link href="#">
                <ImWhatsapp className="text-xl text-white mr-3 hover:scale-125 transition-all duration-300" />
              </Link>
              <Link href="#">
                <ImTelegram className="text-xl text-white mr-3 hover:scale-125 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full md:w-5/12 h-full absolute top-0 left-0 overflow-x-hidden">
          <div
            className={`flex flex-col justify-center items-center w-full h-full bg-transparent md:backdrop-blur-md rounded-l-md
          text-white absolute transition-all duration-300 ${
            isStepTwo ? "-translate-x-full" : "-translate-x-0 delay-300"
          }`}
          >
            <Image
              src={"/logo/Logo-diar.png"}
              alt="logo"
              width={200}
              height={100}
              className="-translate-y-10 block md:hidden"
            />
            <form onSubmit={handleSubmit(!isStepTwo && checkPhone)} className="w-5/6">
              <h2 className="text-3xl text-center">ارسال کد</h2>
              <div className="w-full h-[50px] my-7 mx-0 border-b border-white relative" dir="ltr">
                <span className="absolute right-0 top-3 text-lg">
                  <ImPhone />
                </span>
                <input
                  {...register("phoneNumber", {
                    required: "لطفا شماره تماس خود را وارد نمایید",
                    pattern: {
                      value: /^09\d{9}$/,
                      message: "شماره تماس نامعتبر میباشد",
                    },
                  })}
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  disabled={isLoading}
                  className="w-full h-full bg-transparent border-none outline-none peer text-base text-white font-medium pr-7"
                />
                <label
                  className="absolute left-0 text-base font-medium pointer-events-none transition-all duration-300
                  -translate-y-4 peer-placeholder-shown:translate-y-3 peer-focus:-translate-y-4"
                >
                  شماره تماس
                </label>
              </div>
              <ErrorMessage
                errors={errors}
                name="phoneNumber"
                render={({ message }) => (
                  <p className="text-sm text-white -mt-3  mb-3">{message}</p>
                )}
              />
              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-2 hover:outline-none hover:bg-white/10 hover:outline-1 transition-all
                duration-300 border-none outline outline-1 outline-white rounded-md backdrop-blur-sm text-lg
                font-medium mt-5 md:mt-2 flex gap-x-2 items-center justify-center disabled:bg-opacity-20
                disabled:outline-none disabled:bg-gray-200 disabled:text-white/80"
              >
                ارسال کد تایید
                {isLoading && <ImSpinner2 className="animate-spin" />}
              </button>
            </form>
          </div>

          <div
            className={`flex flex-col justify-center items-center w-full h-full bg-transparent md:backdrop-blur-md rounded-l-md text-white
            absolute transition-all duration-300 ${
              isStepTwo ? "-translate-x-0 delay-300" : "-translate-x-full"
            }`}
          >
            <Image
              src={"/logo/Logo-diar.png"}
              alt="logo"
              width={200}
              height={100}
              className="-translate-y-10 block md:hidden"
            />
            <form onSubmit={handleSubmit2(isStepTwo && sendVerifyCode)} className="w-5/6">
              <h2 className="text-3xl text-center">ورود به سایت</h2>
              <div className="w-full h-[50px] my-7 mx-0 border-b border-white relative" dir="ltr">
                <span className="absolute right-0 top-3 text-lg">
                  <ImLock />
                </span>
                <input
                  {...register2("verifyCode", {
                    required: "لطفا کد تایید 5 رقمی را وارد نمایید",
                    maxLength: { value: 5, message: "لطفا کد تایید 5 رقمی را وارد نمایید" },
                    minLength: { value: 5, message: "لطفا کد تایید 5 رقمی را وارد نمایید" },
                  })}
                  type="number"
                  placeholder=" "
                  autoComplete="off"
                  disabled={isLoading}
                  className="w-full h-full bg-transparent border-none outline-none peer text-base text-white font-medium pr-7"
                />
                <label
                  className="absolute left-0 text-base font-medium pointer-events-none transition-all duration-300
                  -translate-y-4 peer-placeholder-shown:translate-y-3 peer-focus:-translate-y-4"
                >
                  کد تایید
                </label>
              </div>
              <ErrorMessage
                errors={errors2}
                name="verifyCode"
                render={({ message }) => <p className="text-sm text-white -mt-3 mb-3">{message}</p>}
              />
              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-2 hover:outline-none hover:bg-white/10 hover:outline-1 transition-all
                duration-300 border-none outline outline-1 outline-white rounded-md backdrop-blur-sm text-lg
                font-medium mt-5 md:mt-2 flex gap-x-2 items-center justify-center disabled:bg-opacity-20
                disabled:outline-none disabled:bg-gray-200 disabled:text-white/80"
              >
                ورود
                {isLoading && <ImSpinner2 className="animate-spin" />}
              </button>
              <div
                className="mt-2 text-center cursor-pointer"
                onClick={() => {
                  setIsStepTwo(false);
                  reset2();
                }}
              >
                تغییر شماره تماس
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
