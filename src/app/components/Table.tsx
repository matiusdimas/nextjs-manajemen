"use client"
import React, { useEffect, useState } from 'react'
import Button from './Button'
import FormUpdate from './FormUpdate'
import axios from 'axios';
import FormUpdateEmployee from './FormUpdateEmployee';

interface Table {
    title: string
    arrayDesc: []
    cookie: string
}

export const revalidate = 10;

export default function Table(props: Table) {
    const { title, arrayDesc } = props
    const [arrayData, setArrayData] = useState([])
    const [formUpdate, setFormUpdate] = useState([])
    let urls: string
    if (title === "Username") {
        urls = "http://localhost:8080/users"
    } else {
        urls = "http://localhost:8080/employeers"
    }
 
    useEffect(() => {
        async function getData() {
          try {
            const res = await axios.get(urls, { headers: { Authorization: `Bearer ${props.cookie}` } });
            setArrayData(res.data.data)
          } catch (error) {
            console.error("Terjadi kesalahan:", error);
          }
        }
      
        getData();
      }, []); 
    
    async function handleDelete(id: number) {
        const newData = arrayData.filter((data: any) => data.id !== id);
        setArrayData(newData)
        const res = await axios.delete(`${urls}/${id}`, {
            headers: {
                Authorization: `Bearer ${props.cookie}`
            }
        })
    }

    function handleUpdate(id: number) {
        const formData = arrayData.filter((data: any) => data.id == id);
        setFormUpdate(formData as [])
    }

    function handleClose() {
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
                            {arrayData.map((data: any, i: number) => (
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
                            {arrayData.map((data: any, i: number) => (
                                <tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>{data.name}</td>
                                    <td>{data.alamat}</td>
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
