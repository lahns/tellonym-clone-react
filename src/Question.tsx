import React from 'react';

export function Question(props: any) {
    return (
        <>
            <div className='QuestionContainer bg-slate-900 text-xl w-1/3 text-left p-5'>
                <div className='Question'>
                    {props.question}
                </div>
                <div className='Answer border-l-2'>
                    <p className='pl-2'>{props.answer}</p>
                </div>
            </div>
        </>
    )
}