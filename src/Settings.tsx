import { Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Button from "./Button";
import { useAppContext } from "./context";
import { apiEditProfile, apiMe } from "./utils/apiUtil";
import { maxLenFieldValidator, minLenFieldValidator } from "./utils/utils";

    
type Values = {
    bg: File,
    profile_pic: File,
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
    

    const [ servererr, setServerErr ] = useState<string | null>(null);

    const user = context.currentUser?.user;
    const [ initialVals, setInitialVals ] = useState<Values>(
        user ? {
            bg: new File([], ""),
            profile_pic: new File([], ""),
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
        setServerErr(null);
        let formData = new FormData();

        formData.append("bg", vals.bg ?? new File([], ""))
        formData.append("profile_pic", vals.profile_pic ?? new File([], ""))
        formData.append("username", vals.username ?? "")
        formData.append("bio", vals.bio ?? "")
        formData.append("twitch", vals.twitch ?? "")
        formData.append("twitter", vals.twitter ?? "")
        formData.append("youtube", vals.youtube ?? "")
        formData.append("instagram", vals.instagram ?? "")
        formData.append("password", vals.password ?? "")
        formData.append("current_password", vals.old_password ?? "")

        apiEditProfile(formData, { context, setContext })
            .then(res => Math.floor(res.status / 100) !== 2 ? setServerErr("Username taken / Incorrect password") : null)

        apiMe({ context, setContext })
            .then((user) => {
                setContext({ ...context, currentUser: user})
                setSubmitting(false);
            })
    }

    return(
        <Formik
            encType="multipart/form-data"
            initialValues={initialVals}
            onSubmit={submit}
            className="w-full p-3"
        >
            {({errors, isSubmitting, handleSubmit, setFieldValue}) => (
                <Form className="w-4/5 flex flex-col p-3 justify-center items-center gap-2">
                    <div className="flex flex-row w-full">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                    </div>
                    
                    <div className="flex flex-row justify-between w-full gap-10">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Avatar:
                        </label>
                        <input id="profile_pic" name="profile_pic" type="file" onChange={(event) => {
                            if (event.currentTarget?.files?.[0]) {
                                setFieldValue("profile_pic", event.currentTarget.files[0]);
                            }
                        }} />
                    </div>
                    <div className="flex flex-row justify-between w-full gap-10">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Background:
                        </label>
                        <input id="bg" name="bg" type="file" onChange={(event) => {
                            if (event.currentTarget?.files) {
                                setFieldValue("bg", event.currentTarget.files[0]);
                            }
                        }} />
                    </div>
                    <div className="flex flex-row justify-between w-full gap-10">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Username:
                        </label>
                        <Field
                            validate={minLenFieldValidator(
                                3,
                                "The username must be at least 8 characters long"
                            )}
                            id="username"
                            name="username"
                            placeholder="New username"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.username ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    {errors.username && (
                        <div className="text-error-onBg">{errors.username}</div>
                    )}
                    <div className="flex flex-row justify-between w-full gap-10">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Bio:
                        </label>
                        <Field
                            validate={maxLenFieldValidator(
                                100,
                                "The bio must be at most 100 characters long"
                            )}
                            id="bio"
                            name="bio"
                            placeholder="New bio"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.bio ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    {errors.bio && (
                        <div className="text-error-onBg">{errors.bio}</div>
                    )}
                    <div className="flex flex-row w-full">
                        <h2 className="text-2xl font-semibold">Socials</h2>
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Twitch:
                        </label>
                        <Field
                            validate={maxLenFieldValidator(
                                20,
                                "The handle must be at most 20 characters long"
                            )}
                            id="twitch"
                            name="twitch"
                            placeholder="Twitch handle"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.twitch ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    {errors.twitch && (
                        <div className="text-error-onBg">{errors.twitch}</div>
                    )}
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Twitter:
                        </label>
                        <Field
                            validate={maxLenFieldValidator(
                                20,
                                "The handle must be at most 20 characters long"
                            )}
                            id="twitter"
                            name="twitter"
                            placeholder="Twitter handle"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.twitter ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    {errors.twitter && (
                        <div className="text-error-onBg">{errors.twitter}</div>
                    )}
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Youtube:
                        </label>
                        <Field
                            validate={maxLenFieldValidator(
                                20,
                                "The handle must be at most 20 characters long"
                            )}
                            id="youtube"
                            name="youtube"
                            placeholder="Youtube handle"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.youtube ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    {errors.youtube && (
                        <div className="text-error-onBg">{errors.youtube}</div>
                    )}
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Instagram:
                        </label>
                        <Field
                            validate={maxLenFieldValidator(
                                20,
                                "The handle must be at most 20 characters long"
                            )}
                            id="instagram"
                            name="instagram"
                            placeholder="Instagram handle"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.instagram ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    {errors.instagram && (
                        <div className="text-error-onBg">{errors.instagram}</div>
                    )}
                    <div className="flex flex-row w-full">
                        <h1 className="text-2xl font-semibold">Password</h1>
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Password:
                        </label>
                        <Field
                            validate={minLenFieldValidator(
                                8,
                                "The new password must be at least 8 characters long"
                            )}
                            id="password"
                            name="password"
                            placeholder="New password"
                            type="password"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.password ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    {errors.password && (
                        <div className="text-error-onBg">{errors.password}</div>
                    )}
                    <div className="flex flex-row justify-between w-full">
                        <label htmlFor="Username" className="font-thin text-xl text-text-secondary">
                            Old password:
                        </label>
                        <Field
                            validate={minLenFieldValidator(
                                8,
                                "The password must be at least 8 characters long"
                            )}
                            id="old_password"
                            name="old_password"
                            placeholder="Old password"
                            type="password"
                            className={`w-3/4 p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text md:w-2/5 lg:w-1/8 ${
                                errors.old_password ? "border-error-light" : "border-gray-outline"
                            }`}
                        />
                    </div>
                    {errors.old_password && (
                        <div className="text-error-onBg">{errors.old_password}</div>
                    )}
                    <div className="w-full flex flex-row justify-end py-2">
                        <Button.Primary
                            disabled={isSubmitting || JSON.stringify(errors) !== "{}"}
                            onClick={(e) => handleSubmit()}
                            >
                            Save
                        </Button.Primary>
                    </div>
                    {servererr && (
                        <div className="text-error-onBg">{servererr}</div>
                    )}
                </Form>
            )}
        </Formik>
    )
}

export default Settings;