import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function OthersProfile() {
    const { userId } = useParams();
    useEffect(() => {
        // get apis for all of them 
    }, [])
    return (
        <div>

        </div>
    )
}

export default OthersProfile
