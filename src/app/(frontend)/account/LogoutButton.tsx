'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { logoutAction } from './logout-action'

export const LogoutButton: React.FC = () => {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline">
        Uitloggen
      </Button>
    </form>
  )
}
