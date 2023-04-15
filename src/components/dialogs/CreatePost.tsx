import React from 'react'
import Dialog from '@ui/Dialog'
import { ContentFocus, ProfileOwnedByMe, useCreatePost } from '@lens-protocol/react-web'
import { upload } from '@/common/upload'

interface CreatePostProps {
  open: boolean
  setOpen: (open: boolean) => void
  profile: ProfileOwnedByMe
}

const CreatePost: React.FC<CreatePostProps> = ({ open, setOpen, profile }) => {
  const { execute: create, error, isPending } = useCreatePost({ publisher: profile, upload })

  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await create({
      content: '',
      contentFocus: ContentFocus.IMAGE,
      locale: 'en',
    })
  }

  return (
    <>
      <Dialog open={open} setOpen={setOpen} blur={'md'}>
        <form onSubmit={handleCreatePost} className="flex flex-col justify-center items-center gap-3"></form>
      </Dialog>
    </>
  )
}

export default CreatePost
