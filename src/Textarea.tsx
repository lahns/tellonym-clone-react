import React from "react";

type TextareaProps = {
    disabled?: boolean;
    placeholder: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({disabled, placeholder}, ref) => {
    return disabled ? 
        <textarea 
            ref={ref} 
            disabled={disabled} 
            className="w-full p-1 cursor-not-allowed bg-gray-bg focus:outline-none focus:border-gray-bg border-gray-outline border-2 rounded-lg placeholder-gray-text" 
            rows={4} 
            placeholder={placeholder}/>
    :
        <textarea 
            ref={ref} 
            disabled={disabled} 
            className="w-full p-1 cursor-pointer bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text" 
            rows={4} 
            placeholder={placeholder}/>

});

export default Textarea;