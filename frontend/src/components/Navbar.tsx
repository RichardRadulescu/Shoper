import type { PropsWithChildren } from "react"

export default function Navbar( {children}: PropsWithChildren ){
    // logo + shopping cart + favorite + login/logout + admin page
    return (
        <>
        

        {children}
        </>
    )
}