"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'
import { mutate } from 'swr'
interface FormAdd {
    onClick?: () => void
    cookies: string
}

export default function FormAddEmployee(props: FormAdd) {
    const router = useRouter()
    const { onClick } = props
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false)
    const [addEmployee, setAddUser] = useState({
        name: '',
        alamat: '',
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        if (!selectedFile) {
            alert('Please select a photo');
            setLoading(false)
            return;
        }

        if (selectedFile.size > 300 * 1024) {
            alert('File size exceeds 300KB');
            setLoading(false)
            return;
        }

        const response = await axios.post('http://localhost:8080/employeers', {
            name: addEmployee.name,
            alamat: addEmployee.alamat,
            image: selectedFile
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${props.cookies}`
            },
        });

        if (response.request.statusText === 'OK') {
            mutate(['http://localhost:8080/employeers', props.cookies]);
        }
        setLoading(false)
        onClick!()
    }
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setAddUser((prev) => {
            return { ...prev, [name]: value }
        })
    }
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file?.type === "image/jpeg" || file?.type === "image/jpg") {
            setSelectedFile(file);
        } else {
            setSelectedFile(null)
            alert("File Harus Bertipe Jpg/Jpeg")
        }
    }
    return (
        <section className='position-absolute z-3 start-0 end-0 vh-100 top-0 d-flex align-items-center justify-content-center flex-column backdrop-blur'>
            <form encType="multipart/form-data" onSubmit={(e) => { !loading && handleSubmit(e) }} className='border border-black rounded px-5 py-3 bg-light'>
                <h1 className='fs-4'>Add Employee</h1>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' value={addEmployee.name} onChange={(e) => handleChange(e)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="alamat" className="form-label">Alamat</label>
                    <input type="text" className="form-control" id="alamat" name='alamat' value={addEmployee.alamat} onChange={(e) => handleChange(e)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Photo <span className='fs-5 text-pink'>{`(File type jgp/jpeg, Maks: 300kb)`}</span></label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        accept="image/jpeg, image/jpg" // Hanya izinkan file JPG/JPEG
                        onChange={handleFileChange}
                    />
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
