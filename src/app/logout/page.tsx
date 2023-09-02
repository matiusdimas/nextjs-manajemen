
import { cookies } from 'next/headers'
 
export default async function create() {
  cookies().delete('token')
}