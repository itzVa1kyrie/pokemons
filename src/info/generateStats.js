import React from "react";
import AnimationStat from "./animationStat";

export default function GenerateStats(props) {
    return (
        <div className="additional-fill_stats">
            <div className="stats_block">
                {
                    Object.values(props.item.stats).map(value => {
                        return <AnimationStat value={value}/>;
                    })
                }
            </div>
            <div className="stats_block">
                <p className="stats-block_name">HP</p>
                <p className="stats-block_name">Attack</p>
                <p className="stats-block_name">Defense</p>
                <p className="stats-block_name">Special Attack</p>
                <p className="stats-block_name">Special Defense</p>
                <p className="stats-block_name">Speed</p>
            </div>
        </div>
    );
}