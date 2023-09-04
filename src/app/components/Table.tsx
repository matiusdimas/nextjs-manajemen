"use client"
import React, { useEffect, useState } from 'react'
import Button from './Button'
import FormUpdate from './FormUpdate'
import axios from 'axios';
import FormUpdateEmployee from './FormUpdateEmployee';
import useSWR from 'swr';

interface Table {
    title: string
    arrayDesc: []
    cookie: string
}

const fetchData = async (url: string, cookie: string) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${cookie}`
        }
    });
    const data = await response.json();
    return data;
};

export default function Table(props: Table) {
    const { title, arrayDesc } = props
    const [formUpdate, setFormUpdate] = useState([])
    let urls: string
    if (title === "Username") {
        urls = "http://localhost:8080/users"
    } else {
        urls = "http://localhost:8080/employeers"
    }
    const { data, mutate } = useSWR([urls, props.cookie], ([url, cookie]) => fetchData(url, cookie))

    async function handleDelete(id: number) {
        await axios.delete(`${urls}/${id}`, {
            headers: {
                Authorization: `Bearer ${props.cookie}`
            }
        })
        await mutate()
    }

    function handleUpdate(id: number) {
        const formData = data.data.filter((data: any) => data.id == id);
        setFormUpdate(formData as [])
    }

    async function handleClose() {
        await mutate()
        setFormUpdate([])
    }
    function date(dates: string) {
        if (dates === null) { return "Not Updated" }
        const isoDate = dates;
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        // Membuat tanggal dan waktu yang lebih sederhana
        return `${year}-${month}-${day} ${hours}:${minutes}`
    }
    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{title}</th>
                        {arrayDesc.map((desc, i) => (
                            <th scope="col" key={i}>{desc}</th>
                        ))}
                        <th scope="col">More</th>
                    </tr>
                </thead>
                <tbody>
                    {title === "Username" ? (
                        <>
                            {data && data.data.map((data: any, i: number) => (
                                <tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{data.username}</td>
                                    <td>{data.password}</td>
                                    <td>{data.role}</td>
                                    <td>{date(data.createdAt)}</td>
                                    <td>{date(data.updatedAt)}</td>
                                    <td className='d-flex gap-2'>
                                        <Button title='Update' className='btn-primary' onClick={() => handleUpdate(data.id)} />
                                        <Button title='Delete' className='btn-danger' onClick={() => handleDelete(data.id)} />
                                    </td>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <>
                            {data && data.data.map((data: any, i: number) => (
                                <tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{data.name}</td>
                                    <td>{data.alamat}</td>
                                    <td>{data.nm_photo}</td>
                                    <td>{date(data.createdAt)}</td>
                                    <td>{date(data.updatedAt)}</td>
                                    <td className='d-flex gap-2'>
                                        <Button title='Update' className='btn-primary' onClick={() => handleUpdate(data.id)} />
                                        <Button title='Delete' className='btn-danger' onClick={() => handleDelete(data.id)} />
                                    </td>
                                </tr>
                            ))}
                        </>
                    )}
                </tbody>
            </table>
            {title === 'Username' ? (
                <>
                    {formUpdate.length > 0 && (
                        <FormUpdate cookies={props.cookie} arrayForm={formUpdate as []} onClick={() => handleClose()} />
                    )}
                </>
            ) : (
                <>
                    {formUpdate.length > 0 && (
                        <FormUpdateEmployee cookies={props.cookie} arrayForm={formUpdate as []} onClick={() => handleClose()} />
                    )}
                </>
            )}

        </>
    )
}
