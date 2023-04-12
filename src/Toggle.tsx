import React, { PropsWithChildren } from "react";

type ToggleProps = {
    defaultChecked?: boolean;
    disabled?: boolean;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps & PropsWithChildren>(({defaultChecked, disabled, children}, ref) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input defaultChecked={defaultChecked} disabled={disabled} ref={ref} type="checkbox" value="" className="sr-only peer"/>
            <div className="w-11 h-6 bg-gray-bg peer-focus:outline-none border-2 border-gray-outline peer-checked:border-primary-bg focus:border-primary-bg peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-bg"></div>
            <span className="ml-3 text-sm text-text-secondary">{children}</span>
        </label>
    )
})

export default Toggle;