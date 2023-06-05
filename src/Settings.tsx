import { Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Button from "./Button";
import { useAppContext } from "./context";
import { apiEditProfile, apiMe } from "./utils/apiUtil";

    
type Values = {
    bg: any,
    pfp: any,
    username: string,
    bio: string,
    twitch: string,
    twitter: string,
    youtube: string,
    instagram: string,
    password: string,
    old_password: string,
}

const Settings = () => {
    const { context, setContext } = useAppContext();
    const [location, setLocation] = useLocation();
    
    const user = context.currentUser?.user;
    const [ initialVals, setInitialVals ] = useState<Values>(
        user ? {
            bg: "",
            pfp: "",
            username: user.username,
            bio: user.bio,
            twitch: user.twitch,
            twitter: user.twitter,
            youtube: user.youtube,
            instagram: user.instagram,
            password: "",
            old_password: "",
        } : { /* unreachable cuz of useEffect */} as Values
    );
    
    useEffect(() => {
        document.title = "Profile settings";
        if (!context.currentUser) {
            setLocation("/login")
        }
        
    })

    const submit = (
        vals: Values,
        { setSubmitting, setErrors }: FormikHelpers<Values>, 
    ) => {
        let formData = new FormData();

        formData.append("bg", vals.bg ?? "")
        formData.append("profile_pic", vals.pfp ?? "")
        formData.append("username", vals.username ?? "")
        formData.append("bio", vals.bio ?? "")
        formData.append("twitch", vals.twitch ?? "")
        formData.append("twitter", vals.twitter ?? "")
        formData.append("youtube", vals.youtube ?? "")
        formData.append("instagram", vals.instagram ?? "")
        formData.append("password", vals.password ?? "")
        formData.append("current_password", vals.old_password ?? "")

        apiEditProfile(formData, { context, setContext })
        apiMe({ context, setContext })
            .then((user) => setContext({ ...context, currentUser: user})
        )
    }

    return(
        <Formik
            initialValues={initialVals}
            onSubmit={submit}
            className="w-full p-3"
        >
            {({errors, isSubmitting, handleSubmit}) => (
                <Form className="w-3/5 flex flex-col p-3 justify-center items-center gap-2">
                    <div className="flex flex-row w-full">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                    </div>
                    <div className="flex flex-row justify-between w-full gap-10">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Username:
                        </label>
                        <Field
                            id="username"
                            name="username"
                            placeholder="New username"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.username ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    <div className="flex flex-row justify-between w-full gap-10">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Bio:
                        </label>
                        <Field
                            id="bio"
                            name="bio"
                            placeholder="New bio"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.bio ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    <div className="flex flex-row w-full">
                        <h2 className="text-2xl font-semibold">Socials</h2>
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Twitch:
                        </label>
                        <Field
                            id="twitch"
                            name="twitch"
                            placeholder="Twitch handle"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.twitch ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Twitter:
                        </label>
                        <Field
                            id="twitter"
                            name="twitter"
                            placeholder="Twitter handle"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.twitter ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Youtube:
                        </label>
                        <Field
                            id="youtube"
                            name="youtube"
                            placeholder="Youtube handle"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.youtube ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Instagram:
                        </label>
                        <Field
                            id="instagram"
                            name="instagram"
                            placeholder="Instagram handle"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.instagram ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    <div className="flex flex-row w-full">
                        <h1 className="text-2xl font-semibold">Password</h1>
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Password:
                        </label>
                        <Field
                            id="password"
                            name="password"
                            placeholder="New password"
                            type="password"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.password ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Old password:
                        </label>
                        <Field
                            id="old_password"
                            name="old_password"
                            placeholder="Old password"
                            type="password"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.old_password ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    <div className="w-full flex flex-row justify-end py-2">
                        <Button.Primary
                            disabled={isSubmitting}
                            onClick={(e) => handleSubmit()}
                        >
                            Submit
                        </Button.Primary>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default Settings;