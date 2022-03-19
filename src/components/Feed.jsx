import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

import {client} from '../client'
import { feedQuery, searchQuery } from '../utils/Data'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const Feed = () => {

  const [loading, setloading] = useState(false)
  const [pins, setpins] = useState(null)
  const {categoryId} = useParams()

  useEffect(() => {
    setloading(true)

    if (categoryId){
      const query = searchQuery(categoryId)

      client.fetch(query).then((data) => {setpins(data); setloading(false)})
    }
    else {
      client.fetch(feedQuery).then((data) => {setpins(data); setloading(false)})
    }

  }, [categoryId])
  
  if(loading) return <Spinner message='we are adding new ideas to your feed!'/>


  return (
    <div>
      {
        pins?.length>0? <MasonryLayout pins={pins}/>:
       <Spinner message='No Pins Available'/>
      }
    </div>
  )
}

export default Feed