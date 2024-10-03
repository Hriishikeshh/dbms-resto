import React from 'react';

export default function menu({ menuitems }) {
    return (
        <div>
            <h4>Restaurant Menu</h4>
            <ul>
                {menuitems.map((item) => (
                    <ul key={item.product_id}>
                        <li>product:{item.product_name}</li>
                        <p>desc:{item.description}</p>
                    </ul>
                ))}

            </ul>
        </div>
    );
}

export async function getServerSideProps() {
    const res = await fetch("http://localhost:3000/api/menu");
    const menuitems = await res.json();

    return {
        props: { menuitems }
    };
}