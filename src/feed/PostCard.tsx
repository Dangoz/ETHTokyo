import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePublication, ProfileOwnedByMe, useWhoCollectedPublication, AnyPublication } from '@lens-protocol/react-web'
import { LockClosedIcon, LockOpen2Icon } from '@radix-ui/react-icons'
import {
  CollectState,
  Comment,
  isPostPublication,
  Post,
  useCollect,
  useFeed,
  useActiveProfile,
} from '@lens-protocol/react-web'
import { handleError, notifyErrorMessage, handleSuccess } from '@/common/notification'
import Dialog from '@ui/Dialog'
import {
  ContractType,
  LensGatedSDK,
  LensEnvironment,
  ScalarOperator,
  PublicationMainFocus,
} from '@lens-protocol/sdk-gated'
import { useSigner, useProvider } from 'wagmi'
import { handleInfo } from '@/common/notification'

interface PostCardProps {
  publication: AnyPublication
}

const PostCard: React.FC<PostCardProps> = ({ publication }) => {
  const { data: profile, error, loading: isProfileLoading } = useActiveProfile()
  const [isCollectedByProfile, setIsCollectedByProfile] = useState<boolean | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const { data: signer } = useSigner()
  const provider = useProvider()

  const { data: postData, loading } = usePublication({
    publicationId: publication.id,
  })

  const {
    data: publicationCollectorData,
    loading: isWhoCollectedLoading,
    hasMore,
    next,
  } = useWhoCollectedPublication({
    publicationId: publication.id,
  })

  const handleUnlockPrompt = async () => {
    try {
      setIsUnlocking(true)

      if (prompt !== '') {
        setShowPrompt(true)
        return
      }

      if (!postData || postData.__typename !== 'Post') {
        return
      }

      const sdk = await LensGatedSDK.create({
        provider,
        signer: signer!,
        env: LensEnvironment.Mumbai,
      })

      const encryptedMetadata = postData.metadata.content
      if (encryptedMetadata === null) {
        handleInfo('No prompt to unlock, Something went wrong, Please try again later')
        return
      }
      const { error, decrypted } = await sdk.gated.decryptMetadata(JSON.parse(encryptedMetadata))
      console.log('error', error) // in case something went wrong or you dont fullfill the criteria
      console.log('decrypted', decrypted) // otherwise, the decrypted MetadataV2 will be here

      const decryptedPrompt = decrypted?.content
      setPrompt(decryptedPrompt)
      setShowPrompt(true)
    } catch (error) {
      handleError(error)
    } finally {
      setIsUnlocking(false)
    }
  }

  useEffect(() => {
    console.log('publicationCollectorData', publicationCollectorData)
    if (publicationCollectorData === undefined) {
      return
    }
    if (publicationCollectorData.length === 0) {
      setIsCollectedByProfile(false)
      return
    }

    const isCollected = publicationCollectorData.some((collector) => collector.defaultProfile?.id === profile?.id)
    console.log('ids', publicationCollectorData[0].defaultProfile?.id, profile?.id)
    setIsCollectedByProfile(isCollected)
  }, [publicationCollectorData, profile])

  const {
    execute: collect,
    error: collectError,
    isPending: isCollecting,
  } = useCollect({
    collector: profile!,
    publication: publication,
  })

  const handleCollect = async () => {
    const result = await collect()
    setIsCollectedByProfile(true)
    handleSuccess('Collected')

    // if (result.isSuccess()) {
    //   setIsCollectedByProfile(true)
    //   handleSuccess('Collected')
    //   return
    // }

    // if (result.isFailure()) {
    //   notifyErrorMessage('Failed to collect')
    // }
  }

  useEffect(() => {
    console.error('collect error', collectError)
  }, [collectError])

  if (loading) {
    return (
      <>
        <div className=" w-28 min-h-[600px] animate-pulse bg-slate-700">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white">{}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div>
          {profile &&
            isCollectedByProfile === false &&
            (isCollecting ? (
              <div>Collecting...</div>
            ) : (
              <LockClosedIcon className="cursor-pointer" onClick={handleCollect} />
            ))}

          {profile &&
            isCollectedByProfile === true &&
            (isUnlocking ? (
              <div>Unlocking...</div>
            ) : (
              <LockOpen2Icon
                className="p-3 flex justify-center items-center float-right cursor-pointer"
                onClick={handleUnlockPrompt}
              />
            ))}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={postData?.__typename === 'Post' ? postData.metadata.media[0].original.url : ''}
            alt="image"
            className=""
            width={400}
          />
        </div>
      </div>

      <div>
        <Dialog open={showPrompt} setOpen={setShowPrompt} blur="sm">
          <div className="rounded-md w-28 h-28 overflow-y-scroll bg-red-500">{prompt}</div>
        </Dialog>
      </div>
    </>
  )
}

export default PostCard
