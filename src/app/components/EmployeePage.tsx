"use client"
import Button from '@/app/components/Button'
import Table from '@/app/components/Table'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import FormAddEmployee from './FormAddEmployee'
import axios from 'axios'

export default function EmployeePage({ cookie }: { cookie: string }) {
    const arrayDesc = ['Alamat', 'File Name', 'Created At', 'Updated At']
    const [add, setAdd] = useState(false)
    function handleAdd() {
        setAdd(!add)
    }
    const [checkUser, setCheckUser] = useState({ username: '', role: '' })
    useEffect(() => {
        async function handler() {
            const res = await axios.get('http://localhost:8080/me', { headers: { Authorization: `Bearer ${cookie}` } })
            setCheckUser({ ...res.data.data[0] })
            return res
        }
        handler()
    }, [cookie])

    async function Logout() {
        await axios.get('/api')
        window.location.href = '/';
    }
    return (
        <>
            <div className='container d-grid gap-4'>

                <div className='d-flex mt-5 container justify-content-between'>
                    <h1 className='fs-3'>{checkUser.username.length > 0 && (<>{checkUser.username}, role {checkUser.role}</>)}</h1>
                    <div className='d-flex gap-2'>
                        {checkUser.role === "ADMIN" && (
                            <Link href={'/dashboard'}><Button title='Back To Dashoard' className='btn-primary' /></Link>
                        )}
                        <Button title='Logout' className='btn-danger' onClick={() => Logout()} />
                    </div>
                </div>
                <div>
                    <Button title='Add New' className='btn-success' onClick={() => handleAdd()} />
                </div>
                <Table title='Name' arrayDesc={arrayDesc as []} cookie={cookie} />
            </div>
            {add && (
                <FormAddEmployee onClick={handleAdd} cookies={cookie} />
            )}
        </>
    )
}
