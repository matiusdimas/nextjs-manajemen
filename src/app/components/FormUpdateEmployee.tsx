"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'
interface FormUpdate {
    arrayForm: []
    onClick?: () => void
    cookies: string
}
export default function FormUpdateEmployee(props: FormUpdate) {
    const router = useRouter()
    const { arrayForm, onClick } = props
    const [loading, setLoading] = useState(false)
    const [updateEmployee, setUpdateEmployee] = useState({
        id: arrayForm.map((datas: any) => { return datas.id })[0],
        name: arrayForm.map((datas: any) => { return datas.name })[0],
        alamat: arrayForm.map((datas: any) => { return datas.alamat })[0],
    })
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        await axios.patch(`http://localhost:8080/employeers/${updateEmployee.id}/${updateEmployee.name}/${updateEmployee.alamat}`, {}, {
            headers: {
                Authorization: `Bearer ${props.cookies}`
            }
        }).then(r => console.log(r))
        router.refresh()
        setLoading(false)
        onClick!()
    }
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setUpdateEmployee((prev) => {
            return { ...prev, [name]: value }
        })
    }

    return (
        <section className='position-absolute z-3 start-0 end-0 vh-100 d-flex align-items-center justify-content-center flex-column backdrop-blur'>
            <form onSubmit={(e) => { !loading && handleSubmit(e) }} className='border border-black rounded px-5 py-3 bg-light'>
                <h1 className='fs-4'>Update User</h1>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' value={updateEmployee.name} onChange={(e) => handleChange(e)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="alamat" className="form-label">Alamat</label>
                    <input type="text" className="form-control" id="alamat" name='alamat' value={updateEmployee.alamat} onChange={(e) => handleChange(e)} />
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
