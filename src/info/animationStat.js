import {useRef} from "react";

export default function AnimationStat(props) {
    const block = useRef(null);
    const number = useRef(null);
    const animation = (value) => {
        block.current.animate([
                { height: '0%' },
                { height: `${value / 2.2 + 10}%` },
                { height: `${value / 2.2}%` }],
            { duration: 2000 })
        block.current.style.height = `${value / 2.2}%`;
        number.current.textContent = value;
    }
    setTimeout(animation, 1, props.value);

    return (
        <div ref={block} className="stats-block_filling">
            <p ref={number} className="stats-block_numb"/>
        </div>
    );
}