import { Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import Button from "./Button";
import { useAppContext } from "./context";
import { ReactComponent as AskletIcon } from "./icons/asklet2.svg";
import { apiRegisterUser } from "./utils/apiUtil";
import { login } from "./utils/utils";

const lenFieldValidator = (len: number, err: string): ((value: any) => any) => {
  return (value) => {
    if (value && typeof value === "string") {
      if (value.length < len) {
        return err;
      }
    }
    return;
  };
};

type Values = {
  login: string;
  password: string;
  repeated_password: string;
  servererr?: string;
};

function Register() {
  const { context, setContext } = useAppContext();
  const [, setLocation] = useLocation();

  const submitRegister = (
    { login: username, password, repeated_password }: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    if (password === repeated_password) {
      apiRegisterUser({ username, password }).then((token) => {
        login(
          {
            context: { ...context, accessToken: token },
            setContext,
          },
          () =>
            setErrors({
              servererr:
                "Your account was created, but we failed to fetch your data. Go to login page to log in.",
            }),
          (err: Error) => setErrors({ servererr: err.message })
        ).then(() => setLocation("/"));
      });
      setSubmitting(false);
    } else {
      setErrors({ servererr: "Passwords don't match" });
    }
  };

  
  useEffect(() => {
    document.title = `Register`;
  });


  return (
    <>
      <div className="w-full flex flex-col p-6 items-center justify-center">
        <Link
          to="/"
          className="w-fit flex flex-row items-center justify-center"
        >
          <AskletIcon className="w-16 h-16 fill-primary-bg" />
          <h1 className="md:block hidden text-gray-onBg text-4xl font-logo">
            Asklet
          </h1>
        </Link>
        <h1 className="text-3xl">You finally arrived!</h1>
        <Formik
          initialValues={{
            login: "",
            password: "",
            repeated_password: "",
          }}
          onSubmit={submitRegister}
          className="w-full flex flex-col p-3 justify-center items-center"
        >
          {({ errors, isSubmitting, handleSubmit }) => (
            <Form className="w-full flex flex-col p-3 justify-center items-center gap-2">
              <label htmlFor="login" className="text-xl">
                Login:
              </label>
              <Field
                validate={lenFieldValidator(
                  3,
                  "The username must be at least 8 characters long"
                )}
                id="login"
                name="login"
                placeholder="Your login"
                className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                  errors.login ? "border-error-light" : "border-gray-outline"
                }`}
              />
              {errors.login && (
                <div className="text-error-onBg">{errors.login}</div>
              )}

              <label htmlFor="password" className="text-xl">
                Password:
              </label>
              <Field
                validate={lenFieldValidator(
                  8,
                  "The password must be at least 8 characters long"
                )}
                id="password"
                name="password"
                placeholder="Your password"
                type="password"
                className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                  errors.password ? "border-error-light" : "border-gray-outline"
                } `}
              />
              {errors.password && (
                <div className="text-error-onBg">{errors.password}</div>
              )}
              <label htmlFor="repeated_password" className="text-xl">
                Confirm password:
              </label>
              <Field
                validate={lenFieldValidator(
                  8,
                  "The password must be at least 8 characters long"
                )}
                id="repeated_password"
                name="repeated_password"
                placeholder="Your password"
                type="password"
                className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                  errors.repeated_password
                    ? "border-error-light"
                    : "border-gray-outline"
                } `}
              />
              {errors.repeated_password && (
                <div className="text-error-onBg">
                  {errors.repeated_password}
                </div>
              )}
              <div className="flex mt-5 flex-row w-3/4 md:w-2/5 lg:w-1/8 justify-between items-center">
                <Link to="/login" className="text-primary-bg hover:underline">Log in?</Link>
                <Button.Primary
                  disabled={isSubmitting}
                  onClick={(e) => handleSubmit()}
                >
                  Submit
                </Button.Primary>
              </div>
              {errors.servererr && (
                <div className="text-error-onBg">{errors.servererr}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Register;
