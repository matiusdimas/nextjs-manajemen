"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'
import { mutate } from 'swr'
interface FormAdd {
    onClick?: () => void
    cookies: string
}
export default function FormAddUser(props: FormAdd) {
    const router= useRouter()
    const { onClick } = props
    const [loading, setLoading] = useState(false)
    const [addUser, setAddUser] = useState({
        username: '',
        password: '',
        role: 'Admin',
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        await axios.post(`http://localhost:8080/users`, {...addUser}, {
            headers: {
                Authorization: `Bearer ${props.cookies}`
            }
        })
        mutate(['http://localhost:8080/users', props.cookies]);
        onClick!()
    }
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setAddUser((prev) => {
            return { ...prev, [name]: value }
        })
    }
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value; // Mendapatkan nilai yang dipilih oleh pengguna
        setAddUser((prev) => ({
            ...prev,
            role: newRole // Memperbarui nilai 'role' dalam updateUser
        }));
    };
    return (
        <section className='position-absolute z-3 start-0 end-0 vh-100 top-0 d-flex align-items-center justify-content-center flex-column backdrop-blur'>
            <form onSubmit={(e) => { !loading && handleSubmit(e) }} className='border border-black rounded px-5 py-3 bg-light'>
                <h1 className='fs-4'>Add User</h1>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name='username' value={addUser.username} onChange={(e) => handleChange(e)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="text" className="form-control" id="password" name='password' value={addUser.password} onChange={(e) => handleChange(e)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select onChange={handleRoleChange} value={addUser.role} id='role' name='role' className="form-select" aria-label="Default select example">
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>

                {loading
                    ?
                    <button disabled className="btn btn-primary w-100">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </button>
                    :
                    <div className='d-flex gap-2'>
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button type='button' onClick={onClick && onClick} className="btn btn-danger">Close</button>
                    </div>
                }
            </form>
        </section>
    )
}
