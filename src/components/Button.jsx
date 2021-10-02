import clsx from 'clsx'

const Button = (props) => {
    return (
        <button
            className={clsx(
                'flex',
                'w-full',
                'text-center justify-center items-center',
                'p-1',
                'space-x-1',
                'bg-light-2',
                'hover:bg-primary',
                'rounded-l-full rounded-r-full',
                'border border-primary',
                'hover:border-black',
                'focus:border-primary',
                'text-primary text-center',
                'hover:text-black',
                'focus:outline-none'
            )}
            {...props}
        />
    )
}

export default Button