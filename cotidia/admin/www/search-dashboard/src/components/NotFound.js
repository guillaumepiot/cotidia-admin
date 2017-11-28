import React from 'react'

import { Link } from 'react-router-dom'

import { FullScreen } from './elements/global'

const NotFound = () => (
  <FullScreen>
    <p>Sorry, the page you were looking for could not be found.</p>
    <p>Please go to the <Link to="/">home page</Link> to find your way around.</p>
  </FullScreen>
)

export default NotFound
