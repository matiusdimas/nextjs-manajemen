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
    const router= useRouter()
    const { arrayForm, onClick } = props
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false)
    const [updateEmployee, setUpdateEmployee] = useState({
        id: arrayForm.map((datas: any) => { return datas.id })[0],
        name: arrayForm.map((datas: any) => { return datas.name })[0],
        alamat: arrayForm.map((datas: any) => { return datas.alamat })[0],
    })
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        if (!selectedFile) {
            alert('Please select a photo');
            return;
        }

        if (selectedFile.size > 300 * 1024) { // 300KB
            alert('File size exceeds 300KB');
            return;
        }
        console.log(selectedFile)
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
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file?.type === "image/jpeg" || file?.type === "image/jpg") {
            setSelectedFile(file);
        } else {
            alert("File Harus Bertipe Jpg/Jpeg")
        }
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
                <div className="mb-3">
                    <label htmlFor="photo" className="form-label">Photo <span className='fs-5 text-pink'>{`(File type jgp/jpeg, Maks: 300kb)`}</span></label>
                    <input
                        type="file"
                        className="form-control"
                        id="photo"
                        name="photo"
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
