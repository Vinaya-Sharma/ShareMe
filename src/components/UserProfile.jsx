import React, {useState, useEffect} from 'react'
import {AiOutlineLogout} from 'react-icons/ai'
import {useParams, useNavigate} from 'react-router-dom'
import {GoogleLogout} from 'react-google-login'

import {userCreatedPinsQuery, userQuery, userSavedPinsQuery} from '../utils/Data'
import {client} from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'


const UserProfile = (props) => {

  let randomImg = "https://source.unsplash.com/600x900/?nature,photography,technology"
  const activeBtnStyles = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none"
  const notActiveBtnStyles = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none"

  const [user, setUser] = useState(null)
  const [pins, setpins] = useState(null)
  const [text, settext] = useState('created')
  const [activeBtn, setactiveBtn] = useState('created')

  const navigate = useNavigate()
  const {userId} = useParams()

  const logout = () => {
    localStorage.clear()

    navigate('/login')
  }

  useEffect(() => {
    const query = userQuery(userId);

    client
    .fetch(query)
    .then((data) => setUser(data[0]))

  randomImg = "https://source.unsplash.com/600x900/?nature,photography,technology"

  }, [userId])

  useEffect(() => {

    if (text === "Created"){
      const createdQuery = userCreatedPinsQuery(userId)

      client.fetch(createdQuery)
      .then((data) => setpins(data))
    }else{
      const savedQuery = userSavedPinsQuery(userId)

      client.fetch(savedQuery)
      .then((data) => setpins(data))
    }

  }, [userId, text])
  

  if(!user){
    return  <Spinner message='Loading Profile'/>
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img src={randomImg} className='w-full h-370 2xl:h-510 shadow-lg object-cover' alt='banner-img' />
            <img src="" alt="" className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover" src={user.image} />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {
                userId ===  props?.user?._id && (
                  <GoogleLogout clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                    type='button'
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                    ><AiOutlineLogout color='red' fontSize={21}/></button>
                  )}

                  onLogoutSuccess={logout}
                  cookiePolicy='single_host_origin'
                  />
                )
              }
            </div>
          </div>
          <div className="text-center mb-7">
            <button onClick={(e) => {settext(e.target.textContent);
             setactiveBtn('created')}}
            type='button'
            className={`${activeBtn === 'created'? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
 
            <button onClick={(e) => {settext(e.target.textContent);
             setactiveBtn('saved')}}
            type='button'
            className={`${activeBtn === 'saved'? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>
              {
                pins?.length>0? <div className="px-2">
                <MasonryLayout pins={pins}/>
              </div> : (<div className="flex justify-center font-bold items-center w-full text-xl">
                No Pins Found
              </div>)
              }
             

        </div>
      </div>
    </div>
  )
}

export default UserProfile