import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {RiHomeFill} from 'react-icons/ri'
import {IoIosArrowForward} from 'react-icons/io'
import {categories} from '../utils/Data'

import logo from '../assets/logo.png'

const Sidebar = ({user, closeToggle}) => {

  const notSelected = "flex flex-row gap-3 items-center px-5 text-gray-500 hover:text-black transition all duration-200 ease-in-out capitiliza"
  const selected = "flex flex-row gap-3 items-center px-5 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize"

  const Categories = categories

  const handleclosesidebar = () => {
    if (closeToggle) closeToggle(false);
  }

  return (
    <div className='flex flex-col justify-between background-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
  <div className='flex flex-col'>
    <Link to='/' className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'>
      <img src={logo} alt='logo' className='w-full' onClick={() => handleclosesidebar()}/>
    </Link>

    <div className="flex flex-col gap-5">
     <NavLink to='/' className={({isActive}) => (isActive? selected: notSelected)} onClick={() => handleclosesidebar()}>
      <RiHomeFill/>
      Home
     </NavLink>
     <h3 className='flex px-5 mt-2'>Discover Categories</h3>

     {
       Categories.slice(0, Categories.length-1).map(
         (category) => (
           <NavLink key={category.name} to={`/category/${category.name}`} className={({isActive}) => (isActive? selected: notSelected)} onClick={() => handleclosesidebar()}>
               <img className='w-8 h-8 shadow-sm rounded-full' alt='category' src={category.image}/>
            {category.name}
           </NavLink>
         )
       )
     }
    </div>
  </div>
     {
       user && (
         <Link onClick={() => handleclosesidebar()} to={`user-profile/${user._id}`} className='my-5 gap-2 mx-3 p-2 items-center flex rounded-lg bg-white shadow-lg'>
           <img src={user.image} className='w-12 h-12 rounded-full'/>
           <p>{user.userName}</p>
         </Link>
       )
     }

    </div>
  )
}

export default Sidebar