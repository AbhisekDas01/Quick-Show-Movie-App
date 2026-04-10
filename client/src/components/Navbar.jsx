import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import SearchDropdown from './SearchDropdown'

const Navbar = () => {

    const [isOpen , setIsOpen] = useState(false);

    const {user} = useUser();
    const {openSignIn} = useClerk();

    const navigate = useNavigate();

    const {favoriteMovies} = useAppContext();

    return (
        <div className='fixed top-0 left-0 z-50 w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-16 lg:px-36 py-4 md:py-5 gap-3 md:gap-0 bg-black/80 md:bg-transparent'>

            <Link to='/' className='md:flex-none flex-shrink-0'>
                <img src={assets.logo} className='w-28 md:w-36 h-auto' />
            </Link>

            <div className={`max-md:absolute max-md:top-16 max-md:left-0 max-md:font-medium max-md:text-lg z-40 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen? 'max-md:w-full' : 'max-md:w-0'}`}>

                <XIcon onClick={() => setIsOpen(!isOpen)} className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' />

                <Link onClick={() => {scrollTo(0 , 0) ; setIsOpen(false)}} to='/'>Home</Link>
                <Link onClick={() => {scrollTo(0 , 0) ; setIsOpen(false)}} to='/movies'>Movies</Link>
                <Link onClick={() => {scrollTo(0 , 0) ; setIsOpen(false)}} to='/'>Theaters</Link>
                <Link onClick={() => {scrollTo(0 , 0) ; setIsOpen(false)}} to='/releases'>Releases</Link>
                {favoriteMovies.length > 0 && <Link onClick={() => {scrollTo(0 , 0) ; setIsOpen(false)}} to='/favorite'>Favorites</Link>}


            </div>

            <div className="flex items-center gap-2 md:gap-4 lg:gap-8 flex-1 md:flex-none">
                <div className='flex-1 md:flex-none min-w-0'>
                    <SearchDropdown />
                </div>

                {
                    !user ? (
                        <button onClick={openSignIn} className='px-3 py-1 sm:px-7 sm:py-2 bg-Primary hover:bg-Primary-dull transition rounded-full font-medium cursor-pointer text-xs sm:text-sm md:text-base'>Login</button>
                    ) : (
                        <div className='flex-shrink-0'>
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action label='My bookings' labelIcon={<TicketPlus width={15} />} onClick={() => navigate('/my-bookings')} />
                                </UserButton.MenuItems>
                            </UserButton>
                        </div>
                    )
                }
                
            </div>

            <MenuIcon onClick={() => setIsOpen(!isOpen)} className='max-md:ml-2 md:hidden w-6 h-6 cursor-pointer flex-shrink-0' />

        </div>
    )
}

export default Navbar