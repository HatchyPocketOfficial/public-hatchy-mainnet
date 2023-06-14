import React from 'react'
import useEagerConnect from '../hooks/useEagerConnect';

interface Web3ConnectionProps{
	children: JSX.Element
}
export default function Web3Connection({ children }: Web3ConnectionProps) {
  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  

  if (triedEager) {
    return children
  }else{
    return <></>
  }
}
