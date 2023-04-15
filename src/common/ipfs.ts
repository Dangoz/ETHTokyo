const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
export const parseIpfsPath = (str: string): string => {
  if (str.startsWith('ipfs://')) {
    return `${IPFS_GATEWAY}/${str.replace('ipfs://', '')}`
  }
  if (str.startsWith('ipfs:')) {
    return `${IPFS_GATEWAY}/${str}`
  }
  return str
}
