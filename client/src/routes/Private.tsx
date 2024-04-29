import { ReactNode, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorState from '../components/ErrorState'
import Loader from '../components/Loader'
import {useSession} from '../components/Hooks'

type User = {
    permissions: string[]
    roles: string[]
  }
  
  type Params = {
    user?: User
    permissions?: string[]
    roles?: string[]
  }
  
  export function validateUserPermissions(params: Params) {
    const { user, permissions, roles } = params
  
    let hasAllPermissions = true
    let hasAllRoles = true
  
    if (permissions?.length) {
      const userPermissions = user?.permissions || []
  
      hasAllPermissions = permissions.every((permission) => {
        return userPermissions.includes(permission)
      })
    }
  
    if (roles?.length) {
      const userRoles = user?.roles || []
  
      hasAllRoles = roles.every((role) => {
        return userRoles.includes(role)
      })
    }
  
    return { hasAllPermissions, hasAllRoles }
  }
  

type Props = {
    permissions?: string[]
    roles?: string[]
    redirectTo?: string
    children: ReactNode
}

function PrivateRoute(props: Props) {
  const { permissions, roles, redirectTo = '/login', children } = props

  const { isAuthenticated, user, loadingUserData } = useSession()
  const { hasAllPermissions } = validateUserPermissions({
    user,
    permissions,
    roles
  })

  if (loadingUserData) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />
  }

  if (!hasAllPermissions) {
    return <Navigate to="/" />
  }

  return (
    <ErrorBoundary
      fallback={<ErrorState text="An error occurred in the application." />}
    >
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default PrivateRoute
