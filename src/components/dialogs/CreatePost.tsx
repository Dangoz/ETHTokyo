import React, { useState, useEffect } from 'react'
import Dialog from '@ui/Dialog'
import {
  ContentFocus,
  ProfileOwnedByMe,
  useCreatePost,
  AppId,
  CollectPolicyType,
  WalletData,
  ImageType,
  CollectPolicyConfig,
} from '@lens-protocol/react-web'
import { upload } from '@/common/upload'
import { Button } from '@ui/Button'
import { ImageIcon, LayersIcon, MagicWandIcon } from '@radix-ui/react-icons'
import { uploadImage } from '@/common/upload'
import { ILocalFile, useFileSelect } from '@/hooks/useFileSelect'
import Textarea from '@ui/TextArea'
import Input from '@ui/Input'
import Image from 'next/image'
import { handleError, handleSuccess } from '@/common/notification'

interface CreatePostProps {
  open: boolean
  setOpen: (open: boolean) => void
  profile: ProfileOwnedByMe
  wallet: WalletData
}

const CreatePost: React.FC<CreatePostProps> = ({ open, setOpen, profile, wallet }) => {
  const [candidateFile, setCandidateFile] = useState<ILocalFile<ImageType> | null>(null)
  const [uploadError, setUploadError] = useState<Error | null>()
  const [isUploading, setIsUploading] = useState(false)
  const [prompt, setPrompt] = useState<string>('')
  const [collectFee, setCollectFee] = useState<number>(0)

  const { execute: create, error, isPending } = useCreatePost({ publisher: profile, upload })

  const openFileSelector = useFileSelect({
    onSelect: (fileList) => {
      setCandidateFile(fileList.item(0))
    },
    accept: [ImageType.JPEG, ImageType.PNG, ImageType.WEBP],
    multiple: false,
  })

  const handleCreatePostTest = async () => {
    try {
      setIsUploading(true)
      const imageURL = await uploadImage(candidateFile!)
      console.log('imageURL', imageURL)

      const collect: CollectPolicyConfig =
        collectFee > 0
          ? {
              type: CollectPolicyType.CHARGE,
              fee: 5 as any,
              followersOnly: false,
              metadata: {
                name: 'charged-post',
                // description: '',
                attributes: [],
              },
              mirrorReward: 0,
              recipient: wallet.address,
              timeLimited: false,
            }
          : {
              type: CollectPolicyType.FREE,
              metadata: {
                name: 'free-post',
                // description: '',
                attributes: [],
              },
              followersOnly: false,
            }

      const result = await create({
        appId: 'Glimpz' as AppId,
        content: prompt,
        contentFocus: ContentFocus.IMAGE,
        locale: 'en',
        media: [
          {
            altTag: 'model',
            url: imageURL,
            mimeType: ImageType.PNG || ImageType.JPEG,
          },
        ],
        collect,
      })

      console.log('result', result)
      handleSuccess('Post created successfully')
      setOpen(false)
    } catch (error) {
      handleError(error)
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setCandidateFile(null)
      setPrompt('')
      setCollectFee(0)
    }
  }, [open])

  return (
    <>
      <Dialog open={open} setOpen={setOpen} blur={'md'} close={true}>
        <div className="flex flex-col justify-center items-start gap-3 bg-slate-400/20 rounded-md p-6 backdrop-blur-md">
          {candidateFile ? (
            <div>
              <Image
                src={URL.createObjectURL(candidateFile)}
                alt="image"
                width={300}
                height={300}
                // className='w-auto h-auto'
              />
            </div>
          ) : (
            <Button onClick={openFileSelector} variant="subtle">
              <ImageIcon className="w-5 h-5 text-white mr-2" />
              Upload Image
            </Button>
          )}

          <Textarea
            className="h-20 min-w-[350px]"
            placeholder="Describe your Prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center gap-2 border-2 border-slate-700 h-10 px-2 border-r-0">
              <LayersIcon className="w-5 h-5 text-white" />
              Collect Fee
            </div>
            <Input
              className="w-24 border-2 border-slate-400 rounded-none"
              type="number"
              value={collectFee}
              onChange={(e) => {
                if (+e.target.value > 0 && +e.target.value <= 1000) {
                  setCollectFee(+e.target.value)
                }
              }}
            />
          </div>

          <Button onClick={handleCreatePostTest} variant="outline" disabled={isPending || isUploading}>
            {isPending || isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                Creating Post...
              </>
            ) : (
              <>
                <MagicWandIcon className="w-5 h-5 text-white mr-2" />
                Create Post
              </>
            )}
          </Button>
        </div>
      </Dialog>
    </>
  )
}

export default CreatePost
