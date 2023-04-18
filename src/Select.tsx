

type SelectProps<T extends keyof U, U extends Record<string, string>> = {
    value: T,
    setValues: (val: T) => void,
    options: U
};

const Select = <T extends keyof U, U extends Record<string, string>>({value, setValues, options}: SelectProps<T, U>) => {
    const keys = Object.keys(options);

    const [first, ...middle] = keys;
    const last = keys[-1]

    return (<>
        {(() => {
            if (keys.length === 1) {
                return (
                    <>
                        <div>
                            options[first]
                        </div>
                    </>
                )
            } else {
                return (
                    <>
                        <div>
                            options[first]
                        </div>
                        { middle.map(opt => 
                            <div>{options[opt]}</div>

                        )}
                        <div>
                            options[last]
                        </div>
                    </>
                )
            }
        })}
    </>)
}

export default Select;