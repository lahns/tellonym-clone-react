import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Link, useLocation } from 'wouter';
import Button from './Button';
import { useAppContext } from './context';
import { ReactComponent as AskletIcon } from "./icons/asklet2.svg";
import { apiLogIn } from './utils/apiUtil';
import { login } from './utils/utils';

const lenFieldValidator = (len: number, err: string): (value: any) => any => {
  return (value) => {
    if (value && typeof value === "string") {
      if (value.length < len) {
        return err;
      }
    }
    return;
  }
}

type Values = {
  login: string;
  password: string;
  servererr?: string;
}

function Login() {
    const { context, setContext } = useAppContext();
    const [ , setLocation ] = useLocation();

    const submitLogin = (
      { login: username, password }: Values,
      { setSubmitting, setErrors }: FormikHelpers<Values>
    ) => {
      apiLogIn({username, password})
        .then(token => {
          
            login({ 
                context: {...context, accessToken: token}, 
                setContext,
              }, 
              () => setErrors({ servererr: "User not found" }),
              (err: Error) => setErrors({ servererr: err.message })
            ).then(() => setLocation("/"));
          });
      setSubmitting(false);
    };

    return (<>
    <div className='w-full flex flex-col p-6 items-center justify-center'>
                    <Link to="/" className="w-fit flex flex-row items-center justify-center">
                                        <AskletIcon className="w-16 h-16 fill-primary-bg"/>
                                        <h1 className="md:block hidden text-gray-onBg text-4xl font-logo">Asklet</h1>
                    </Link>
      <h1 className='text-3xl'>Welcome byack!</h1>
      <Formik 
        initialValues={{
          login: '',
          password: '',
        }}
        onSubmit={submitLogin}
        className='w-full flex flex-col p-3 justify-center items-center'
      >
        {({errors, isSubmitting, handleSubmit}) =>
          <Form className='w-full flex flex-col p-3 justify-center items-center gap-2'>
                <label htmlFor="login" className='text-xl'>Login:</label>
                <Field 
                  validate={lenFieldValidator(3, "The username must be at least 8 characters long")}
                  id="login" 
                  name="login" 
                  placeholder="Your login"
                  className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${errors.login ? "border-error-light" : "border-gray-outline"}`} 
                />
                {errors.login && <div className='text-error-onBg'>{errors.login}</div>}
            
                <label htmlFor="password" className='text-xl'>Password:</label>
                <Field 
                  validate={lenFieldValidator(8, "The password must be at least 8 characters long")} 
                  id="password" 
                  name="password" 
                  placeholder="Your password" 
                  type="password"
                  className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${errors.password ? "border-error-light" : "border-gray-outline"} `} 
                />
                {errors.password && <div className='text-error-onBg'>{errors.password}</div>}
            <Button.Primary additionalStyle='mt-5' disabled={isSubmitting} onClick={handleSubmit}>Submit</Button.Primary>
                {errors.servererr && <div>{errors.servererr}</div>}
          </Form>
        }
      </Formik>
    </div>

    </>);
}

export default Login;