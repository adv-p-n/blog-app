import React from 'react'
import Container from '../components/container/Container'
import PostForm from '../components/postform/PostForm'

const AddPost = () => {
  return  (
    <div className='py-6'>
      <Container>
        <PostForm />
      </Container>
    </div>
  )
}

export default AddPost