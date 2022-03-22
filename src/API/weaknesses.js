import axios from "axios";

export default async function Weaknesses(url, types) {
    let weaknessesList = [];
    let typeList = types.map(type => type.type.name);
    await axios
        .get(url)
        .then(weaknesses =>
            weaknesses.data.damage_relations.double_damage_from.map(weak => {
                if (!typeList.includes(weak.name) && !weaknessesList.includes(weak.name))
                    weaknessesList.push(weak.name)
            })
        )
    return weaknessesList;
}