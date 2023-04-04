import React from "react";
import * as ReactDOM from 'react-dom';
import { Formik, Field, Form, FormikHelpers } from 'formik';

function Login() {

    interface Values {
        login: string;
        password: string;
      }

    return (<>
    <div>
      <h1>Log into your account</h1>
      <Formik
        initialValues={{
          login: '',
          password: '',
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
        
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }}
      >
        <Form>
          <label htmlFor="login">Login:</label>
          <Field id="login" name="login" placeholder="Your login" />

          <label htmlFor="password">Password:</label>
          <Field id="password" name="password" placeholder="Your password" type="password"/>

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>

    </>);
}

export default Login;