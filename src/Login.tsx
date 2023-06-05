import { Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import Button from "./Button";
import { useAppContext } from "./context";
import { ReactComponent as AskletIcon } from './icons/asklet2.svg';
import { apiLogIn } from "./utils/apiUtil";
import { login, minLenFieldValidator } from "./utils/utils";


type Values = {
  login: string;
  password: string;
};

function Login() {
  const { context, setContext } = useAppContext();
  const [, setLocation] = useLocation();

  const [ servererr, setServerErr ] = useState<string | null>(null);

  const submitLogin = (
    { login: username, password }: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>
  ) => {
    setServerErr(null);
    apiLogIn({ username, password }).then((token) => {
      login(
        {
          context: { ...context, accessToken: token },
          setContext,
        },
        () => setServerErr("User not found"),
        (err: Error) => setServerErr(err.message)
      ).then(() => setLocation("/"));
    }).catch(() => setServerErr("User not found"));
    setSubmitting(false);
  };

  useEffect(() => {
    document.title = `Log in`;
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
        <h1 className="text-3xl">Welcome byack!</h1>
        <Formik
          initialValues={{
            login: "",
            password: "",
          }}
          onSubmit={submitLogin}
          className="w-full flex flex-col p-3 justify-center items-center"
        >
          {({ errors, isSubmitting, handleSubmit }) => (
            <Form className="w-full flex flex-col p-3 justify-center items-center gap-2">
              <label htmlFor="login" className="text-xl">
                Login:
              </label>
              <Field
                validate={minLenFieldValidator(
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
                validate={minLenFieldValidator(
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
              <div className="flex mt-5 flex-row w-3/4 md:w-2/5 lg:w-1/8 justify-between items-center">
                <Link to="/register" className="text-primary-bg hover:underline">Create an account?</Link>
                <Button.Primary
                  disabled={isSubmitting || JSON.stringify(errors) !== "{}"}
                  onClick={(e) => handleSubmit()}
                >
                  Submit
                </Button.Primary>
              </div>
              {servererr && <div className="text-error-onBg">{servererr}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Login;
