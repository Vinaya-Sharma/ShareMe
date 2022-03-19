import React, {useState} from 'react'
import {AiOutlineCloudUpload} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'
import {useNavigate} from 'react-router-dom'

import {client} from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/Data' 

const CreatePin = ({user}) => {

  const [title, settitle] = useState("")
  const [about, setabout] = useState("")
  const [destination, setdestination] = useState("")
  const [loading, setloading] = useState(false)
  const [fields, setfields] = useState(null)
  const [category, setcategory] = useState(null)
  const [imgAsset, setimgAsset] = useState(null)
  const [wrongImgType, setwrongImgType] = useState(false)

  const navigate = useNavigate()

  const uploadImh = (e) =>{
    const {type, name} = e.target.files[0]

    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type==='image/gif' || type==='images/tiff' ){
      setwrongImgType(false)
      setloading(true)

      client.assets
      .upload('image', e.target.files[0], {
        contentType:type,
        filename:name
      })
      .then((document) => {
        setimgAsset(document)
        setloading(false)
      })
      .catch((error) =>{
        console.log(error)
      }
      )

    } else {
      setwrongImgType(true)
    }
  }

  const savePin = () =>{
    if (title && about && destination && imgAsset?._id && category){
      const doc = {
        _type: 'pin',
        title,
        description:about,
        destination,
        image: {
          _type:'image',
          asset:{
            _type:'reference',
            _ref: imgAsset?._id
          }
        },
        userId:user?._id,
        postedBy:{
          _type:'postedBy',
          _ref: user?._id
        },
        category
      }

      client.create(doc)
      .then(() => {
        navigate('/')
      })
    }else{
      setfields(true)
      setTimeout(() => {
        setfields(false)
      },2000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {
        fields && <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all fields</p>
      }
  <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
      <div className="bg-secondaryColor p-3 flex flex-0 7 w-full">
        <div className="flex justify-center items-center flex-col border-2 border-dotted border-grey-300 p-3 w-full h-420">
          {loading && <Spinner/>}
          {wrongImgType && <p>Wrong image type</p>}
          {!imgAsset? (
            <label>
              <div className='flex flex-col items-center justify-center h-full'>
              <div className="flex flex-col justify-center items-center">
                <p className='font-bold text-2xl'>
                  <AiOutlineCloudUpload/>
                </p>
                <div className="text-lg">Click to upload</div>
              </div>
              <p className='mt-32 text-gray-400'>Use high quality JPG, SVG, PNG, GIF or TIFF less than 20MB</p>
              </div>
              <input type='file'
              name='upload-img'
              onChange = {uploadImh}
              className='w-0 h-0'
              />
            </label>
          ): (
            <div className='relative h-full'>
              <img src={imgAsset?.url} alt='uploadedPic' className='h-full w-full'/>
              <button 
              type='button'
              onClick={() => setimgAsset(null)}
              className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
              >
                <MdDelete/>
              </button>
              </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
        <input
        type='text'
        value={title}
        className='outline-none text-xl sml:text-3xl font-bold border-2 border-gray-200 p-2'
        placeholder='add title'
        onChange={(e) => settitle(e.target.value)}
        />
        {
          user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img src={user.image} className='w-10 h-10 rounded-full' alt='user-profile' />
              <div className="font-bold">
                {user.userName}
              </div>
            </div>
          )
        }
        <input
        type='text'
        value={about}
        className='outline-none text-base text-xl sml:text-lg border-2 border-gray-200 p-2'
        placeholder='whats this about'
        onChange={(e) => setabout(e.target.value)}
        />
        <input
        type='text'
        value={destination}
        className='outline-none text-base text-xl sml:text-lg border-2 border-gray-200 p-2'
        placeholder='add a destination link'
        onChange={(e) => setdestination(e.target.value)}
        />
        <div className='flex flex-col'>
          <div>
            <p className='mb-2 font-semibold text-md sm:text-xl'>Select A Pin Category</p>
            <select
            onChange={(e) => setcategory(e.target.value)}
            className='outline-none w-4/5 text-base border-b-2 border-grey-200 p-2 rounded-md cursor-pointer'
            >
              <option value='other' className='bg-white'>Select Category</option>

            {
              categories.map((category) =>(
                <option
                className='text-base border-0 outline-none capitilize bg-white text-black'
                value={category.name}
                >{category.name}</option>
              ))
            }

            </select>
          </div>
          <div className="flex justify-end items-end mt-5">
            <button
            type='button'
            onClick={savePin}
            className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
            >Save Pin</button>
          </div>
        </div>
      </div>
  </div>
    </div>
  )
}

export default CreatePin