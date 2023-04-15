import React, { useEffect, useState } from 'react'
import { Button } from '@ui/Button'
import { useWalletLogin, useActiveWallet, useActiveProfile } from '@lens-protocol/react-web'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { notifyErrorMessage } from '@/common/notification'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/Avatar'
import { ImageIcon } from '@radix-ui/react-icons'
import ToolTip from '@ui/ToolTip'
import { parseIpfsPath } from '@/common/ipfs'
import CreatePost from '@/components/dialogs/CreatePost'

const ConnectionStatus = () => {
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false)
  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin()

  const { isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  })

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync()
    }

    const { connector } = await connectAsync()

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner()
      await login(signer)
    }
  }

  useEffect(() => {
    if (loginError) {
      notifyErrorMessage(loginError.message)
    }
  }, [loginError])

  // determine if user is connected
  const { data: wallet, loading: isActiveWalletLoading } = useActiveWallet()

  const { data: profile, error, loading: isProfileLoading } = useActiveProfile()

  if (isActiveWalletLoading) {
    return <div className="h-10 py-2 px-9 animate-pulse bg-gray-500 overflow-hidden rounded-md" />
  }

  if (wallet) {
    return (
      <>
        <div className="flex gap-3 items-center">
          <div className="flex items-center justify-center">
            <ToolTip message="Post" delayDuration={100}>
              <ImageIcon
                className="h-9 w-9 text-white cursor-pointer border-2 border-slate-400 rounded-md p-1 hover:bg-foreground"
                onClick={() => {
                  if (profile) setShowCreatePostDialog(true)
                }}
              />
            </ToolTip>
            {profile && <CreatePost open={showCreatePostDialog} setOpen={setShowCreatePostDialog} profile={profile} />}
          </div>
          <ToolTip message={profile ? profile.handle : wallet.address} delayDuration={100}>
            <Avatar>
              <AvatarImage
                className="bg-gray-500 border-5 border-white"
                src={parseIpfsPath(
                  profile && profile.picture && profile.picture.__typename === 'MediaSet'
                    ? profile.picture.original.url
                    : profile?.picture?.__typename === 'NftImage'
                    ? profile.picture.uri
                    : '',
                )}
              />
              <AvatarFallback />
            </Avatar>
          </ToolTip>
        </div>
      </>
    )
  }

  return (
    <div>
      <Button disabled={isLoginPending} onClick={onLoginClick}>
        Log in
      </Button>
    </div>
  )
}

export default ConnectionStatus
