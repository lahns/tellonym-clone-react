import { PropsWithChildren } from "react";


type SelectProps<U extends Record<string, string>> = {
    value: string,
    setValues: (val: keyof U) => void,
    options: U
};

type SelectSegmentProps<T extends string> = {
    currentValue: T,
    segmentValue: T,
    onclick: () => void,
    type: "start" | "middle" | "end" | "both",
}

const SelectSegment = <T extends string,>({segmentValue, currentValue, onclick, type, children}: SelectSegmentProps<T> & PropsWithChildren) => {

    const selectedColors = "text-white border-primary-bg bg-primary-bg hover:border-primary-onBg hover:bg-primary-onBg";
    const unselectedColors = "text-gray-onBg border-gray-outline hover:bg-gray-outline hover:border-gray-outline";

    const chosenColors = segmentValue === currentValue ? selectedColors : unselectedColors;

    switch (type) {
        case "start": {
            return <div 
                onClick={onclick}
                className={`p-2 text-center rounded-l-lg border-2 border-r-0 ${chosenColors}`}

            >
                {children}
            </div>
        }
        case "middle": {
            return <div 
                    onClick={onclick}
                    className={`p-2 text-center border-2 border-x-0 ${chosenColors}`}
                    >   
                        {children}
                    </div>
                }
        case "end": {
            return <div 
                onClick={onclick}
                className={`p-2 text-center rounded-r-lg border-2 border-l-0 ${chosenColors}`}
            >
                {children}
            </div>
        }
        case "both": {
            return <div 
                onClick={onclick}
                className={`p-2 text-center rounded-lg border-2 ${chosenColors}}`}
            >
                {children}
            </div>
        }
    }
}


const Select = <U extends Record<string, string>>({value, setValues, options}: SelectProps<U>) => {
    const keys = Object.keys(options);

    const [first, ...middle] = keys;
    const last = keys[middle.length];
    const mid = middle.slice(0, middle.length - 1);


    const body = () => {
        if (keys.length === 1) {
            return (
                <>
                    <SelectSegment 
                        currentValue={value} 
                        segmentValue={first} 
                        onclick={() => setValues(first)}
                        type="both"
                    >
                        {options[first]}
                    </SelectSegment>
                </>
            )
        } else {
            return (
                <>
                    <SelectSegment 
                        currentValue={value} 
                        segmentValue={first} 
                        onclick={() => setValues(first)}
                        type="start"
                    >
                        {options[first]}
                    </SelectSegment>
                    { mid.map(opt => 
                        <SelectSegment 
                            currentValue={value} 
                            segmentValue={opt}  
                            onclick={() => setValues(opt)}
                            type="middle"
                        >
                            {options[opt]}
                        </SelectSegment>

                    )}
                    <SelectSegment 
                        currentValue={value} 
                        segmentValue={last} 
                        onclick={() => setValues(last)}
                        type="end"
                    >
                        {options[last]}
                    </SelectSegment>
                </>
            )
        }
    }

    return <div className="flex cursor-pointer">
        {body()}
    </div>

}

export default Select;