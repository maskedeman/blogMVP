
import { ReactNode, Suspense,useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import AuthContext from '../auth/Context';
import {useSession} from '../components/Hooks'


const ErrorState: React.FC<{ text: string }> = ({ text }) => (
    <div>
      <h1>Error</h1>
      <p>{text}</p>
    </div>
  );

  const Loader: React.FC = () => (
    <div>Loading...</div>
  );

type Props = {
    children: ReactNode
  }
  
  function PublicRoute(props: Props) {
    const { children } = props
  
    const { isAuthenticated } = useSession()
  
    if (isAuthenticated) {
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
  
  export default PublicRoute