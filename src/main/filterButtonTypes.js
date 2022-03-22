import {useEffect, useState} from "react";
import clsx from "clsx";

export default function FilterButtonTypes(props) {
    const [active, setActive] = useState({
        types: false,
        weaknesses: false
    });

    useEffect(() => {
        if (props.filter) {
            setActive({
                types: false,
                weaknesses: false
            });
        }
    }, [props.filter]);

    useEffect(() => {
        if (active.types)
            props.select(props.name, "type");
        else if (active.weaknesses)
            props.select(props.name, "weak");
        else
            props.select(props.name, "clear");
    }, [active]);

    return (
        <>
            <button onClick={() => setActive({
                types: !active.types,
                weaknesses: false
            })} className={clsx("btn-type", { "active-btn-type": active.types })}>T</button>
            <button onClick={() => setActive({
                    types: false,
                    weaknesses: !active.weaknesses
                })} className={clsx("btn-weak", { "active-btn-type": active.weaknesses })}>W</button>
        </>
    );
}