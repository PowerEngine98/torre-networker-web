
import { useState } from 'react'
import clsx from 'clsx'
import profile_placeholder from '../assets/images/profile_placeholder.png'

const UserResult = (props) => {

    const { user, onClick } = props

    const [loading, setLoading] = useState()

    return (
        <div
            className={clsx(
                'flex',
                'items-center',
                'space-x-2',
                'px-4 py-2',
                'bg-secondary',
                'hover:bg-light2',
                'border border-light2',
                'hover:border-light1',
                'shadow-xl',
            )}
            onClick={() => { onClick?.() }}
        >
            <img
                className='w-8 h-8 rounded-full'
                src={!user.photo || loading ? profile_placeholder : user.photo}
                alt=''
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(true)}
            />
            <label className='text-white truncate'>
                {user.name}
            </label>
        </div>
    )

}

export default UserResult