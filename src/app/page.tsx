"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'

export default function page() {
  const router = useRouter()
  const [user, setUser] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const checkUsername = /[a-zA-Z]/.test(user.username)
    const checkPassword = /[a-zA-Z]/.test(user.password)
    if (!checkUsername || !checkPassword) {
      return setLoading(false)
    };
    setLoading(false)
    const response = await axios.post('http://localhost:8080/login', {
      username: user.username,
      password: user.password,
    }, { withCredentials: true }).catch(err => console.log(err))
    if (response) return router.push('/dashboard')
    setMsg('Wrong Password Or Username')
    setLoading(false)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setMsg('')
    setUser((prev) => {
      return { ...prev, [name]: value }
    })
  }
  return (
    <section className='border vh-100 d-flex align-items-center justify-content-center flex-column'>
      <form onSubmit={e => handleSubmit(e)} className='border rounded px-5 py-3'>
        <h1 className='text-center'>Login</h1>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input onChange={(e) => handleChange(e)} type="text" className="form-control" id="username" name='username' placeholder='Input Username' />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input onChange={(e) => handleChange(e)} type="password" className="form-control" id="password" name='password' placeholder='******' />
        </div>

        {loading
          ?
          <button disabled className="btn btn-primary w-100">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </button>
          :
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        }
        {msg.length > 0 && (
          <p className='text-center text-danger'>{msg}</p>
        )}
      </form>
    </section>
  )
}
