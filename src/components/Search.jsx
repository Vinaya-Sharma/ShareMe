import React, {useState, useEffect} from 'react'

import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import {feedQuery, searchQuery} from '../utils/Data'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {

  const [pins, setpins] = useState(null)
  const [loading, setloading] = useState(false)

  useEffect(() => {
    if (searchTerm){
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query)
      .then((data) => {setpins(data); setloading(false)})


    }else{
      client.fetch(feedQuery)
      .then((data) => {setpins(data); setloading(false)})
    }
  }, [searchTerm])
  

  return (
    <div>
      {loading && <Spinner message='Searching For Pins'/>}
        
          {pins?.length!= 0 &&
            <MasonryLayout pins={pins}/>
          }

          {
            !pins && searchTerm!='' && !loading && <div>
              No Pins Found </div>
          }

    </div>
  )
}

export default Search