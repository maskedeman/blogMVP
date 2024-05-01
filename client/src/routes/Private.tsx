import { ReactNode, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorState from '../components/ErrorState'
import Loader from '../components/Loader'
import {useSession} from '../components/Hooks'
import NavBar from '../components/NavBar';

type User = {
    permissions: string[]
    role: string
  }
  
  type Params = {
    user?: User
    permissions?: string[]
    role?: string
  }
  
  export function validateUserPermissions(params: Params) {
    const { user, permissions, role } = params
  
    let hasAllPermissions = true
    let hasRole = false
  
    if (permissions?.length) {
      const userPermissions = user?.permissions || []
  
      hasAllPermissions = permissions.every((permission) => {
        return userPermissions.includes(permission)
      })
    }
  
    if (role) {
      const userRole = user?.role || ''
  
      hasRole = userRole === role
    }
  
    return { hasAllPermissions, hasRole }
}
  

type Props = {
    permissions?: string[]
    role?: string
    redirectTo?: string
    children: ReactNode
}

function PrivateRoute(props: Props) {
  const { permissions, role, redirectTo = '/login', children } = props

  const { isAuthenticated, user, loadingUserData } = useSession()
//   const { hasAllPermissions, hasRole } = validateUserPermissions({
//     user: user ? { ...user, permissions: [], role: user.role } : undefined,
//     permissions,
//     role
// });

  if (loadingUserData) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />
  }

  // if (!hasAllPermissions || !hasRole) {
  //   return <Navigate to="/posts" />
  // }

  return (
    
    <>

    <ErrorBoundary
      fallback={<ErrorState text="An error occurred in the application." />}
    >
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </ErrorBoundary>
    </>
  )
}
export default PrivateRoute
