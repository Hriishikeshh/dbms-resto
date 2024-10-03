import React from "react";

export default function tables({tables}){
    return(
        <div>
            <ul>
                {tables.map((table)=>(
                    <div key={table.table_num}>
                        <li>Table {table.table_num}</li>
                        <li>status:{table.status}</li>
                        <p>Seats: {table.seats}</p>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export async function getServerSideProps(){
    const res=await fetch("http://localhost:3000/api/tables");
    const tables=await res.json();

    return{
        props:{tables}
    };
}
