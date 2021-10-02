import clsx from 'clsx'
import { useState } from 'react'
import Search from './Search'
import HexagonImage from './HexagonImage'
import {
    MdCardTravel,
    MdChevronRight,
    MdExpandMore,
    MdMyLocation,
    MdZoomOutMap
} from 'react-icons/md'
import profile_placeholder from '../assets/images/profile_placeholder.png'

const OrganizationList = (props) => {

    const { organizations } = props

    return (
        <div className='text-xs font-hairline'>
            {
                organizations.map((organization, index) =>
                    <span
                        key={index}
                    >
                        {
                            index > 0 &&
                            <span className='text-primary'>
                                &bull;
                            </span>
                        }
                        {organization}
                    </span>
                )
            }
        </div>

    )
}

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

const defaultUser = {
    id: 23,
    username: "manolo",
    name: "Manuel Montes",
    weight: 1801.8953,
    headline: "Co-founder and Senior Tech Lead at Torre",
    photo: "https://res.cloudinary.com/torre-technologies-co/image/upload/v0/origin/starrgate/users/profile_cb7a1d775e800fd1ee4049f7dca9e041eb9ba083.jpg",
    organizations: []
}

const UserDetail = (props) => {

    const {
        user = defaultUser,
        loading,
        organizations = [],
        expandSelectedNode,
        focusSelectedNode
    } = props

    const [open, setOpen] = useState(true)

    return (
        <div className='flex w-72 flex-col shadow-xl rounded-b-xl border border-light2'>
            <Search />
            <div
                className={clsx(
                    'flex',
                    'flex-row',
                    'justify-between',
                    'px-4 py-2',
                    'bg-secondary',
                    'hover:bg-light2',
                    'border border-light2',
                    'hover:border-light1',
                    'shadow-xl',
                    'focus:outline-none'
                )}
                onClick={() => setOpen(!open)}
            >
                <h3 className='text-white'>
                    {user.name}
                </h3>
                <span className='flex items-center text-xl text-light1' >
                    {
                        open ? <MdExpandMore /> : <MdChevronRight />
                    }
                </span>
            </div>
            {
                open &&
                <div className={clsx(
                    'flex',
                    'flex-col',
                    'items-center',
                    'bg-secondary',
                    'p-4',
                    'space-y-2',
                    'text-white',
                    'overflow-x-hidden',
                    'overflow-y-auto',
                    'hide-scroll'
                )}
                >
                    <HexagonImage
                        src={user.photo}
                        fallBack={profile_placeholder}
                        onClick={focusSelectedNode}
                    />
                    <p className='text-center'>
                        {user.headline}
                    </p>
                    <a
                        className={clsx(
                            'text-primary',
                            'hover:underline',
                            'focus:underline',
                            'hover:opacity-70',
                            'focus:opacity-70'
                        )}
                        href={`https://bio.torre.co/${user.username}`}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {`@${user.username}`}
                    </a>
                    <div className='flex items-center text-center space-x-1 text-light1'>
                        <MdCardTravel />
                        <span>{`${user.name.split(' ')[0]}'s organizations`}</span>
                    </div>
                    <OrganizationList organizations={user.organizations} />
                </div>
            }
            <div className='flex w-full p-4 space-x-3'>
                <Button
                    disabled={loading}
                    onClick={() => expandSelectedNode()}
                >
                    <MdZoomOutMap />
                    <span>EXPAND</span>
                </Button>
                <Button
                    onClick={() => focusSelectedNode()}
                >
                    <MdMyLocation />
                    <span>FOCUS</span>
                </Button>
            </div>
        </div>
    )
}

export default UserDetail
