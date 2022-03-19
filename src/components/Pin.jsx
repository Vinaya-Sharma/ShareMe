import React, {useState} from 'react'

import {Link, Navigate, useNavigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsArrowUpRightCircleFill} from 'react-icons/bs'

import { urlFor, client } from '../client'
import { fetchUser } from '../utils/FetchUser'

const Pin = ({pin}) => {

  const  {image, postedBy, _id, destination, userId} =pin;

  const [postHovered, setPostHovered] = useState(false)
  const userInfo = fetchUser()

  console.log(pin)


  const navigate = useNavigate()

  const doStudd = () => {
    setTimeout(function(){
      setPostHovered(false)
  },2000); 
  }

  let alreadySaved = !!(pin?.save?.filter((item) => item.postedBy._id == (userInfo?.googleId)).length);

  const savePin = (id) => {
    if (!alreadySaved) {


      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: userInfo?.googleId,
          postedBy: {
            _type: 'postedBy',
            _ref: userInfo?.googleId,
          },
        }])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePost = (id) => {
    client
    .delete(id)
    .then(() => window.location.reload())
  }

  return (
    <div className='m-2'>

      <div 
      onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => doStudd()}
        onClick = {() => navigate(`/pin-detail/${_id}`)}
        className=' cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out '
        >
                <img src={urlFor(image).width(250).url()} className='relative rounded-lg w-full' alt='user-post'/> 
      </div>

      {
        postHovered && (
          <div className="absolute top-1 w-full  h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50" style={{height:'100%'}}>
            <div className="flex flex-col justify-between">
              <div className="flex gap-5">
              <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                ><MdDownloadForOffline />
                </a>
                {
                  alreadySaved? <button type='button' className='p-2 rounded-lg p-2 bg-red-500 text-white opacity-70 hover:opacity-100'>{pin?.save?.length} Saved</button>:
                  <button  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }} type='button' className='p-2 rounded-lg bg-red-500 text-white opacity-70 hover:opacity-100'>Save</button> 
                }
              </div>
              <div className="flex mt-2 justify-between items-center gap-2 w-10">
                {destination && (
                  <a href={destination} target="_blank" rel='noreferrer' className='hover:shadow-md bg-white flex items-center gap-2 text-black font-bold p-2 rounded-full opacity-70 hover:opacity-100'>
                    <BsArrowUpRightCircleFill/> {destination.length > 12?(destination.slice(0,9) + "..."): destination}
                  </a>
                )}

                {
                  userId === userInfo.googleId && (
                    <button type='button' 
                    className='flex w-full bg-white rounded-full text-black p-2 opacity-70 hover:opacity-100'
                    onClick={(e) =>{e.stopPropagation(); deletePost(_id);}}
                    >
                      <AiTwotoneDelete/>
                    </button>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
      <div>
        <Link to={`user-profile/${userId}`} className='flex gap-3 items-center' >
          <img className='w-7 mt-2 rounded-full' src={postedBy?.image} alt='user-profile'/>
          <p className="mt-2 font-semibold capitilize">{postedBy?.userName}</p>
        </Link>
      </div>
    </div>
  )
}

export default Pin