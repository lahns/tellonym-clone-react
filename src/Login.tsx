import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useContext } from 'react';
import { AppContext } from './context';
import { apiLogIn, apiMe } from './utils/apiUtil';

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
    const { context, setContext } = useContext(AppContext);

    return (<>
    <div>
      <h1>Log into your account</h1>
      <Formik 
        initialValues={{
          login: '',
          password: '',
        }}
        onSubmit={(
          { login: username, password }: Values,
          { setSubmitting, setErrors }: FormikHelpers<Values>
        ) => {        
          apiLogIn({username, password})
            .then(token => {
                apiMe(token)
                .then(user => {
                    if (!user) return;
                    setContext({...context, accessToken: token, currentUser: user })
                  });
              }).catch(err => {
                if (err instanceof Error) {
                  setErrors({ servererr: err.message });
                }
              });
            
            setSubmitting(false);
        }}
      >
        {({errors, isSubmitting}) =>
          <Form>
            <label htmlFor="login">Login:</label>
            <Field 
              validate={lenFieldValidator(3, "The username must be at least 8 characters long")}
              id="login" 
              name="login" 
              placeholder="Your login" 
            />
            {errors.login && <div>{errors.login}</div>}

            <label htmlFor="password">Password:</label>
            <Field 
              validate={lenFieldValidator(8, "The password must be at least 8 characters long")} 
              id="password" 
              name="password" 
              placeholder="Your password" 
              type="password"
            />
            {errors.password && <div>{errors.password}</div>}
            <button type="submit" disabled={isSubmitting}>Submit</button>
            {errors.servererr && <div>{errors.servererr}</div>}

          </Form>
        }
      </Formik>
    </div>

    </>);
}

export default Login;