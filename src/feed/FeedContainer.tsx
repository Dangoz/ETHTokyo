import React, { useEffect, useState } from 'react'
import {
  usePublications,
  useActiveProfile,
  ProfileId,
  PublicationMainFocus,
  AnyPublication,
} from '@lens-protocol/react-web'
import PostCard from './PostCard'
import dayjs from 'dayjs'

const FeedContainer = () => {
  const [activePublications, setActivePublications] = useState<AnyPublication[]>([])

  const { data: profile, error, loading: isProfileLoading } = useActiveProfile()
  const {
    data: defaultPublications,
    loading,
    hasMore,
    next,
  } = usePublications({
    profileId: profile ? profile.id : ('0x46d3' as ProfileId),
    observerId: profile?.id,
    metadataFilter: {
      restrictPublicationMainFocusTo: [PublicationMainFocus.Image],
      restrictPublicationLocaleTo: 'en',
    },
  })

  useEffect(() => {
    if (defaultPublications) {
      const visiblePublications = defaultPublications.filter(
        (publication) => publication.id && +dayjs(publication.createdAt) >= +dayjs('2023-04-15T19:46:45.000Z'),
      )
      console.log(visiblePublications.length, defaultPublications[3].createdAt)
      setActivePublications(visiblePublications)
    }
  }, [defaultPublications])

  return (
    <>
      <div className="flex flex-col items-center justify-center p-10 gap-5">
        {activePublications.map((publication, index) => (
          <PostCard key={index} publication={publication} />
        ))}
      </div>
    </>
  )
}

export default FeedContainer
