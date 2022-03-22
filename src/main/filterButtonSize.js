import {useEffect, useState} from "react";
import clsx from "clsx";

export default function FilterButtonSize(props) {
    const [active, setActive] = useState({
        s: false,
        m: false,
        l: false
    });

    useEffect(() => {
        if (props.filter) {
            setActive({
                s: false,
                m: false,
                l: false
            });
        }
    }, [props.filter]);

    useEffect(() => {
        let countActive = 0;
        Object.keys(active).map(key => {
            if (active[key])
                props.select(key, props.flag);
            else
                countActive++;
        })
        if (countActive === Object.keys(active).length)
            props.select(null, `${props.flag}Clear`);
    }, [active]);

    return (
        <>
            <button onClick={() => setActive({
                    s: !active.s,
                    m: false,
                    l: false
                })}
                className={clsx("filter_btn", { "active-btn-size": active.s})}>S</button>
            <button onClick={() => setActive({
                    s: false,
                    m: !active.m,
                    l: false
                })}
                className={clsx("filter_btn padding", { "active-btn-size": active.m})}>M</button>
            <button onClick={() => setActive({
                    s: false,
                    m: false,
                    l: !active.l,
                })}
                className={clsx("filter_btn", { "active-btn-size": active.l})}>L</button>
        </>
    );
}