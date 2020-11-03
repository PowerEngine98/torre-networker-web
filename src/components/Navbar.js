import Toolbar from "./Toolbar"

function Navbar({ onInputChange, onSelectChange }) {
    return (
        <div className='fixed w-full z-30 bg-primary flex flex-row justify-between items-center'>
            <Toolbar onInputChange={onInputChange} onSelectChange={onSelectChange} />
            <img className='p-1' src='https://res.cloudinary.com/torre-technologies-co/image/upload/v1601512321/origin/bio/organizations/Torre_logo_small_uubm3e.png' />
        </div>
    )
}

export default Navbar