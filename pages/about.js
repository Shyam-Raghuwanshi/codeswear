import React, { useEffect } from 'react'

const about = ({findMode}) => {
  useEffect(() => {
    findMode()
  }, [])
  
  return (
    <div>about</div>
  )
}

export default about