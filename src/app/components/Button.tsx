import React from 'react'
interface Button {
    title: string
    className?: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
export default function Button(props: Button) {
    const {title, className, onClick} = props
    return (
        <button onClick={onClick && onClick} type="button" className={`btn ${className}`}>{title}</button>
    )
}
