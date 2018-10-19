import React from 'react'
import SocialLogin from 'react-social-login'
import { Button } from "dapparatus"

const SocialButton = ({ children, triggerLogin, ...props }) => (
  <Button onClick={triggerLogin} {...props}>
    { children }
  </Button>
)

export default SocialLogin(SocialButton)
