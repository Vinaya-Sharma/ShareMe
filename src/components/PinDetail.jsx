import React, {useState, useEffect} from 'react'
import {MdDownloadForOffline} from  'react-icons/md'
import {Link, useParams} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'

import {client, urlFor} from '../client'
import MasonryLayout from './MasonryLayout'
import {pinDetailMorePinQuery, pinDetailQuery} from '../utils/Data'  
import Spinner from './Spinner'

const PinDetail = ({user}) => {

  const [pins, setPins] = useState(null)
  const [pinDetails, setPinDetails] = useState(null)
  const [comment, setcomment] = useState('')
  const [addingComment, setaddingComment] = useState(false)

  const {pinId} = useParams()

  const addComment = () =>{
    if(comment){
      setaddingComment(true)

      client
      .patch(pinId)
      .setIfMissing({comments:[]})
      .insert('after', 'comments[-1]', [{
        comment,
        _key:uuidv4(),
        postedBy:{
          _type:'postedBy',
          _ref:user._id
        }
      }])
      .commit()
      .then(() => {
        setaddingComment(false);
        setcomment('')
        window.location.reload()
      })
    }
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])
  

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)
    
    if (query){
      client.fetch(query)
      .then((data) => {
        setPinDetails(data[0])

        if (data[0]){
          query = pinDetailMorePinQuery(data[0])
          client.fetch(query)
          .then((resp) => {
            setPins(resp)
          })
        }
      })
    }
  }

  if (!pinDetails) return <Spinner message='Loading Pin...'/>
  console.log("pin stuff", pinDetails)
  console.log("userstuud", user)
  return (
    <>
    <div className='flex lg:flex-row  flex-col m-auto bg-white' style={{maxWidth:'1500px', borderRadius:'32px'}}>
      <div className="flex  justify-center items-center md:items-start flex-initial">
        <img className='rounded-t-3xl  rounded-b-lg' alt = 'userPost' src={pinDetails?.image && urlFor(pinDetails.image).url()}/>
      </div>

      <div className='.w-full p-5 flex-1 xl:min-w-620'>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <a href={`${pinDetails.image.asset.url}?dl=`}
            download
            onClick={(e) => e.stopPropagation()} 
            className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
            ><MdDownloadForOffline />
            </a>
          </div>
          <a className='mr-5' href={pinDetails.destination} target='_blank' rel='noreferer'>
          {pinDetails.destination.length>50? `${pinDetails.destination.slice(0,47)}...`: pinDetails.destination} </a>
        </div>
        <div className='ml-2'>
          <h1 className='text-4xl font-bold break-words mt-3'>
    {pinDetails.title}
          </h1>
          <p className="mt-3">
            {pinDetails.description}
          </p>
        </div>
        <Link to={`/user-profile/${pinDetails.postedBy._id}`} className='flex gap-2 mt-5 bg-white rounded-lg items-center'>
        <img className='w-7 mt-2 rounded-full' src={pinDetails.postedBy?.image} alt='user-profile'/>
          <p className="mt-2 font-semibold capitilize">{pinDetails.postedBy?.userName}</p>
        </Link>
        <h2 className='mt-5 text-2xl'>
          Comments
        </h2>

        <div className="max-h-370 overflow-y-auto">
          {
            pinDetails?.comments?.map((comment, i) => (
              <div key={i} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                  <img src={comment.postedBy.image} alt='user-profile' className='w-10 h-10 rounded-full cursor-pointer'/>
                    <div className="flex flex-col">
                      <p className='font-bold'>{comment.postedBy.userName}</p>
                      <p className='font-bold'>{comment.comment}</p>
                    </div>
              </div>
            ))
          }
        </div>

          <div className="flex items-center flex-wrap mt-3 gap-3">
          <Link to={`user-profile/${pinDetails._id}`} className='flex gap-2 mt-5 bg-white rounded-lg items-center'>
        <img className='w-7 mb-5 mt-2 rounded-full cursor-pointer' src={user?.image} alt='user-profile'/>
        </Link>
        <input
        type='text'
        placeholder='Add A Comment'
        value={comment}
        onChange={(e) => setcomment(e.target.value)}
        className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
        />
        <button 
        type='button'
        className='bg-red-500 text-white rounded-full px-6 py-2 font-semiBold text-base outline-none'
        onClick={addComment}
        >
          {addingComment?"Posting The Comment...": "Post"}
        </button>
          </div>
      </div>
    </div>
    {
        pins?.length>0? (
          <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More Like This
          </h2>
          <MasonryLayout pins = {pins}/>
          </>
        ):
       <div className="mt-10">
        <Spinner message='loading more pins'/>
       </div>
       
      }
    </>
  )
}

export default PinDetail