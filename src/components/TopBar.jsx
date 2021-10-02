import clsx from 'clsx'
import UserDetail from './UserDetail'
import logo from '../assets/images/logo.png'
//import { faConn } from '@fortawesome/free-solid-svg-icons'
import { FaConnectdevelop } from 'react-icons/fa'

const TopBar = (props) => {

    const {
        selected,
        loading,
        expandSelectedNode,
        focusSelectedNode
    } = props

    return (
        <div
            className={clsx(
                'flex',
                'relative',
                'w-full',
                'h-20',
                'items-center',
                'justify-between',
                'px-1 md:px-4 py-2',
                'bg-secondary',
                'border border-light2',
                'shadow-xl'
            )}
        >
            <div className='flex text-4xl items-center space-x-3'>
                <FaConnectdevelop className='text-primary' />
                <h1 className='text-light1'>
                    Networker
                </h1>
            </div>
            <a
                className={clsx(
                    'flex',
                    'w-14',
                    'aspect-h-1',
                    'flex-shrink-0',
                    'ml-2',
                    'rounded-full',
                    'ring-1 ring-transparent',
                    'ring-offset-1 ring-offset-transparent',
                    'hover:ring-primary',
                    'hover:opacity-70'
                )}
                href='https://torre.co'
                rel='noopener noreferrer'
                target='_blank'
            >
                <img
                    className='rounded-full object-cover'
                    src={logo}
                    alt='Torre logo'
                />
            </a>
            <div className='absolute flex left-0 top-full'>
                <UserDetail />
            </div>
        </div>
    )
}

export default TopBar
